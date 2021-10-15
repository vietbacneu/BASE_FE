import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeightService} from "app/shared/services/height.service";
import {PartnerService} from "app/core/services/partner-management/partner.service";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "app/shared/services/toast.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
    selector: 'jhi-partner-management-detail',
    templateUrl: './partner-management-detail.component.html',
    styleUrls: ['./partner-management-detail.component.scss']
})
export class PartnerManagementDetailComponent implements OnInit, OnDestroy {
    isSaving = false;
    disable = true;
    height: any;
    lstPartnerContact = [];
    currentPartner: any;
    subscription: Subscription = new Subscription();

    constructor(private heightService: HeightService,
                private partnerService: PartnerService,
                private translateService: TranslateService,
                private toastService: ToastService,
                private router: Router) {
        this.prepareData();
    }

    ngOnInit(): void {
        this.onResize();
    }

    onResize() {
        this.height = this.heightService.onResizeWithoutFooter();
    }

    prepareData() {
        this.subscription.add(this.partnerService.currentPartner.subscribe((value: any) => {
            if (value) {
                this.currentPartner = value;
            } else {
                this.showErrMess('partnerNotExist');
            }
        }));
    }

    showErrMess(errCode: any, value?: any) {
        let errMess = '';
        if (errCode === 'partnerNotExist') {
            errMess = this.translateService.instant('partner.notExisted');
            void this.router.navigateByUrl('/partner-management');
        }
        this.toastService.openErrorToast(errMess);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
