import {Component, OnInit} from '@angular/core';
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HeightService} from "app/shared/services/height.service";
import {PartnerService} from "app/core/services/partner-management/partner.service";
import {TranslateService} from "@ngx-translate/core";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "app/shared/services/toast.service";
import {Router} from "@angular/router";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'jhi-price-commitment-search',
    templateUrl: './price-commitment-search.component.html',
    styleUrls: ['./price-commitment-search.component.scss']
})
export class PriceCommitmentSearchComponent implements OnInit {
    height: any;
    itemsPerPage: any;
    maxSizePage: any;
    page: any;
    totalItems: number = 0;
    formGroup: FormGroup = this.fb.group({
        cmtCode: [null],
        cmtName: [null],
        status: [-1],
        calculationMethod: [-1],
        fromDate: [null],
        toDate: [null],
    });
    columns = [
        {name: 'partner.orderNo', size: 'small'},
        {name: 'partner.commitment.code', size: 'medium'},
        {name: 'partner.commitment.name', size: 'medium'},
        {name: 'partner.commitment.type', size: 'medium'},
        {name: 'partner.priceOut.block', size: 'medium'},
        {name: 'partner.status', size: 'medium'},
        {name: 'partner.priceOut.fromDate', size: 'medium'},
        {name: 'partner.priceOut.toDate', size: 'medium'},
        {name: 'partner.commitment.adjourn', size: 'medium'},
        {name: 'partner.contract.note', size: 'large'},
        {name: 'partner.commitment.content', size: 'large'},
        {name: 'partner.priceOut.modifiedDate', size: 'medium'},
        {name: 'partner.commitment.createUser', size: 'medium'},
        {name: 'partner.commitment.approveUser', size: 'medium'},
        {name: 'partner.action', size: 'medium'},
    ];
    lstPriceCommitment=[];

    lstMethod = [
        {value: -1, label: this.translateService.instant('common.select.option.default')},
        {value: 1, label: this.translateService.instant('partner.commitment.method.1')},
        {value: 2, label: this.translateService.instant('partner.commitment.method.2')},
        {value: 3, label: this.translateService.instant('partner.commitment.method.3')},
        {value: 4, label: this.translateService.instant('partner.commitment.method.4')},
    ];
    lstStatus = [
        {value: -1, label: this.translateService.instant('common.select.option.default')},
        {value: 1, label: this.translateService.instant('partner.commitment.status.1')},
        {value: 2, label: this.translateService.instant('partner.commitment.status.2')},
        {value: 3, label: this.translateService.instant('partner.commitment.status.3')},
        {value: 4, label: this.translateService.instant('partner.commitment.status.4')},
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
    }

    onSearch() {

    }

    onResize() {
        this.height = this.heightService.onResizeWithoutFooter();
    }

    displayFieldHasError(field: string) {
        return {
            "has-error": this.isFieldValid(field)
        };
    }

    isFieldValid(field: string) {
        return this.formGroup.get(field).invalid && this.formGroup.get(field).touched;
    }

    showUnknownErr() {
        this.toastService.openErrorToast(this.translateService.instant('common.toastr.title.error'));
    }

    onValidDate() {
        const startDateControl = this.formGroup.get('startDate');
        const endDateControl = this.formGroup.get('endDate');
        endDateControl.setErrors(null);
        startDateControl.setErrors(null);
        if (endDateControl.value && startDateControl.value && endDateControl.value < startDateControl.value) {
            endDateControl.setErrors({small: true});
        }
    }

    loadPage(page: number) {
        console.log('page', page);
        const pageable = {};
        this.page = page;
        pageable[`page`] = page - 1;
        pageable[`size`] = this.itemsPerPage;
        pageable[`sort`] = ['modified_date,desc'];
    }

    changePageSize(event: any) {
        if (!event) return;
        this.itemsPerPage = event;
        const pageable = {};
        pageable[`page`] = this.page - 1;
        pageable[`size`] = this.itemsPerPage;
        pageable[`sort`] = ['modified_date,desc'];
    }
}
