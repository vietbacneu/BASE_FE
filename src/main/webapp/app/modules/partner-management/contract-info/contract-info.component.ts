import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AttachmentDocsComponent} from "app/modules/partner-management/contract-info/attachment-docs/attachment-docs.component";
import {ValidationService} from "app/shared/services/validation.service";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {PartnerService} from "app/core/services/partner-management/partner.service";
import * as moment from 'moment';
import {Subscription} from "rxjs";
import * as fileSaver from 'file-saver';
import {ToastService} from "app/shared/services/toast.service";
import {AppParamsService} from "app/core/services/common-api/app-params.service";
import {APP_PARAM_TYPE, Constants, GLOBAL_TIMEZONE} from "app/app.constants";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {Router} from "@angular/router";
import {CommonUtils} from "app/shared/util/common-utils.service";

@Component({
    selector: 'jhi-contract-info',
    templateUrl: './contract-info.component.html',
    styleUrls: ['./contract-info.component.scss']
})
export class ContractInfoComponent implements OnInit, OnChanges, OnDestroy {
    @Input() isSaving: boolean;
    @Input() disable = true;
    currentPartnerId: any;
    currentContractId: any;
    isShow = false;
    attachDocs = [];
    lstCurrency = [];
    itemsPerPage: any;
    maxSizePage: any;
    page: any;
    totalItems: number;
    disableBtn = true;
    keyword = '';
    file = [];
    errImport = false;
    successImport = false;
    errMessage: any;
    successMessage: any;
    subscription: Subscription = new Subscription();
    isEmptyFile = false;
    contractTemplateName = '';
    contractTemplateId: any;
    lstService = [
        {id: -1, serviceName: this.translateService.instant('common.select.option.default')}
    ];
    lstTimezone = [{value: '-1', label: this.translateService.instant('common.select.option.default')}];
    lstDifferenceType = [
        {value: -1, label: this.translateService.instant('common.select.option.default')},
        {value: 1, label: this.translateService.instant('partner.contract.diffType.1')},
        {value: 2, label: this.translateService.instant('partner.contract.diffType.2')}
    ];
    lstTrackingType = [
        {value: -1, label: this.translateService.instant('common.select.option.default')},
        {value: 1, label: this.translateService.instant('partner.contract.trackingType.day')},
        {value: 2, label: this.translateService.instant('partner.contract.trackingType.month')}
    ];

    lstTrackingForm = [{value: -1, label: this.translateService.instant('common.select.option.default')}]
    formGroup: FormGroup = this.fb.group({
        contractNo: [null, [Validators.required, Validators.maxLength(50)]],
        contractName: [null, [Validators.maxLength(100)]],
        roundMethod: [-1, [ValidationService.required()]],
        status: [-1, [ValidationService.required()]],
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        sendingPriceType: [null, [Validators.required]],
        currency: [-1, [ValidationService.required()]],
        id: null,
        service: [-1],
        differenceRate: [null, Validators.maxLength(2)],
        trackingType: [-1],
        outGoingTimezone: ['-1'],
        differenceMoney: [null, Validators.maxLength(10)],
        trackingFrequency: [null, Validators.maxLength(2)],
        inComingTimezone: ['-1'],
        differenceType: [-1],
        trackingCount: [null, Validators.maxLength(2)],
        sendInvoiceDay: [null, [Validators.maxLength(10), Validators.min(1), Validators.max(31)]],
        processTime: [null, Validators.maxLength(2)],
        trackingForm: [-1],
        replyInvoiceTime: [null, Validators.maxLength(2)],
    });
    columns = [
        {name: 'partner.orderNo', size: 'small'},
        {name: 'partner.contract.docType', size: 'medium'},
        {name: 'partner.contract.docCode', size: 'medium'},
        {name: 'partner.contract.docName', size: 'medium'},
        {name: 'partner.contract.dateSign', size: 'medium'},
        {name: 'partner.contract.startDate', size: 'medium'},
        {name: 'partner.contract.endDate', size: 'medium'},
        {name: 'partner.contract.note', size: 'medium'},
        {name: 'partner.contract.fileScan', size: 'large'},
    ];

    lstStatus = [
        {value: -1, label: this.translateService.instant('common.select.option.default')},
        {value: 1, label: this.translateService.instant('partner.contract.status.new')},
        {value: 2, label: this.translateService.instant('partner.contract.status.waiting')},
        {value: 3, label: this.translateService.instant('partner.contract.status.waitingAssign')},
        {value: 4, label: this.translateService.instant('partner.contract.status.testing')},
        {value: 5, label: this.translateService.instant('partner.contract.status.approved')},
    ];

