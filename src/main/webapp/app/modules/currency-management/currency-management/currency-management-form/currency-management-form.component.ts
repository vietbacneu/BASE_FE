import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {CurrencyManagementService} from "app/core/services/currency-management/currency-management.service";
import {ToastService} from "app/shared/services/toast.service";

@Component({
    selector: 'jhi-currency-management-form',
    templateUrl: './currency-management-form.component.html',
    styleUrls: ['./currency-management-form.component.scss']
})
export class CurrencyManagementFormComponent implements OnInit {
    selectedParam: any;
    createForm: FormGroup = this.fb.group({
        id: [null],
        shortName: [null, [Validators.required,Validators.maxLength(20)]],
        fullName: [null, [Validators.required,Validators.maxLength(50)]],
        description: [null,Validators.maxLength(1000)],
        status: [null]
    });

    constructor(private fb: FormBuilder,
                private currencyManagementService: CurrencyManagementService,
                public activeModal: NgbActiveModal,
                private translate: TranslateService,
                private toastr:ToastService
    ) {
    }

    ngOnInit(): void {
        if (this.selectedParam) {
            this.createForm.patchValue(this.selectedParam);
        }
    }

    save() {
        this.createForm.markAllAsTouched();
        if (this.createForm.invalid) {
            return;
        }
        console.log(this.createForm.getRawValue());
        const data = this.createForm.getRawValue();
        if (this.selectedParam) {
            this.currencyManagementService.update(this.selectedParam.id, data).subscribe(res => {
                this.activeModal.close(res);
            })
        } else {
            this.currencyManagementService.save(data).subscribe(res => {
                this.activeModal.close(res);
            },error => {
                this.toastr.openErrorToast(error.error.message);
            })
        }
    }

    cancel() {
        this.activeModal.close();
    }

    displayFieldHasError(field: string) {
        return {
            "has-error": this.isFieldValid(field)
        };
    }

    isFieldValid(field: string) {
        return !this.createForm.get(field).valid && this.createForm.get(field).touched;
    }

}
