import {Component, OnInit} from '@angular/core';
import {HeightService} from "app/shared/services/height.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {PartnerService} from "app/core/services/partner-management/partner.service";
import {finalize} from "rxjs/operators";
import {Constants, HTTP_STATUS} from "app/app.constants";
import {TranslateService} from "@ngx-translate/core";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "app/shared/services/toast.service";
import {Router} from "@angular/router";
import {ConfirmModalComponent} from "app/shared/components/confirm-modal/confirm-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {forkJoin} from "rxjs";

@Component({
    selector: 'jhi-partner-management',
    templateUrl: './partner-management.component.html',
    styleUrls: ['./partner-management.component.scss']
})
export class PartnerManagementComponent implements OnInit {
    height: any;
    itemsPerPage: any;
    maxSizePage: any;
    page: any;
    totalItems: number = 0;
    lstPartners = [];
    lstCountry = [];
    lstAm = [];
    lstStatus = [
        {value: -1, label: this.translateService.instant('common.select.option.all')},
        {value: 1, label: this.translateService.instant('partner.status.active')},
        {value: 0, label: this.translateService.instant('partner.status.inactive')},
    ];
    formGroup: FormGroup = this.fb.group({
        code: new FormControl(null),
        shortName: new FormControl(null),
        bccsCode: new FormControl(null),
        fullName: new FormControl(null),
        erpCode: new FormControl(null),
        status: new FormControl(-1),
    });
    columns = [
        {name: 'partner.orderNo', size: 'small'},
        {name: 'partner.code', size: 'medium'},
        {name: 'partner.name', size: 'large'},
        {name: 'partner.standFor', size: 'medium'},
        {name: 'partner.country', size: 'medium'},
        {name: 'partner.address', size: 'large'},
        {name: 'partner.phone', size: 'medium'},
        {name: 'partner.daumoi', size: 'medium'},
        {name: 'partner.telecom', size: 'medium'},
        {name: 'partner.partnerType', size: 'medium'},
        {name: 'partner.accountNo', size: 'medium'},
        {name: 'partner.bank', size: 'medium'},
        {name: 'partner.owner', size: 'medium'},
        {name: 'partner.president', size: 'medium'},
        {name: 'partner.position', size: 'medium'},
        {name: 'partner.erpCode', size: 'medium'},
        {name: 'partner.bccsCode', size: 'medium'},
        {name: 'partner.status', size: 'medium'},
        {name: 'partner.action', size: 'medium'},
    ];

    constructor(
        private heightService: HeightService,
        private fb: FormBuilder,
        private partnerService: PartnerService,
        private translateService: TranslateService,
        private spinner: NgxSpinnerService,
        private toastService: ToastService,
        private router: Router,
        private modalService: NgbModal
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.maxSizePage = MAX_SIZE_PAGE;
        this.page = 0;
    }

    ngOnInit(): void {
        this.prepareData();
    }

    prepareData() {
        this.onResize();
        this.search();
        this.loadComboBox();
    }

    onResize() {
        this.height = this.heightService.onResizeWithoutFooter();
    }

    search() {
        const pageable = {};
        pageable[`page`] = this.page > 0 ? this.page - 1 : this.page;
        pageable[`size`] = this.itemsPerPage;
        pageable[`sort`] = ['code,asc'];
        this.onSearch(pageable);
    }

    onSearch(pageable: any) {
        this.showSpinner();
        const rawValues = this.formGroup.getRawValue();
        console.log('rawValues', rawValues);
        this.partnerService.search(rawValues, pageable).pipe(finalize(() => this.hideSpinner())).subscribe((next: any) => {
            console.log('next', next);
            if (HTTP_STATUS.OK === next.status) {
                console.log('page', this.page);
                this.lstPartners = next.body.content;
                this.totalItems = next.body.totalElements;
            } else this.showUnknownErr();
        }, () => this.showUnknownErr());
    }

    openModal(selectedData?: any) {
        this.partnerService.setCurrentPartnerContact(null);
        this.partnerService.setCurrentContract(null);
        this.partnerService.setCurrentPartner(selectedData);
        this.router.navigateByUrl(`/partner-management/edit`);
    }

    loadPage(page: number) {
        console.log('page', page);
        const pageable = {};
        this.page = page;
        pageable[`page`] = page - 1;
        pageable[`size`] = this.itemsPerPage;
        pageable[`sort`] = ['code,asc'];
        this.onSearch(pageable);
    }

    changePageSize(event: any) {
        if (!event) return;
        this.itemsPerPage = event;
        const pageable = {};
        pageable[`page`] = this.page - 1;
        pageable[`size`] = this.itemsPerPage;
        pageable[`sort`] = ['code,asc'];
        this.onSearch(pageable);
    }

    onDelete(item: any) {
        const modalRef = this.modalService.open(ConfirmModalComponent, {
            centered: true,
            backdrop: "static"
        });
        modalRef.componentInstance.type = "delete";
        modalRef.componentInstance.param = '';
        modalRef.componentInstance.onCloseModal.subscribe(value => {
            console.log(value);
            if (value) {
                this.partnerService.deletePartner(item.id).subscribe(
                    () => {
                        this.onDeleteSuccess(this.translateService.instant('partner.partner'));
                        this.search();
                    },
                    (err) => {
                        console.log(err);
                        if (err && err.error.message === 'using') {
                            this.toastService.openErrorToast(this.translateService.instant('common.toastr.messages.error.partnerIsUsing', {param: item.code}));
                            return;
                        }
                        this.showUnknownErr();
                    });
            }
        });
    }

    loadComboBox() {
        forkJoin([this.getAllCountries(), this.getAllAM()]).subscribe(value => {
            this.lstCountry = value[0];
            this.lstAm = value[1];
        });
    }

    getAllCountries() {
        return this.partnerService.getAllCountries();
    }

    getAllAM() {
        return this.partnerService.getAllAM();
    }

    showUnknownErr() {
        this.toastService.openErrorToast(this.translateService.instant('common.toastr.title.error'));
    }

    showSpinner() {
        void this.spinner.show();
    }

    hideSpinner() {
        void this.spinner.hide();
    }

    viewDetail(row: any) {
        this.partnerService.setCurrentPartner(row);
        void this.router.navigateByUrl(`/partner-management/detail`);
    }

    navigateToInsert() {
        this.partnerService.resetDataBeforeInsert();
        void this.router.navigateByUrl('/partner-management/new');
    }

    onDeleteSuccess(param: any) {
        this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.delete",
            {paramName: param}));
    }

    getPartnerType(partnerType: any) {
        if (Number(Constants.PARTNER_TYPE_1) === partnerType) return this.translateService.instant('partner.partnerType.internal');
        else if (Number(Constants.PARTNER_TYPE_2) === partnerType) return this.translateService.instant('partner.partnerType.external');
        else if (Number(Constants.PARTNER_TYPE_3) === partnerType) return this.translateService.instant('partner.partnerType.other');
        else return partnerType;
    }
}