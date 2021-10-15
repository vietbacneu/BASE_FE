import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ValidationService} from "app/shared/services/validation.service";
import {Constants, CREATION_METHOD} from "app/app.constants";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {HeightService} from "app/shared/services/height.service";
import {PartnerService} from "app/core/services/partner-management/partner.service";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "app/shared/services/toast.service";
import * as moment from "moment";
import {Router} from "@angular/router";

@Component({
    selector: 'jhi-price-in-add-update',
    templateUrl: './price-in-add-update.component.html',
    styleUrls: ['./price-in-add-update.component.scss']
})
export class PriceInAddUpdateComponent implements OnInit, OnDestroy {
    @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
    currentPriceIn: any;
    isSaving: boolean;
    isDisableBtn: boolean;
    isDisableStatus: boolean;
    height: number;
    lstStatus = [];
    currentPartner: any;
    subscription: Subscription = new Subscription();
    formGroup: FormGroup = this.fb.group({
        destinationName: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
        code: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
        block: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
        price: new FormControl(null, [Validators.required, Validators.maxLength(200)]),
        status: new FormControl(-1, ValidationService.required()),
        startDate: new FormControl(null, Validators.required),
        endDate: new FormControl(null, Validators.required),
        id: new FormControl(null),
        partner: new FormControl(null),
        creationMethod: new FormControl(null),
        matchType: new FormControl(-1, ValidationService.required()),
        destination: new FormControl(null),
    });

    lstSearchMethod = [
        {value: -1, label: this.translateService.instant('common.select.option.all')},
        {
            value: Constants.SEARCH_METHOD_LIKE,
            label: this.translateService.instant('partner.priceOut.searchMethod.like')
        },
        {
            value: Constants.SEARCH_METHOD_EXACTLY,
            label: this.translateService.instant('partner.priceOut.searchMethod.exactly')
        },
    ];

    constructor(public activeModal: NgbActiveModal,
                private heightService: HeightService,
                private fb: FormBuilder,
                private partnerService: PartnerService,
                private translateService: TranslateService,
                private toastService: ToastService,
                private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.onResize();
        this.getCurrentPartner();
        this.patchValueForm();
    }

    onSave() {
        this.onValidDate();
        this.formGroup.markAllAsTouched();
        if (this.formGroup.invalid) return;
        const rawValues = this.formGroup.getRawValue();
        rawValues.creationMethod = CREATION_METHOD.ENTERED;
        rawValues.partner = this.currentPartner.id;
        this.onClose.emit(rawValues);
    }

    patchValueForm() {
        if (this.isDisableStatus) {
            this.formGroup.get('status').markAsTouched();
            this.formGroup.get('status').disable();
        }
        const arrDateControl = ['startDate', 'endDate'];
        if (!this.isSaving && this.currentPriceIn) {
            console.log('this.currentPriceIn', this.currentPriceIn);
            this.formGroup.patchValue(this.currentPriceIn);
            arrDateControl.forEach(control => {
                this.formGroup.get(control).setValue(moment(this.currentPriceIn[control]).toDate());
            });
        }
        console.log('this.formGroup', this.formGroup);
    }

    onResize() {
        this.height = this.heightService.onResize();
    }

    onCancel() {
        this.activeModal.dismiss(false);
    }

    getCurrentPartner() {
        this.subscription.add(this.partnerService.currentPartner.subscribe(value => {
            if (value) {
                this.isDisableBtn = false;
                this.currentPartner = value;
            } else {
                this.isDisableBtn = true;
                this.showErrMess('partnerNotExist');
            }
        }));
    }

    onValidDate() {
        const startDateControl = this.formGroup.get('startDate');
        const endDateControl = this.formGroup.get('endDate');
        endDateControl.setErrors(null);
        startDateControl.setErrors(null);
        if (endDateControl.value && startDateControl.value && endDateControl.value < startDateControl.value) {
            endDateControl.setErrors({small: true});
        }
    }

    displayFieldHasError(field: string) {
        return {
            "has-error": this.isFieldValid(field)
        };
    }

    isFieldValid(field: string) {
        return this.formGroup.get(field).invalid && this.formGroup.get(field).touched;
    }

    showErrMess(errCode: any) {
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
