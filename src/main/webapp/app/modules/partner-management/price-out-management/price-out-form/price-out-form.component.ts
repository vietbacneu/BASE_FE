import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeightService} from "app/shared/services/height.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {PartnerService} from "app/core/services/partner-management/partner.service";
import {TranslateService} from "@ngx-translate/core";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "app/shared/services/toast.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {PriceOutAddUpdateComponent} from "app/modules/partner-management/price-out-management/price-out-form/price-out-add-update/price-out-add-update.component";
import {CommonService} from "app/shared/services/common.service";
import {finalize} from "rxjs/operators";
import {Subscription} from "rxjs";
import {Constants, CREATION_METHOD} from "app/app.constants";
import {ConfirmModalComponent} from "app/shared/components/confirm-modal/confirm-modal.component";

@Component({
    selector: 'jhi-price-out-form',
    templateUrl: './price-out-form.component.html',
    styleUrls: ['./price-out-form.component.scss']
})
export class PriceOutFormComponent implements OnInit, OnDestroy {
    height: any;
    itemsPerPage: any;
    maxSizePage: any;
    page: any;
    totalItems: number = 0;

    formGroup: FormGroup = this.fb.group({
        destinationName: new FormControl(null),
        startDate: new FormControl(null),
        status: new FormControl(-1),
        code: new FormControl(null),
        endDate: new FormControl(null),
    });
    columns = [
        {name: 'partner.orderNo', size: 'medium'},
        {name: 'partner.priceOut.dest', size: 'medium'},
        {name: 'partner.priceOut.code', size: 'medium'},
        {name: 'partner.priceOut.price', size: 'medium'},
        {name: 'partner.priceOut.block', size: 'medium'},
        {name: 'partner.status', size: 'medium'},
        {name: 'partner.priceOut.fromDate', size: 'medium'},
        {name: 'partner.priceOut.toDate', size: 'medium'},
        {name: 'partner.priceOut.searchMethod', size: 'large'},
        {name: 'partner.priceOut.creationMethod', size: 'large'},
        {name: 'partner.priceOut.modifiedDate', size: 'large'},
        {name: 'partner.priceOut.modifiedBy', size: 'medium'},
        {name: 'partner.action', size: 'medium'},
    ];
    lstStatus = [
        {value: -1, label: this.translateService.instant('common.select.option.all')},
        {value: Constants.STATUS_ACTIVE, label: this.translateService.instant('partner.priceOut.active')},
        {value: Constants.STATUS_INACTIVE, label: this.translateService.instant('partner.priceOut.inactive')},
        {value: Constants.STATUS_WARNING, label: this.translateService.instant('partner.priceOut.warning')},
    ];
    lstPriceOut = [];
    subscription: Subscription = new Subscription();
    currentPartner: any;
    Constants = Constants;

