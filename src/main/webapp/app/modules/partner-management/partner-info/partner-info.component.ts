import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PartnerService} from "app/core/services/partner-management/partner.service";
import {forkJoin} from "rxjs";
import {ValidationService} from "app/shared/services/validation.service";
import {TranslateService} from "@ngx-translate/core";
import {AppParamsService} from "app/core/services/common-api/app-params.service";
import {APP_PARAM_TYPE} from "app/app.constants";

@Component({
    selector: 'jhi-partner-info',
    templateUrl: './partner-info.component.html',
    styleUrls: ['./partner-info.component.scss']
})
export class PartnerInfoComponent implements OnInit, OnChanges {
    @Input() isSaving: boolean;
    @Input() currentPartner: any;
    @Output() doSave: EventEmitter<any> = new EventEmitter<any>();
    isShow = true;
    countries = [];
    lstAM = [];
    lstPartnerTypes = [];

    formGroup: FormGroup = this.fb.group({
        code: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
        shortName: new FormControl(null, [Validators.maxLength(50)]),
        bccsCode: new FormControl(null, Validators.maxLength(50)),
        fullName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
        erpCode: new FormControl(null, Validators.maxLength(50)),
        status: new FormControl(null, [Validators.required]),
        bankName: new FormControl(null, Validators.maxLength(100)),
        accountHolder: new FormControl(null, Validators.maxLength(100)),
        networkName: new FormControl(null, [Validators.maxLength(50)]),
        bankAccountNum: new FormControl(null, Validators.maxLength(50)),
        countryId: new FormControl(null, [ValidationService.required()]),
        partnerType: new FormControl(null, [Validators.required]),
        delegateName: new FormControl(null, Validators.maxLength(100)),
        fullAddress: new FormControl(null, [Validators.maxLength(200)]),
        positionOfDelegate: new FormControl(null, Validators.maxLength(100)),
        telephoneNumber: new FormControl(null, [Validators.maxLength(20)]),
        amId: new FormControl(null, ValidationService.required()),
        id: new FormControl(null),
        isDelete: new FormControl(null),
    });

    constructor(private fb: FormBuilder,
                private partnerService: PartnerService,
                private translateService: TranslateService,
                private apParamService: AppParamsService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.isSaving && !changes.isSaving.currentValue) this.formGroup.disable();
        if (changes.currentPartner && changes.currentPartner.currentValue) {
            this.formGroup.patchValue(changes.currentPartner.currentValue);
            this.formGroup.get('code').disable();
        };
    }

    ngOnInit(): void {
        this.prepareData();
    }

    save() {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.invalid) return;
        console.log(this.formGroup.getRawValue());
        this.doSave.emit(this.formGroup.getRawValue());
    }

    toggle() {
        this.isShow = !this.isShow;
    }

    prepareData() {
        this.loadComboBox();
    }

    loadComboBox() {
        forkJoin([this.getAllCountries(), this.getAllAM(), this.getAllPartnerTypes()]).subscribe(value => {
            console.log(value);
            this.countries = value[0];
            this.lstAM = value[1];
            this.lstPartnerTypes = value[2].body;
            if (this.isSaving) {
                const defaultOption = {id: -1, fullName: this.translateService.instant('common.select.option.default')};
                const defaultOptionAM = {id: -1, name: this.translateService.instant('common.select.option.default')};
                const defaultOptionPartnerType = {
                    parCode: -1,
                    parName: this.translateService.instant('common.select.option.default')
                };
                this.countries.unshift(defaultOption);
                this.lstAM.unshift(defaultOptionAM);
                this.lstPartnerTypes.unshift(defaultOptionPartnerType);
                this.formGroup.get('countryId').setValue(-1);
                this.formGroup.get('amId').setValue(-1);
                this.formGroup.get('partnerType').setValue(-1);
            }
            if (this.currentPartner) {
                this.formGroup.patchValue(this.currentPartner);
                this.formGroup.get('partnerType').setValue(this.currentPartner.partnerType.toString());
            }
        });
    }

    getAllCountries() {
        return this.partnerService.getAllCountries();
    }

    getAllAM() {
        return this.partnerService.getAllAM();
    }

    getAllPartnerTypes() {
        return this.apParamService.getAllAppParamsByType(APP_PARAM_TYPE.PARTNER_TYPE);
    }

    displayFieldHasError(field: string) {
        return {
            "has-error": this.isFieldValid(field)
        };
    }

    isFieldValid(field: string) {
        return this.formGroup.get(field).invalid && this.formGroup.get(field).touched;
    }
}
