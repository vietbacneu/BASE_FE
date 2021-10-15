import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PartnerService} from "app/core/services/partner-management/partner.service";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {ConfirmModalComponent} from "app/shared/components/confirm-modal/confirm-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "app/shared/services/toast.service";
import {ValidationService} from "app/shared/services/validation.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'jhi-clue-info',
    templateUrl: './clue-info.component.html',
    styleUrls: ['./clue-info.component.scss']
})
export class ClueInfoComponent implements OnInit, OnChanges, OnDestroy {
    @Input() isSaving: boolean;
    @Input() disable = true;
    currentPartnerId: any;
    lstPartnerContact = [];
    itemsPerPage: any;
    maxSizePage: any;
    page: any;
    totalItems: number = 0;
    lstPartnerContactBackUp = [];
    inputSearch = new FormControl('');
    subscription: Subscription = new Subscription();
    position = [
        {value: -1, label: '--Chọn--'},
        {value: 'Kinh doanh', label: 'Kinh doanh'},
        {value: 'Kỹ thuật', label: 'Kỹ thuật'},
        {value: 'Tài chính', label: 'Tài chính'},
        {value: 'Gửi giá', label: 'Gửi giá'},
    ];
    isShow = false;
    formGroup: FormGroup = this.fb.group({
        fullName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
        email: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
        position: new FormControl(-1, [ValidationService.required()]),
        telephoneNumber: new FormControl(null, [Validators.maxLength(20)]),
        partnerId: new FormControl(null),
        id: new FormControl(null),
    });

    columns = [
        {name: 'partner.orderNo', size: 'small'},
        {name: 'partner.clueInfo.name', size: 'medium'},
        {name: 'partner.clueInfo.position', size: 'medium'},
        {name: 'partner.clueInfo.email', size: 'medium'},
        {name: 'partner.clueInfo.phone', size: 'medium'}
    ];

    constructor(private fb: FormBuilder,
                private partnerService: PartnerService,
                private modalService: NgbModal,
                private translateService: TranslateService,
                private toastService: ToastService) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.maxSizePage = MAX_SIZE_PAGE;
        this.page = 0;
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log(changes);
        if (changes.disable && changes.disable.currentValue && changes.isSaving && changes.isSaving.currentValue) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }
    }

    ngOnInit(): void {
        this.loadTableData();
        if (this.isSaving) this.columns.push({name: 'partner.action', size: 'medium'});
    }

    toggle() {
        this.isShow = !this.isShow;
    }

    save() {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.invalid) return;
        const rawValues = this.formGroup.getRawValue();
        console.log(rawValues);
        this.savePartnerContacts(rawValues);
    }

    savePartnerContacts(event: any) {
        event[`partnerId`] = this.currentPartnerId;
        console.log(event);
        if (!event.id) {
            this.partnerService.insertPartnerContact(event).subscribe((next: any) => {
                this.onSaveSuccess(this.translateService.instant('partner.add.partnerContact'));
                this.partnerService.setCurrentPartnerContact(next);
                this.formGroup.reset();
            }, () => this.showUnknownErr());
        } else {
            this.partnerService.updatePartnerContact(event).subscribe((next: any) => {
                this.onUpdateSuccess(this.translateService.instant('partner.add.partnerContact'));
                this.partnerService.setCurrentPartnerContact(next);
                this.formGroup.reset();
            }, () => this.showUnknownErr());
        }
    }

    update(selectedData?: any) {
        console.log('selectedData', selectedData);
        this.formGroup.patchValue(selectedData);
    }

    onSaveSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.add",
            {paramName: param}));
    }

    onUpdateSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.update",
            {paramName: param}));
    }

    onDelete(id: any) {
        const modalRef = this.modalService.open(ConfirmModalComponent, {
            centered: true,
            backdrop: "static"
        });
        modalRef.componentInstance.type = "delete";
        modalRef.componentInstance.param = this.translateService.instant('partner.add.partnerContact');
        modalRef.componentInstance.onCloseModal.subscribe(value => {
            console.log(value);
            if (value) {
                this.partnerService.deletePartnerContact(id).subscribe(
                    () => {
                        this.onDeleteSuccess(this.translateService.instant('partner.add.partnerContact'));
                        this.onSearch();
                    },
                    () => this.showUnknownErr());
            }
        });
    }

    loadPage(page: number) {
        console.log('page', page);
        this.page = page;
        this.onSearch();
    }

    changePageSize(event: any) {
        console.log('event', event);
        if (!event) return;
        this.itemsPerPage = event;
        this.onSearch();
    }

    onSearch() {
        const inputSearch = this.inputSearch.value;
        this.partnerService.searchPartnerContacts({
            partnerId: this.currentPartnerId,
            keyword: inputSearch,
            page: this.page > 0 ? this.page - 1 : this.page,
            size: this.itemsPerPage
        }).subscribe((next: any) => {
            console.log(next);
            if (next) {
                this.lstPartnerContact = next.content;
                this.totalItems = next.totalElements;
            }
        });
    }

    loadTableData() {
        this.subscription.add(this.partnerService.currentPartner.subscribe(value => {
            if (value) {
                console.log('currentPartner', value);
                this.currentPartnerId = value.id;
                this.onSearch();
            }
        }));
        this.subscription.add(this.partnerService.currentPartnerContact.subscribe(value => {
            if (value) {
                console.log('currentPartnerContact', value);
                this.currentPartnerId = value.partnerId;
                this.onSearch();
            }
        }));
    }

    onDeleteSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.delete",
            {paramName: param}));
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
        return this.formGroup.get(field).invalid && this.formGroup.get(field).touched;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
