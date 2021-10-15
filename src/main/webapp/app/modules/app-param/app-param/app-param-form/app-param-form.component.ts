import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppParamsService} from "app/core/services/common-api/app-params.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'jhi-app-param-form',
    templateUrl: './app-param-form.component.html',
    styleUrls: ['./app-param-form.component.scss']
})
export class AppParamFormComponent implements OnInit {
    selectedParam: any;
    createForm: FormGroup = this.fb.group({
        id: [null],
        parType: [null, [Validators.required]],
        parName: [null, [Validators.required]],
        parCode: [null, [Validators.required]],
        parStringValue: [null, [Validators.required]],
        description: [null],
        status: [null]
    });

    constructor(private fb: FormBuilder,
                private appParamService: AppParamsService,
                public activeModal: NgbActiveModal,
                private translate: TranslateService
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
            this.appParamService.update(this.selectedParam.id, data).subscribe(res => {
                this.activeModal.close(res);
            })
        } else {
            this.appParamService.save(data).subscribe(res => {
                this.activeModal.close(res);
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
