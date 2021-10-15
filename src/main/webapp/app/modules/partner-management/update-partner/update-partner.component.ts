import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeightService} from "app/shared/services/height.service";
import {FormBuilder} from "@angular/forms";
import {PartnerService} from "app/core/services/partner-management/partner.service";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "app/shared/services/toast.service";
import {NgxSpinnerService} from "ngx-spinner";
import {finalize} from "rxjs/operators";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector: 'jhi-update-partner',
    templateUrl: './update-partner.component.html',
    styleUrls: ['./update-partner.component.scss']
})
export class UpdatePartnerComponent implements OnInit, OnDestroy {
    height: number;
    disable = false;
    isSaving = true;
    isUpdate = true;
    currentPartner: any;
    subscription: Subscription = new Subscription();

    constructor(
        private heightService: HeightService,
        private fb: FormBuilder,
        private partnerService: PartnerService,
        private translateService: TranslateService,
        private toastService: ToastService,
        private spinner: NgxSpinnerService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.prepareData();
    }

    prepareData() {
        this.onResize();
        this.getCurrentPartner();
    }

    getCurrentPartner() {
        this.subscription.add(this.partnerService.currentPartner.subscribe(value => {
            if (value) {
                this.currentPartner = value;
                this.disable = false;
            } else {
                this.disable = true;
                this.showErrMess('partnerNotExist');
            }
        }));
    }

    savePartner(event: any) {
        this.showSpinner();
        this.partnerService.updatePartner(event).pipe(finalize(() => this.hideSpinner())).subscribe((value: any) => {
            if (value) {
                this.partnerService.setCurrentPartner(value);
                this.onUpdateSuccess(this.translateService.instant('partner.partner'));
            }
        }, (err: any) => {
            if (err && err.error.message === 'existed') {
                this.showErrMess('existed', event);
                return;
            }
            this.showUnknownErr();
        });
    }

    onResize() {
        this.height = this.heightService.onResizeWithoutFooter();
    }

    showUnknownErr() {
        this.toastService.openErrorToast(this.translateService.instant('common.toastr.title.error'));
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

    onSaveSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.add",
            {paramName: param}));
    }

    onUpdateSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.update",
            {paramName: param}));
    }

    showSpinner() {
        void this.spinner.show();
    }

    hideSpinner() {
        void this.spinner.hide();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
