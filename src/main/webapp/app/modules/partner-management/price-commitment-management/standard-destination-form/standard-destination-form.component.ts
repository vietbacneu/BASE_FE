import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeightService} from "app/shared/services/height.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {ValidationService} from "app/shared/services/validation.service";
import {PartnerService} from "app/core/services/partner-management/partner.service";
import {of, Subscription} from "rxjs";
import {concatMap} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "app/shared/services/toast.service";
import {Router} from "@angular/router";
import {Constants} from "app/app.constants";

@Component({
    selector: 'jhi-standard-destination-form',
    templateUrl: './standard-destination-form.component.html',
    styleUrls: ['./standard-destination-form.component.scss']
})
export class StandardDestinationFormComponent implements OnInit, OnDestroy {
    height: any;
    totalInItems = 0;
    totalOutItems = 0;
    pageIn = 0;
    pageOut = 0;
    itemsPerPage = ITEMS_PER_PAGE;
    maxSizePage = MAX_SIZE_PAGE;
    lstPriceIn = [];
    lstPriceOut = [];
    inComingPriceSelect = [];
    outGoingPriceSelect = [];
    lstOutGoingDest = [];
    lstInComingDest = [];
    subscription: Subscription = new Subscription();
    currentPartner: any;
    totalInComingFlow = 0;
    totalOutGoingFlow = 0;
    totalInComing = 0;
    totalOutGoing = 0;
    Constant = Constants;
    lstService = [
        {id: -1, serviceName: this.translateService.instant('common.select.option.default')}
    ];

    columns = [
        {name: 'partner.orderNo', size: 'small'},
        {name: 'partner.priceOut.dest', size: 'medium'},
        {name: 'partner.commitment.flow2', size: 'medium'},
        {name: 'partner.priceCommitment', size: 'medium'},
        {name: 'partner.commitment.overPrice', size: 'medium'},
        {name: 'partner.commitment.total', size: 'medium'},
        {name: 'partner.action', size: 'medium'},
    ];

    columnsTotal = [
        {name: '', size: 'small'},
        {name: 'partner.commitment.flow2', size: 'medium'},
        {name: 'partner.commitment.total', size: 'medium'},
    ];
    formGroup: FormGroup = this.fb.group({
        cmtCode: [null, [Validators.required, Validators.maxLength(200)]],
        cmtName: [null, [Validators.required, Validators.maxLength(200)]],
        fromDate: [null, Validators.required],
        toDate: [null, Validators.required],
        service: [-1, ValidationService.required()],
        adjourn: [null],
        description: [null, Validators.maxLength(1000)],
    });

    inComingForm: FormGroup = this.fb.group({
        dest: [-1, ValidationService.required()],
        cmtPrice: [null, Validators.maxLength(200)],
        overPrice: [null, Validators.maxLength(200)],
        flow: [null, Validators.maxLength(200)],
    });

    outGoingForm: FormGroup = this.fb.group({
        dest: [-1, ValidationService.required()],
        cmtPrice: [null, Validators.maxLength(200)],
        overPrice: [null, Validators.maxLength(200)],
        flow: [null, Validators.maxLength(200)],
    });

    constructor(
        private heightService: HeightService,
        private fb: FormBuilder,
        private partnerService: PartnerService,
        private translateService: TranslateService,
        private spinner: NgxSpinnerService,
        private toastService: ToastService,
        private router: Router) {
        this.pageIn = 1;
        this.pageOut = 1;
    }

    ngOnInit(): void {
        this.prepareData()
    }

    prepareData() {
        this.onResize();
        this.getCurrentPartner();
        this.findAllServices();
        this.formGroup.markAsUntouched();
    }

    getCurrentPartner() {
        this.subscription.add(
            this.partnerService.currentPartner.pipe(concatMap((next: any) => {
                if (!next) {
                    this.showErrMess('partnerNotExist');
                    return of(null)
                } else this.currentPartner = next;
                return this.findAllDestinationByPartnerId(next.id);
            })).subscribe((dest: any) => {
                console.log(`dest`, dest);
                if (dest) {
                    this.lstInComingDest = dest.lstInComingDest;
                    this.lstOutGoingDest = dest.lstOutGoingDest;
                }
            }, () => this.showUnknownErr())
        );
    }

    findAllServices() {
        this.partnerService.findAllServices().subscribe((next: any) => {
            if (next) this.lstService = [...this.lstService, ...next];
        }, () => this.showUnknownErr());
    }

    findAllDestinationByPartnerId(partnerId: any) {
        return this.partnerService.findAllDestinationByPartnerId(partnerId);
    }

    onResize() {
        this.height = this.heightService.onResizeWithoutFooter();
    }

    onSave() {
        this.formGroup.markAllAsTouched();
        console.log(this.formGroup.getRawValue());
    }

    addInComing() {
        const currentRow = this.inComingForm.getRawValue();
        currentRow[`destinationName`] = this.toChar(this.inComingPriceSelect);
        currentRow[`total`] = currentRow.cmtPrice * currentRow.flow;
        console.log('currentRow', currentRow);
        this.lstPriceIn.push(currentRow);
        this.calculateTotalAndFlow(Constants.INCOMING);
    }

    addOutGoing() {
        const currentRow = this.outGoingForm.getRawValue();
        currentRow[`destinationName`] = this.toChar(this.outGoingPriceSelect);
        currentRow[`total`] = currentRow.cmtPrice * currentRow.flow;
        console.log('currentRow', currentRow);
        this.lstPriceOut.push(currentRow);
        this.calculateTotalAndFlow(Constants.OUTGOING);
    }

    calculateTotalAndFlow(direction: any) {
        if (Constants.INCOMING === direction) {
            this.totalInComing = 0;
            this.totalInComingFlow = 0;
            this.lstPriceIn.forEach((value: any) => {
                this.totalInComingFlow += Number(value.flow);
                this.totalInComing += value.total;
            });
        } else {
            this.totalOutGoing = 0;
            this.totalOutGoingFlow = 0;
            this.lstPriceOut.forEach((value: any) => {
                this.totalOutGoingFlow += Number(value.flow);
                this.totalOutGoing += value.total;
            });
        }
    }

    toChar(arr: any[]) {
        let str = '';
        const allDest = [...this.lstOutGoingDest, ...this.lstInComingDest];
        if (arr && arr.length > 0) {
            arr.forEach((value: any) => {
                const destName = allDest.find((dest: any) => dest.id === value) ? allDest.find((dest: any) => dest.id === value).destination : '';
                str += `${destName},`;
            });
        }
        return str ? str.substring(0, str.length - 1) : '';
    }

    openModal(item: any, direction?: any) {

    }

    onDelete(item: any) {

    }

    loadPageIn(page) {

    }

    loadPageOut(page) {

    }

    changePageSizeIn(event) {

    }

    changePageSizeOut(event) {

    }

    showUnknownErr() {
        this.toastService.openErrorToast(this.translateService.instant('common.toastr.title.error'));
    }

    showErrMess(errCode: any, value?: any) {
        let errMess = '';
        if (errCode === 'partnerNotExist') {
            errMess = this.translateService.instant('partner.notExisted');
            void this.router.navigateByUrl('/partner-management');
        }
        this.toastService.openErrorToast(errMess);
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