    lstRoundMethod = [
        {parCode: -1, parName: this.translateService.instant('common.select.option.default')},
    ];

    constructor(private fb: FormBuilder,
                private translateService: TranslateService,
                private modalService: NgbModal,
                private partnerService: PartnerService,
                private toastService: ToastService,
                private appParamsService: AppParamsService,
                private spinner: NgxSpinnerService,
                private router: Router,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.maxSizePage = MAX_SIZE_PAGE;
        this.page = 1;
    }


    ngOnChanges(changes: SimpleChanges): void {
        if (changes.disable && changes.disable.currentValue) {
            this.formGroup.disable();
            this.disableBtn = false;
        } else {
            this.formGroup.enable();
        }
    }

    ngOnInit(): void {
        this.prepareData();
    }

    prepareData() {
        this.findAllServices();
        this.findAllCurrency();
        this.getCurrentContract();
        this.findAllRoundMethod();
        this.lstTimezone = [...this.lstTimezone, ...GLOBAL_TIMEZONE];
    }

    toggle() {
        this.isShow = !this.isShow;
    }

    addAttachmentDocs() {
        const dialogRef = this.modalService.open(AttachmentDocsComponent, {
            size: "lg",
            backdrop: "static",
            centered: true
        });
        dialogRef.componentInstance.onClose.subscribe(value => {
            if (value) {
                console.log(value);
                this.insertPartnerContractDocs(value, dialogRef);
            }
        });
    }

    save() {
        if (this.file.length <= 0 && this.disableBtn) this.isEmptyFile = true;
        this.onValidDate();
        this.formGroup.markAllAsTouched();
        if (this.formGroup.invalid || this.isEmptyFile) {
            CommonUtils.scrollIntoError('controlErr');
            return;
        }
        const rawValues = this.formGroup.getRawValue();
        this.savePartnerContract(rawValues, this.file);
    }

