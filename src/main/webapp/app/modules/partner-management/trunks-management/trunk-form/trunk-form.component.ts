import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HeightService} from "app/shared/services/height.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {ValidationService} from "app/shared/services/validation.service";
import {AppParamsService} from "app/core/services/common-api/app-params.service";
import {APP_PARAM_TYPE} from "app/app.constants";
import {ToastService} from "app/shared/services/toast.service";

@Component({
    selector: 'jhi-trunk-form',
    templateUrl: './trunk-form.component.html',
    styleUrls: ['./trunk-form.component.scss']
})
export class TrunkFormComponent implements OnInit {
    @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
    isSaving: boolean;
    isShow = false;
    height: number;
    currentTrunk: any;
    networkElement = [];

    formGroup: FormGroup = this.fb.group({
        trunkCode: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
        trunkName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
        networkElement: new FormControl(-1, [ValidationService.required(), Validators.maxLength(100)]),
        volume: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
        status: new FormControl(-1, ValidationService.required()),
        type: new FormControl(-1, ValidationService.required()),
        id: new FormControl(null),
    });
    types = [
        {value: -1, label: this.translateService.instant('common.select.option.default')},
        {value: 'IDD', label: 'IDD'},
        {value: 'VOIP', label: 'VOIP'},
        {value: 'BOTH', label: 'BOTH'},
    ];
    trunkTypes = [
        {parCode: -1, parName: this.translateService.instant('common.select.option.default')},
    ]
    status = [
        {value: -1, label: this.translateService.instant('common.select.option.default')},
        {value: 1, label: this.translateService.instant('common.table.status.active')},
        {value: 0, label: this.translateService.instant('common.table.status.deactivate')},
    ];

    constructor(private heightService: HeightService,
                public activeModal: NgbActiveModal,
                public fb: FormBuilder,
                private translateService: TranslateService,
                private appParamsService: AppParamsService,
                private toastService: ToastService,
    ) {
    }

    ngOnInit(): void {
        this.onResize();
        this.findAllTrunkTypes();
        this.patchValueForm();
    }

    onResize() {
        this.height = this.heightService.onResize();
    }

    patchValueForm() {
        if (this.currentTrunk) this.formGroup.patchValue(this.currentTrunk);
    }

    onSave() {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.invalid) return;
        const rawValues = this.formGroup.getRawValue();
        this.onClose.emit(rawValues);
    }

    onCancel() {
        this.activeModal.dismiss(false);
    }

    dismiss() {
        this.activeModal.dismiss(false);
    }

    findAllTrunkTypes() {
        this.appParamsService.getAllAppParamsByType(APP_PARAM_TYPE.TRUNK_TYPE).subscribe((next: any) => {
            if (next && next.body.length > 0) {
                this.trunkTypes = [...this.trunkTypes, ...next.body];
            }
        }, () => this.showUnknownErr());
    }

    showUnknownErr() {
        this.toastService.openErrorToast(this.translateService.instant('common.toastr.title.error'));
    }

    displayFieldHasError(field: string) {
        return {
            "has-error": this.isFieldValid(field)
        };
    }

    isFieldValid(field: string) {
        return !this.formGroup.get(field).valid && this.formGroup.get(field).touched;
    }
}