    constructor(private heightService: HeightService,
                private fb: FormBuilder,
                private partnerService: PartnerService,
                private translateService: TranslateService,
                private spinner: NgxSpinnerService,
                private toastService: ToastService,
                private router: Router,
                private modalService: NgbModal) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.maxSizePage = MAX_SIZE_PAGE;
        this.page = 0;
    }

    ngOnInit(): void {
        this.prepareData();
    }

    prepareData() {
        this.getCurrentPartner();
        this.onResize();
        this.onSearch();
    }

    onResize() {
        this.height = this.heightService.onResizeWithoutFooter();
    }

    onSearch(pageable?: any) {
        if (!this.currentPartner || this.formGroup.invalid) return;
        const rawValues = this.formGroup.getRawValue();
        rawValues[`partner`] = this.currentPartner.id;
        if (!pageable) {
            pageable = {};
            pageable[`page`] = 0;
            pageable[`size`] = this.itemsPerPage;
            pageable[`sort`] = ['modified_date,desc'];
        }
        this.partnerService.searchOutGoingPrice(rawValues, pageable).subscribe((next: any) => {
            console.log('next', next);
            this.lstPriceOut = next.content;
            this.totalItems = next.totalElements;
        }, () => this.showUnknownErr());
    }

    getCurrentPartner() {
        this.subscription.add(this.partnerService.currentPartner.subscribe(value => {
            if (value) {
                this.currentPartner = value;
            } else {
                this.showErrMess('partnerNotExist');
            }
        }));
    }

    loadPage(page: number) {
        console.log('page', page);
        const pageable = {};
        this.page = page;
        pageable[`page`] = page - 1;
        pageable[`size`] = this.itemsPerPage;
        pageable[`sort`] = ['modified_date,desc'];
        this.onSearch(pageable);
    }

    changePageSize(event: any) {
        if (!event) return;
        this.itemsPerPage = event;
        const pageable = {};
        pageable[`page`] = this.page - 1;
        pageable[`size`] = this.itemsPerPage;
        pageable[`sort`] = ['modified_date,desc'];
        this.onSearch(pageable);
    }

    openPriceOutForm(isSaving: boolean, row?: any) {
        const dialogRef = this.modalService.open(PriceOutAddUpdateComponent, {
            size: "lg",
            backdrop: "static",
            centered: true,
        });
        let statusForAdd: any[];
        if (row && Constants.STATUS_WARNING !== row.status || isSaving) statusForAdd = this.lstStatus.filter(value => value.value !== Constants.STATUS_WARNING);
        else statusForAdd = this.lstStatus;
        dialogRef.componentInstance.isSaving = isSaving;
        dialogRef.componentInstance.lstStatus = statusForAdd;
        dialogRef.componentInstance.currentPriceOut = row;
        dialogRef.componentInstance.isDisableStatus = row && Constants.STATUS_WARNING === row.status;
        dialogRef.componentInstance.onClose.subscribe(value => {
            value[`modifiedBy`] = CommonService.getCurrentUser().name;
            console.log('value', value);
            if (value) {
                this.saveOutGoingPrice(value, dialogRef);
            }
        });
    }

    onApprove(row: any) {
        const modalRef = this.modalService.open(ConfirmModalComponent, {
            centered: true,
            backdrop: "static"
        });
        modalRef.componentInstance.type = "approve";
        modalRef.componentInstance.param = '';
        modalRef.componentInstance.onCloseModal.subscribe(value => {
            console.log(value);
            if (value) {
                row[`status`] = Constants.STATUS_ACTIVE;
                this.doApprove(row);
            }
        });
    }

    doApprove(outGoingPrice: any) {
        this.partnerService.updateOutGoingPrice(outGoingPrice).pipe(finalize(() => this.hideSpinner())).subscribe((next: any) => {
            console.log('next approve price', next);
            this.onApproveSuccess();
            this.loadPage(1);
        }, (err: any) => {
            if (err && err.error.message === "existedDestination") {
                this.showErrMess("existedDestination");
                return;
            }
            this.showUnknownErr();
        });
    }

    saveOutGoingPrice(outGoingPrice: any, dialogRef: any) {
        this.showSpinner();
        if (!outGoingPrice.id) {
            this.partnerService.insertOutGoingPrice(outGoingPrice).pipe(finalize(() => this.hideSpinner())).subscribe((next: any) => {
                console.log('next add price', next);
                this.onSaveSuccess(this.translateService.instant('partner.priceOut').toLowerCase());
                dialogRef.componentInstance.onCancel();
                this.loadPage(1);
            }, (err: any) => {
                if (err && err.error.message === "existedDestination") {
                    this.showErrMess("existedDestination");
                    return;
                }
                this.showUnknownErr();
            });
        } else {
            this.partnerService.updateOutGoingPrice(outGoingPrice).pipe(finalize(() => this.hideSpinner())).subscribe((next: any) => {
                console.log('next update price', next);
                this.onUpdateSuccess(this.translateService.instant('partner.priceOut').toLowerCase());
                dialogRef.componentInstance.onCancel();
                this.loadPage(1);
            }, (err: any) => {
                if (err && err.error.message === "existedDestination") {
                    this.showErrMess("existedDestination");
                    return;
                }
                this.showUnknownErr();
            });
        }
    }

    onDelete(item: any) {
        const modalRef = this.modalService.open(ConfirmModalComponent, {
            centered: true,
            backdrop: "static"
        });
        modalRef.componentInstance.type = "delete";
        modalRef.componentInstance.param = '';
        modalRef.componentInstance.onCloseModal.subscribe(value => {
            console.log(value);
            if (value) {
                this.partnerService.deleteOutGoingPrice(item.id).subscribe(() => {
                    this.onDeleteSuccess(this.translateService.instant('partner.priceOut').toLowerCase());
                    this.onSearch();
                }, () => this.showUnknownErr());
            }
        });
    }

    getStatus(status: any) {
        if (Constants.STATUS_ACTIVE === status) return this.translateService.instant('partner.priceOut.active');
        else if (Constants.STATUS_INACTIVE === status) return this.translateService.instant('partner.priceOut.inactive');
        else if (Constants.STATUS_WARNING === status) return this.translateService.instant('partner.priceOut.warning');
        else return status;
    }

    getCreationMethod(method: any) {
        if (CREATION_METHOD.ENTERED === method) return this.translateService.instant('partner.priceOut.import.entered');
        else if (CREATION_METHOD.SINGLE === method) return this.translateService.instant('partner.priceOut.import.single');
        else if (CREATION_METHOD.MANUAL === method) return this.translateService.instant('partner.priceOut.import.manual');
        else if (CREATION_METHOD.AUTO === method) return this.translateService.instant('partner.priceOut.import.auto');
        else return method;
    }

    getMatchType(matchType: any) {
        if (Constants.SEARCH_METHOD_LIKE === matchType) return this.translateService.instant('partner.priceOut.searchMethod.like');
        else if (Constants.SEARCH_METHOD_EXACTLY === matchType) return this.translateService.instant('partner.priceOut.searchMethod.exactly');
        else return matchType;
    }

    onValidDate() {
        debugger
        const startDateControl = this.formGroup.get('startDate');
        const endDateControl = this.formGroup.get('endDate');
        endDateControl.setErrors(null);
        startDateControl.setErrors(null);
        if (endDateControl.value && startDateControl.value && endDateControl.value < startDateControl.value) {
            endDateControl.setErrors({small: true});
        }
    }

    onDeleteSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.delete",
            {paramName: param}));
    }

    showErrMess(errCode: any, value?: any) {
        let errMess = '';
        if (errCode === 'existedDestination') {
            errMess = this.translateService.instant('partner.validation.existed', {code: this.translateService.instant('partner.priceOut.dest')});
        }
        if (errCode === 'partnerNotExist') {
            errMess = this.translateService.instant('partner.notExisted');
            void this.router.navigateByUrl('/partner-management');
        }
        this.toastService.openErrorToast(errMess);
    }

    showUnknownErr() {
        this.toastService.openErrorToast(this.translateService.instant('common.toastr.title.error'));
    }

    onSaveSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.add",
            {paramName: param}));
    }

    onUpdateSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.update",
            {paramName: param}));
    }

    onApproveSuccess() {
        this.toastService.openSuccessToast(this.translateService.instant("outsourcingPlan.toast.approveSuccess",));
    }

    showSpinner() {
        this.spinner.show();
    }

    hideSpinner() {
        this.spinner.hide();
    }

    displayFieldHasError(field: string) {
        return {
            "has-error": this.isFieldValid(field)
        };
    }

    isFieldValid(field: string) {
        return this.formGroup.get(field).invalid && this.formGroup.get(field).touched;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
