import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {ShareDataFromProjectService} from "app/core/services/outsourcing-plan/share-data-from-project";
import {HeightService} from "app/shared/services/height.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "app/shared/services/common.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ThongTinChungApiService} from "app/core/services/QLKH-api/thong-tin-chung-api.service";
import {ToastService} from "app/shared/services/toast.service";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";

@Component({
    selector: 'jhi-chi-tiet-ban-hang',
    templateUrl: './chi-tiet-ban-hang.component.html',
    styleUrls: ['./chi-tiet-ban-hang.component.scss']
})
export class ChiTietBanHangComponent implements OnInit {


    @Input() public selectedData;
    @Input() type;
    @Output() response = new EventEmitter<any>();

    form: FormGroup;
    height: number;
    itemsPerPage: any;
    maxSizePage: any;
    routeData: any;
    page: number;
    totalItems: any;
    previousPage: any;
    predicate: any;
    formValue;
    reverse: any;
    listSanPham: any;
    listNCC: any;
    listDonNhap: any;

    constructor(
        public translateService: TranslateService,
        private shareDataFromProjectService: ShareDataFromProjectService,
        private heightService: HeightService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        protected router: Router,
        protected commonService: CommonService,
        public activeModal: NgbActiveModal,
        public thongTinChungApiService: ThongTinChungApiService,
        public toastService: ToastService,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.maxSizePage = MAX_SIZE_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            if (data && data.pagingParams) {
                this.page = data.pagingParams.page;
                this.previousPage = data.pagingParams.page;
                this.reverse = data.pagingParams.ascending;
                this.predicate = data.pagingParams.predicate;
            } else {
                this.page = 1;
            }
        });
    }


    ngOnInit(): void {
        this.buildForm()
        this.loadSanPham()
    }


    buildForm() {
        this.form = this.formBuilder.group({
            idThucDon: [null, Validators.required],
            soLuong: [null, Validators.required],
            gia: [null, Validators.required],
            tongTien: [0],
        });
        if (this.selectedData) {
            this.form.patchValue(this.selectedData);
        }
    }

    changeThucDon(item) {
        this.form.get("gia").setValue(item.gia);
    }

    changePageSize(size) {
        this.itemsPerPage = size;
    }

    trimSpace(element) {
        const value = this.getValueOfField(element);
        if (value) {
            this.setValueToField(element, value.trim());
        }
    }

    getValueOfField(item) {
        return this.form.get(item).value;
    }

    setValueToField(item, data) {
        this.form.get(item).setValue(data);
    }

    onCancel() {
        this.form.reset();
        this.activeModal.dismiss(true);
    }

    sort() {
        const result = [this.predicate + "," + (this.reverse ? "asc" : "desc")];
        if (this.predicate !== "sysUserId") {
            result.push("sysUserId");
        }
        return result;
    }

    onSubmit(typeSubmit?: any) {
        if (this.form.invalid) {
            this.commonService.validateAllFormFields(this.form);
            return;
        }
        this.spinner.show();
        const sanPham = this.listSanPham.find((x: any) => x.id === this.form.value.idThucDon)
        const data = {
            id: null,
            tenThucDon: sanPham.tenThucDon,
            idThucDon: this.form.value.idThucDon,
            soLuong: this.form.value.soLuong,
            gia: this.form.value.gia,
            tongTien: this.form.value.tongTien,
        };
        if (this.type === "add") {
            this.spinner.hide();
            this.response.emit(data)
            this.onCloseModal();
        }
        if (this.type === "update") {
            if (this.selectedData !== undefined) data.id = this.selectedData.id;
            this.spinner.hide();
            this.response.emit(data)
            this.onCloseModal();
        }
    }

    onCloseModal() {
        this.form.reset();
        this.activeModal.dismiss(true);
    }

    onResize() {
        this.height = this.heightService.onResizeWithoutFooter();
    }

    formatPreShow(content: string) {
        if (content.length > 60) return content.substring(0, 60) + "...";
        else return content;
    }

    isFieldValid(field: string) {
        return !this.form.get(field).valid && this.form.get(field).touched;
    }

    get formControl() {
        return this.form.controls;
    }

    onChange() {
        if (!this.form.value.soLuong) {
            this.setValueToField('tongTien', this.form.value.gia)
        } else if (this.form.value.soLuong && this.form.value.gia) {
            const total = this.form.value.gia * this.form.value.soLuong
            this.setValueToField('tongTien', total)
        }
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
    }

    loadSanPham() {
        this.thongTinChungApiService
            .searchChiNhanh({})
            .subscribe(
                res => {
                    this.listSanPham = res.body.content
                },
                err => {
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                }
            );
    }
}
