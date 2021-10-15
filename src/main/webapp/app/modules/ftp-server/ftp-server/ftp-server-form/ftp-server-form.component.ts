import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "app/shared/services/toast.service";
import {FtpServerService} from "app/core/services/ftp-service/ftp-server.service";

@Component({
    selector: 'jhi-ftp-server-form',
    templateUrl: './ftp-server-form.component.html',
    styleUrls: ['./ftp-server-form.component.scss']
})
export class FtpServerFormComponent implements OnInit {

    selectedRow: any;
    lstProtocol: any[] = [];
    action: any;

    createForm: FormGroup = this.fb.group({
        id: [null],
        host: [null, [Validators.required, Validators.maxLength(50)]],
        port: [null, [Validators.required, Validators.maxLength(50)]],
        protocol: [null, [Validators.required, Validators.maxLength(50)]],
        username: [null, [Validators.required, Validators.maxLength(100)]],
        password: [null, [Validators.maxLength(12)]],
        settingName: [null, [Validators.required]]
    });

    constructor(private fb: FormBuilder,
                private ftpServerService: FtpServerService,
                public activeModal: NgbActiveModal,
                private translate: TranslateService,
                private toastr: ToastService
    ) {
    }

    ngOnInit(): void {
        if (this.selectedRow) {
            delete this.selectedRow.password;
            this.createForm.patchValue(this.selectedRow);
        }
        if (this.action === "Add"){
            this.createForm.get('password').setValidators([Validators.required,Validators.minLength(6), Validators.maxLength(12)]);
            this.createForm.updateValueAndValidity();
        }else {
            this.createForm.get('password').setValidators([Validators.minLength(6), Validators.maxLength(12)]);
            this.createForm.updateValueAndValidity();
        }
    }

    save() {
        this.createForm.markAllAsTouched();
        if (this.createForm.invalid) {
            return;
        }
        console.log(this.createForm.getRawValue());
        const data = this.createForm.getRawValue();
        if (this.selectedRow) {
            this.ftpServerService.update(this.selectedRow.id, data).subscribe(res => {
                this.activeModal.close(res);
            })
        } else {
            this.ftpServerService.save(data).subscribe(res => {
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
