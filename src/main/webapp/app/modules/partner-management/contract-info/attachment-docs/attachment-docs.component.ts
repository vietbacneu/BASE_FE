import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {HeightService} from "app/shared/services/height.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {UploadFileComponent} from "app/shared/components/upload-file/upload-file.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {ValidationService} from "app/shared/services/validation.service";
import {ToastService} from "app/shared/services/toast.service";
import * as moment from "moment";

@Component({
    selector: 'jhi-attachment-docs',
    templateUrl: './attachment-docs.component.html',
    styleUrls: ['./attachment-docs.component.scss']
})
export class AttachmentDocsComponent implements OnInit {
    @ViewChild("template", {static: true}) templateRef: TemplateRef<any>;
    @ViewChild("fileImport", {static: false}) fileImport: UploadFileComponent;
    @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
    height: number;
    file = [];
    errImport = false;
    successImport = false;
    errMessage: any;
    successMessage: any;
    docsType = [
        {value: -1, label: this.translateService.instant('common.select.option.default')},
        {value: 1, label: this.translateService.instant('partner.contract.docsType1')},
        {value: 2, label: this.translateService.instant('partner.contract.docsType2')},
        {value: 3, label: this.translateService.instant('partner.contract.docsType3')},
    ];
    formGroup: FormGroup = this.fb.group({
        docsType: new FormControl(-1, [ValidationService.required()]),
        documentCode: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
        documentName: new FormControl(null, [Validators.maxLength(200)]),
        signedDate: new FormControl(null, Validators.required),
        startDate: new FormControl(null, Validators.required),
        endDate: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.maxLength(1000)),
        lstContractDocsAttachment: new FormControl(null),
    });

    constructor(
        private heightService: HeightService,
        public activeModal: NgbActiveModal,
        public fb: FormBuilder,
        private translateService: TranslateService,
        private toastService: ToastService,
    ) {
    }

    ngOnInit(): void {
        this.onResize();
    }

    onResize() {
        this.height = this.heightService.onResize();
    }

    onCancel() {
        this.activeModal.dismiss(false);
    }

    onSave() {
        this.formGroup.markAllAsTouched();
        if (this.file.length <= 0) {
            this.errImport = true;
            this.errMessage = this.translateService.instant('validation.requiredCb', {field: this.translateService.instant('partner.contract.attachDocs')});
            return;
        }
        if (!this.validDate()) return;
        if (this.formGroup.invalid) return;
        const rawValues = this.formGroup.getRawValue();
        rawValues[`lstContractDocsAttachment`] = this.file;
        this.onClose.emit(rawValues);
    }

    validDate() {
        const signDate = this.formGroup.get('signedDate').value;
        const startDate = this.formGroup.get('startDate').value;
        const endDate = this.formGroup.get('endDate').value;
        if (signDate && startDate && endDate) {
            if (moment(signDate).isAfter(startDate) || moment(startDate).isAfter(endDate)) {
                this.toastService.openErrorToast(this.translateService.instant('partner.contract.validation.date'));
                return false;
            }
        }
        return true
    }

    onChangeFile(event) {
        this.file = event;
        console.log('this.file', this.file);
    }

    onError(event) {
        if (event === "") {
            this.errImport = false;
            this.successImport = true;
        } else {
            this.errImport = true;
            this.successImport = false;
            this.errMessage = event;
        }
    }

    deleteFileImport() {
        // this.file = [];
        this.file = this.file.slice(0, this.file.length > 0 ? this.file.length - 1 : this.file.length);
        if (this.file.length > 0) this.onChangeFile(this.file[0]);
        this.errImport = false;
        this.successImport = false;
        this.fileImport.delete();
        console.log('this.file', this.file);
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
