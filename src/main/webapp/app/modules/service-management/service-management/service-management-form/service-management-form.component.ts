import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "app/shared/services/toast.service";
import {ServiceManagementService} from "app/core/services/service-management/service-management.service";

@Component({
    selector: 'jhi-service-management-form',
    templateUrl: './service-management-form.component.html',
    styleUrls: ['./service-management-form.component.scss']
})
export class ServiceManagementFormComponent implements OnInit {
    selectedParam: any;
    createForm: FormGroup = this.fb.group({
        id: [null],
        serviceCode: [null, [Validators.required]],
        serviceName: [null, [Validators.required]],
        serviceStatus: [null],
        status: [null],
        note: [null]
    });

    constructor(private fb: FormBuilder,
                private serviceManagementService: ServiceManagementService,
                public activeModal: NgbActiveModal,
                private translate: TranslateService,
                private toastr: ToastService
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
            this.serviceManagementService.update(this.selectedParam.id, data).subscribe(res => {
                this.activeModal.close(res);
            })
        } else {
            this.serviceManagementService.save(data).subscribe(res => {
                this.activeModal.close(res);
            }, error => {
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
