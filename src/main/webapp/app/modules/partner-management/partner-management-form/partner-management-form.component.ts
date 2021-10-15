import {Component, OnInit} from '@angular/core';
import {HeightService} from "app/shared/services/height.service";
import {PartnerService} from "app/core/services/partner-management/partner.service";
import {NgxSpinnerService} from "ngx-spinner";
import {finalize} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "app/shared/services/toast.service";
import {Router} from "@angular/router";

@Component({
    selector: 'jhi-partner-management-form',
    templateUrl: './partner-management-form.component.html',
    styleUrls: ['./partner-management-form.component.scss']
})
export class PartnerManagementFormComponent implements OnInit {
    isSaving = true;
    height: any;
    disable = true;
    partnerId: any;//id cua partner vua dc them moi
    lstPartnerContact = [];

    constructor(private heightService: HeightService,
                private partnerService: PartnerService,
                private spinnerService: NgxSpinnerService,
                private translateService: TranslateService,
                private toastService: ToastService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.prepareData();
    }

    onResize() {
        this.height = this.heightService.onResizeWithoutFooter();
    }

    prepareData() {
        this.onResize();
    }

    insertPartner(event: any) {
        console.log(event);
        this.showSpinner();
        this.partnerService.insertPartner(event).pipe(finalize(() => {
            this.disable = false;
            this.hideSpinner();
        })).subscribe((next: any) => {
            console.log(next);
            this.partnerId = next.id;
            this.partnerService.setCurrentPartner(next);
            this.onSaveSuccess(this.translateService.instant('partner.partner'));
        }, (error: any) => {
            console.log(error);
            if (error.error.message === 'existed') this.showErrMess(error.error.message, event);
            else this.showUnknownErr();
        });
    }

    showSpinner() {
        void this.spinnerService.show();
    }

    hideSpinner() {
        void this.spinnerService.hide();
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
        if (errCode === 'existed') {
            errMess = this.translateService.instant('partner.validation.existed', {code: value.code});
        } else if (errCode === 'existedContract') {
            errMess = this.translateService.instant('partner.validation.existed', {code: value.contractNo});
        } else if (errCode === 'partnerNotExist') {
            errMess = this.translateService.instant('partner.notExisted');
            void this.router.navigateByUrl('/partner-management');
        }
        this.toastService.openErrorToast(errMess);
    }
}
