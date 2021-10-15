import {Component, OnInit} from '@angular/core';
import {HeightService} from "app/shared/services/height.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "app/shared/services/toast.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppParamsService} from "app/core/services/common-api/app-params.service";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {finalize} from "rxjs/operators";
import {HTTP_STATUS} from "app/app.constants";
import {ConfirmModalComponent} from "app/shared/components/confirm-modal/confirm-modal.component";
import {TrunkFormComponent} from "app/modules/partner-management/trunks-management/trunk-form/trunk-form.component";
import {AppParamFormComponent} from "app/modules/app-param/app-param/app-param-form/app-param-form.component";

@Component({
    selector: 'jhi-app-param',
    templateUrl: './app-param.component.html',
    styleUrls: ['./app-param.component.scss']
})
export class AppParamComponent implements OnInit {
    height: any;
    lstAppParam: any[] = [];

    columns = [
        {name: 'app_param.orderNo', size: 'small'},
        {name: 'app_param.type', size: 'medium'},
        {name: 'app_param.name', size: 'large'},
        {name: 'app_param.code', size: 'medium'},
        {name: 'app_param.value', size: 'medium'},
        {name: 'app_param.description', size: 'medium'},
        {name: 'partner.action', size: 'medium'},
    ];
    itemsPerPage: any;
    maxSizePage: any;
    page: any;
    totalItems: number = 0;
    formGroup: FormGroup = this.fb.group({
        parType: [null],
        parName: [null],
        parCode: [null],
        parStringValue: [null],
    });

    constructor(
        private heightService: HeightService,
        private fb: FormBuilder,
        private translateService: TranslateService,
        private spinner: NgxSpinnerService,
        private toastService: ToastService,
        private modalService: NgbModal,
        private appParamService: AppParamsService,
    ) {
    }

    ngOnInit(): void {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.maxSizePage = MAX_SIZE_PAGE;
        this.page = 0;
        this.search();
        this.onResize()

    }

    onResize() {
        this.height = this.heightService.onResizeWithoutFooter();
    }

    search() {
        const pageable = {};
        pageable[`page`] = this.page > 0 ? this.page - 1 : this.page;
        pageable[`size`] = this.itemsPerPage;
        this.onSearch(pageable);
    }

    onSearch(pageable: any) {
        this.showSpinner();
        const rawValues = {...this.formGroup.getRawValue(), ...pageable};
        console.log('value', rawValues);
        this.appParamService.search(rawValues).pipe(finalize(() => this.hideSpinner()))
            .subscribe((next: any) => {
                console.log('next', next);
                if (HTTP_STATUS.OK === next.status) {
                    console.log('page', this.page);
                    this.lstAppParam = next.body.content;
                    this.totalItems = next.body.totalElements;
                } else this.showUnknownErr();
            }, () => this.showUnknownErr());
    }

    loadPage(page: number) {
        console.log('page', page);
        const pageable = {};
        this.page = page;
        pageable[`page`] = page - 1;
        pageable[`size`] = this.itemsPerPage;
        this.onSearch(pageable);
    }

    changePageSize(event: any) {
        if (!event) return;
        this.itemsPerPage = event;
        const pageable = {};
        pageable[`page`] = this.page - 1;
        pageable[`size`] = this.itemsPerPage;
        this.onSearch(pageable);
    }

    onDeleteSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.delete",
            {paramName: param}));
    }

    showUnknownErr() {
        this.toastService.openErrorToast(this.translateService.instant('common.toastr.title.error'));
    }

    viewDetail(item: any) {

    }

    onEdit(item: any) {
        console.log('item', item);
        const dialogRef = this.modalService.open(AppParamFormComponent, {
            size: "lg",
            backdrop: "static",
            centered: true,
        });
        dialogRef.componentInstance.selectedParam = item;
        dialogRef.result.then(value => {
            if (value) {
                this.onUpdateSuccess(this.translateService.instant('app_param.param'));
                this.search();
            }
        });
    }

    onDelete(item: any) {
        const modalRef = this.modalService.open(ConfirmModalComponent, {
            centered: true,
            backdrop: "static",
            size: "sm"
        });
        modalRef.componentInstance.type = "delete";
        modalRef.componentInstance.param = '';
        modalRef.componentInstance.onCloseModal.subscribe(value => {
            console.log(value);
            if (value) {
                this.appParamService.delete(item.id).subscribe(
                    () => {
                        this.onDeleteSuccess(this.translateService.instant('partner.partner'));
                        this.search();
                    },
                    (err) => {
                        console.log(err);
                        if (err && err.error.message === 'using') {
                            this.toastService.openErrorToast(this.translateService.instant('common.toastr.messages.error.partnerIsUsing', {param: item.code}));
                            return;
                        }
                        this.showUnknownErr();
                    });
            }
        });
    }

    openDialog() {
        const dialogRef = this.modalService.open(AppParamFormComponent, {
            size: "lg",
            backdrop: "static",
            centered: true,
        });
        dialogRef.result.then(value => {
            if (value) {
                this.onSaveSuccess(this.translateService.instant('app_param.param'));
                this.search();
            }
        });
    }

    showSpinner() {
        this.spinner.show();
    }

    hideSpinner() {
        this.spinner.hide();
    }

    onSaveSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.add",
            {paramName: param}));
    }

    onUpdateSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.update",
            {paramName: param}));
    }
}
