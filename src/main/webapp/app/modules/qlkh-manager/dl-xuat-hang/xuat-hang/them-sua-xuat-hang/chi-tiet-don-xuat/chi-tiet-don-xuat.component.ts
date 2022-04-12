import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {ShareDataFromProjectService} from "app/core/services/outsourcing-plan/share-data-from-project";
import {HeightService} from "app/shared/services/height.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "app/shared/services/common.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {ThongTinChungApiService} from "app/core/services/QLKH-api/thong-tin-chung-api.service";
import {ToastService} from "app/shared/services/toast.service";

@Component({
    selector: 'jhi-chi-tiet-don-xuat',
    templateUrl: './chi-tiet-don-xuat.component.html',
    styleUrls: ['./chi-tiet-don-xuat.component.scss']
})
export class ChiTietDonXuatComponent implements OnInit {

    @Input() public selectedData;
    @Input() type;
    @Input() idCuaHang;
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
    slTon: any;

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
        public thongTinApi: ThongTinChungApiService,
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
            idSanPham: [null, Validators.required],
            soLuong: [null, Validators.required],
            gia: [null, Validators.required],
            tongTien: [0],
        });
        if (this.selectedData) {
            this.form.patchValue(this.selectedData);
        }
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
        const sanPham = this.listSanPham.find((x: any) => x.id === this.form.value.idSanPham)
        const data = {
            id: null,
            tenSanPham: sanPham.tenSanPham,
            idSanPham: this.form.value.idSanPham,
            soLuong: this.form.value.soLuong,
            gia: this.form.value.gia,
            ngaySanXuat: this.form.value.ngaySanXuat,
            ngayHetHan: this.form.value.ngayHetHan,
            tongTien: this.form.value.tongTien,
        };
        if (this.type === "add") {
            if (data.soLuong > this.slTon) {
                this.toastService.openErrorToast(
                    "Nhập quá số lượng tồn"
                );
                this.spinner.hide();
                return;
            }
            this.spinner.hide();
            this.response.emit(data)
            this.onCloseModal();
        }
        if (this.type === "update") {
            if (this.selectedData !== undefined) data.id = this.selectedData.id;
            if (data.soLuong > this.slTon) {
                this.toastService.openErrorToast(
                    "Nhập quá số lượng tồn"
                );
                this.spinner.hide();
                return;
            }
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

    loadSanPham(idCuaHang?: any) {
        this.thongTinApi
            .searchTonKho({
                isTonKho: 1,
                idCuaHang: idCuaHang,
                ngayHetHan: new Date()
            })
            .subscribe(
                res => {
                    this.listSanPham = res.body
                },
                err => {
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                }
            );
    }

    checkTon(event?: any) {
        if (event.soLuongTon) {
            this.slTon = event.soLuongTon;
            console.log("tồn",this.slTon)
        }
    }
}
