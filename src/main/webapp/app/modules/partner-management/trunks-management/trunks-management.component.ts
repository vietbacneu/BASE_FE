import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TrunkFormComponent} from "app/modules/partner-management/trunks-management/trunk-form/trunk-form.component";
import {PartnerService} from "app/core/services/partner-management/partner.service";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "app/shared/services/toast.service";
import {Subscription} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {finalize} from "rxjs/operators";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {FormControl} from "@angular/forms";
import {ConfirmModalComponent} from "app/shared/components/confirm-modal/confirm-modal.component";

@Component({
    selector: 'jhi-trunks-management',
    templateUrl: './trunks-management.component.html',
    styleUrls: ['./trunks-management.component.scss']
})
export class TrunksManagementComponent implements OnInit, OnDestroy {
    @Input() isSaving: boolean;
    @Input() disable = true;
    isShow = false;
    isShowTable = false;
    subscription: Subscription = new Subscription();
    currentPartner: any;
    itemsPerPage: any;
    maxSizePage: any;
    page: any;
    totalItems: number;
    lstTrunks = [];
    networkElement = [
        {id: -1, shortName: this.translateService.instant('common.select.option.default')},
    ];
    keyword = new FormControl(null);
    columns = [
        {name: 'partner.orderNo', size: 'small'},
        {name: 'partner.trunk.code', size: 'medium'},
        {name: 'partner.trunk.name', size: 'medium'},
        {name: 'partner.trunk.trunkType', size: 'medium'},
        {name: 'partner.trunk.ccCode', size: 'medium'},
        {name: 'partner.trunk.capacity', size: 'medium'},
        {name: 'partner.status', size: 'medium'},
    ]

    constructor(
        private modalService: NgbModal,
        private partnerService: PartnerService,
        private translateService: TranslateService,
        private toastService: ToastService,
        private spinner: NgxSpinnerService
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.maxSizePage = MAX_SIZE_PAGE;
        this.page = 1;
    }

    ngOnInit(): void {
        this.findAllNetworkElement();
        this.getCurrentPartner();
        this.addColumn();
    }

    toggle() {
        this.isShow = !this.isShow;
    }

    addColumn() {
        if (this.isSaving) this.columns.push({name: 'partner.action', size: 'medium'});
    }

    findAllTrunkByPartner(partnerId: any) {
        const options = {};
        const pageable = {};
        options[`keyword`] = this.keyword.value;
        options[`partner`] = partnerId;
        pageable[`page`] = this.page - 1;
        pageable[`size`] = this.itemsPerPage;
        this.partnerService.searchPartnerTrunk(options, pageable).subscribe((next: any) => {
            console.log('next', next);
            this.isShowTable = true;
            this.lstTrunks = next.content;
            this.totalItems = next.totalElements;
        }, () => this.showUnknownErr());
    }

    openTrunkForm(isSaving: boolean, row?: any) {
        const dialogRef = this.modalService.open(TrunkFormComponent, {
            size: "lg",
            backdrop: "static",
            centered: true,
        });
        dialogRef.componentInstance.networkElement = this.networkElement;
        dialogRef.componentInstance.isSaving = isSaving;
        dialogRef.componentInstance.currentTrunk = row;
        dialogRef.componentInstance.onClose.subscribe(value => {
            console.log(value);
            if (value && !value.id) {
                value[`partner`] = this.currentPartner.id;
                this.showSpinner();
                this.partnerService.insertPartnerTrunk(value).pipe(finalize(() => this.hideSpinner())).subscribe((next: any) => {
                    console.log('insert trunk', next);
                    this.findAllTrunkByPartner(this.currentPartner.id);
                    this.onSaveSuccess(this.translateService.instant('partner.trunk.trunk').toLowerCase());
                    dialogRef.componentInstance.dismiss();
                }, (err: any) => {
                    if (err.error.message === 'existedTrunk') {
                        this.showErrMess('existedTrunk');
                        return;
                    }
                    this.showUnknownErr()
                });
            } else {
                value[`partner`] = this.currentPartner.id;
                this.showSpinner();
                this.partnerService.updatePartnerTrunk(value).pipe(finalize(() => this.hideSpinner())).subscribe((next: any) => {
                    console.log('insert trunk', next);
                    this.findAllTrunkByPartner(this.currentPartner.id);
                    this.onUpdateSuccess(this.translateService.instant('partner.trunk.trunk').toLowerCase());
                    dialogRef.componentInstance.dismiss();
                }, (err: any) => {
                    if (err.error.message === 'existedTrunk') {
                        this.showErrMess('existedTrunk');
                        return;
                    }
                    this.showUnknownErr()
                });
            }
        });
    }

    findAllNetworkElement() {
        this.partnerService.findAllNetworkElement().subscribe((next: any) => {
            console.log('network', next);
            if (next) {
                this.networkElement = [...this.networkElement, ...next];
            }
        }, () => this.showUnknownErr());
    }

    getCurrentPartner() {
        this.subscription.add(this.partnerService.currentPartner.subscribe(value => {
            if (value) {
                this.currentPartner = value;
                this.findAllTrunkByPartner(this.currentPartner.id);
            }
        }));
    }

    loadPage(page: number) {
        const pageable = {};
        this.page = page;
        pageable[`page`] = page - 1;
        pageable[`size`] = this.itemsPerPage;
        this.findAllTrunkByPartner(this.currentPartner.id);
    }

    changePageSize(event: any) {
        if (!event) return;
        this.itemsPerPage = event;
        const pageable = {};
        pageable[`page`] = this.page - 1;
        pageable[`size`] = this.itemsPerPage;
        this.findAllTrunkByPartner(this.currentPartner.id);
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
                this.partnerService.deletePartnerTrunk(item.id).subscribe(
                    () => {
                        this.onDeleteSuccess(this.translateService.instant('partner.trunk.trunk').toLowerCase());
                        this.findAllTrunkByPartner(this.currentPartner.id);
                    },
                    () => this.showUnknownErr());
            }
        });
    }

    onDeleteSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.delete",
            {paramName: param}));
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

    showErrMess(errCode: any, value?: any) {
        let errMess = '';
        if (errCode === 'existedTrunk') {
            errMess = this.translateService.instant('partner.validation.existed', {code: this.translateService.instant('partner.trunk.trunk')});
        }
        this.toastService.openErrorToast(errMess);
    }

    getStatus(status: any) {
        if (1 === status) return this.translateService.instant('common.table.status.active');
        else return this.translateService.instant('common.table.status.deactivate');
    }

    showSpinner() {
        this.spinner.show();
    }

    hideSpinner() {
        this.spinner.hide();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