    savePartnerContract(event: any, file: any) {
        event[`partnerId`] = this.currentPartnerId
        console.log('contract info', event);
        this.showSpinner();
        if (!event.id) {
            this.partnerService.insertPartnerContract(event, file).pipe(finalize(() => this.hideSpinner())).subscribe((next: any) => {
                console.log('partnerContract', next);
                this.partnerService.setCurrentContract(next);
                this.onSaveSuccess(this.translateService.instant('partner.keyword.contract'));
            }, (err: any) => {
                console.log(err)
                if (err && err.error.message === 'existedContract') {
                    this.showErrMess('existedContract', event);
                    return;
                }
                this.showUnknownErr();
            });
        } else {
            this.partnerService.updatePartnerContract(event).pipe(finalize(() => this.hideSpinner())).subscribe((next: any) => {
                console.log('partnerContract', next);
                this.partnerService.setCurrentContract(next);
                this.onUpdateSuccess(this.translateService.instant('partner.keyword.contract'));
            }, (err: any) => {
                console.log(err)
                if (err && err.error.message === 'existedContract') {
                    this.showErrMess('existedContract', event);
                    return;
                }
                this.showUnknownErr();
            });
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

    loadPage(page: number) {
        console.log('page', page);
        const pageable = {};
        this.page = page;
        pageable[`page`] = page - 1;
        pageable[`size`] = this.itemsPerPage;
        this.findAllByPartnerId(this.currentPartnerId);
    }

    changePageSize(event: any) {
        if (!event) return;
        this.itemsPerPage = event;
        const pageable = {};
        pageable[`page`] = this.page - 1;
        pageable[`size`] = this.itemsPerPage;
        this.findAllByPartnerId(this.currentPartnerId);
    }

    getDocumentTypeName(type: any) {
        if (Constants.CONTRACT_TYPE_1 === type) return this.translateService.instant('partner.contract.docsType1')
        else if (Constants.CONTRACT_TYPE_2 === type) return this.translateService.instant('partner.contract.docsType2')
        else if (Constants.CONTRACT_TYPE_3 === type) return this.translateService.instant('partner.contract.docsType3')
        else if (Constants.CONTRACT_TYPE_4 === type) return this.translateService.instant('partner.contract.docsType4')
        else return type;
    }

    downloadFile(id: any, filename: any) {
        this.partnerService.downloadAttachDocs(id).subscribe(value => {
            console.log('blob', value);
            try {
                const response = JSON.parse(new TextDecoder('utf-8').decode(value));
                this.saveFile(response, filename);
            } catch {
                this.saveFile(value, filename);
            }
        })
    }

    saveFile(data: any, filename?: string, mimeType?: any) {
        const blob = new Blob([data], {type: mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        fileSaver.saveAs(blob, filename);
    }

    onValidDate() {
        const startDateControl = this.formGroup.get('startDate');
        const endDateControl = this.formGroup.get('endDate');
        // endDateControl.setErrors(null);
        // startDateControl.setErrors(null);
        if (endDateControl.value && startDateControl.value && endDateControl.value < startDateControl.value) {
            endDateControl.setErrors({small: true});
        }
    }

    findAllCurrency() {
        this.partnerService.findAllCurrency().subscribe((next: any) => {
            this.lstCurrency = next;
            const defaultValue = {id: -1, shortName: this.translateService.instant('common.select.option.default')};
            this.lstCurrency.unshift(defaultValue);
            this.formGroup.get('currency').setValue(-1);
        });
    }

    getCurrentContract() {
        this.subscription.add(this.partnerService.currentContract.subscribe(value => {
            if (value) {
                console.log('current contract', value);
                this.currentContractId = value.id;
                this.currentPartnerId = value.partnerId;
                this.findAllByPartnerId(this.currentPartnerId);
            }
        }));
        this.subscription.add(this.partnerService.currentPartner.subscribe(value => {
            if (value) {
                console.log('current partner', value);
                this.currentPartnerId = value.id;
                this.findAllByPartnerId(this.currentPartnerId);
            }
        }));
    }

    findAllByPartnerId(id: any) {
        const options = {};
        options[`partnerId`] = id;
        options[`page`] = this.page - 1;
        options[`size`] = this.itemsPerPage;
        options[`keyword`] = this.keyword;
        this.partnerService.getAllPartnerContractByPartnerId(options).subscribe((next: any) => {
            console.log('all', next);
            this.currentContractId = next.id;
            this.attachDocs = next.lstContractDocs;
            this.totalItems = next.countLstContractDocs;
            this.contractTemplateId = next.contractTemplateId;
            this.contractTemplateName = next.contractTemplateName;
            this.patchFormValue(next);
        });
    }

    patchFormValue(value: any) {
        this.formGroup.patchValue(value);
        this.formGroup.get('startDate').setValue(moment(value.startDate).toDate());
        this.formGroup.get('endDate').setValue(moment(value.endDate).toDate());
        if (this.isSaving && value && value.id) this.disableBtn = false;
    }

    insertPartnerContractDocs(partnerContractDocs: any, dialogRef: any) {
        partnerContractDocs[`contractId`] = this.currentContractId;
        this.partnerService.insertPartnerContractDocs(partnerContractDocs).subscribe((next: any) => {
            console.log(next);
            this.onSaveSuccess(this.translateService.instant('partner.contract.attachDocs').toLowerCase());
            this.findAllByPartnerId(this.currentPartnerId);
            dialogRef.componentInstance.onCancel();
        }, () => this.showUnknownErr());
    }

    findAllRoundMethod() {
        this.appParamsService.getAllAppParamsByType(APP_PARAM_TYPE.QUYTAC_LAMTRON).subscribe((next: any) => {
            console.log('round', next);
            if (next && next.body.length > 0) {
                this.lstRoundMethod = [...this.lstRoundMethod, ...next.body];
            }
        }, () => this.showUnknownErr());
    }

    onSearch() {
        this.findAllByPartnerId(this.currentPartnerId);
    }

    onChangeFile(event) {
        console.log('event', event);
        this.file = event;
        if (this.file.length <= 0) this.isEmptyFile = true;
        else this.isEmptyFile = false;
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

    showErrMess(errCode: any, value?: any) {
        let errMess = '';
        if (errCode === 'existed') {
            errMess = this.translateService.instant('partner.validation.existed', {code: value.code});
        } else if (errCode === 'existedContract') {
            errMess = this.translateService.instant('partner.validation.existed', {code: value.contractNo});
        } else if (errCode === 'partnerNotExist') {
            errMess = this.translateService.instant('partner.notExisted');
            void this.router.navigateByUrl('/partner-management');
        }
        this.toastService.openErrorToast(errMess);
    }

    findAllServices() {
        this.partnerService.findAllServices().subscribe((next: any) => {
            if (next) this.lstService = [...this.lstService, ...next];
        }, () => this.showUnknownErr());
    }

    onUpdateSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.update",
            {paramName: param}));
    }

    showSpinner() {
        void this.spinner.show();
    }

    hideSpinner() {
        void this.spinner.hide();
    }

    onSaveSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.add",
            {paramName: param}));
    }

    showUnknownErr() {
        this.toastService.openErrorToast(this.translateService.instant('common.toastr.title.error'));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
