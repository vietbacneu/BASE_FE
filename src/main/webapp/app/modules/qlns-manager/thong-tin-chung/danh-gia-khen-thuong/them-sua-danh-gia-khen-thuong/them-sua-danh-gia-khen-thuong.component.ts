import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {ShareDataFromProjectService} from "app/core/services/outsourcing-plan/share-data-from-project";
import {HeightService} from "app/shared/services/height.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "app/shared/services/common.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ThongTinNhanSuApiService} from "app/core/services/QLNS-api/thong-tin-nhan-su-api.service";
import {ToastService} from "app/shared/services/toast.service";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";

@Component({
    selector: 'jhi-them-sua-danh-gia-khen-thuong',
    templateUrl: './them-sua-danh-gia-khen-thuong.component.html',
    styleUrls: ['./them-sua-danh-gia-khen-thuong.component.scss']
})
export class ThemSuaDanhGiaKhenThuongComponent implements OnInit {


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
    listNhanVien: any;
    listDanhGia: any;
    listType: any;

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
        private thongTinNhanSuApiService: ThongTinNhanSuApiService,
        private toastService: ToastService
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
        // this.loadDanhGia()
        this.loadNhanVien()
        this.listType = [{"name": "Khen thưởng", "value": "khenthuong"}, {"name": "Kỷ luật", "value": "kyluat"}]
    }


    buildForm() {
        this.form = this.formBuilder.group({
            idNhanVien: [null, Validators.required],
            idKhenThuong: [null, Validators.required],
            ngay: [null],
            mieuTa: [null],
            soTien: [null],
            loai: [null, Validators.required],
        });
        if (this.selectedData) {
            this.loadDanhGia({"value": this.selectedData.loai})
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

    changeT(item) {
        this.form.get("soTien").setValue(item.soTien)
    }

    onSubmit() {
        if (this.form.invalid) {
            this.commonService.validateAllFormFields(this.form);
            return;
        }
        this.spinner.show();
        const data = {
            id: null,
            idNhanVien: this.form.value.idNhanVien,
            idKhenThuong: this.form.value.idKhenThuong,
            ngay: this.form.value.ngay,
            mieuTa: this.form.value.mieuTa,
            soTien: this.form.value.soTien,
        };
        if (this.type === "add") {
            this.thongTinNhanSuApiService
                .createDGKhenThuong(data).subscribe(
                res => {
                    this.spinner.hide();
                    this.toastService.openSuccessToast(
                        "Thêm mới thành công"
                    );
                    this.response.emit(true)
                    this.onCloseModal();
                },
                error => {
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                    this.response.emit(false)
                    this.spinner.hide();
                }
            );
        }
        if (this.type === "update") {
            if (this.selectedData !== undefined) data.id = this.selectedData.id;
            this.thongTinNhanSuApiService
                .updateDGKhenThuong(data).subscribe(
                res => {
                    this.spinner.hide();
                    this.toastService.openSuccessToast(
                        "Cập nhập thành công"
                    );
                    this.response.emit(true)
                    this.onCloseModal();
                },
                error => {
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                    this.response.emit(false)
                    this.spinner.hide();
                }
            );
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

    loadNhanVien() {
        this.thongTinNhanSuApiService
            .searchNhanVien({})
            .subscribe(
                res => {
                    this.listNhanVien = res.body.content
                },
                err => {
                    this.spinner.hide();
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                }
            );
    }

    loadDanhGia(item) {
        this.form.get("idKhenThuong").setValue("")
        this.listDanhGia = []
        this.thongTinNhanSuApiService
            .searchDMKhenThuong({"loai": item.value})
            .subscribe(
                res => {
                    this.listDanhGia = res.body.content
                },
                err => {
                    this.spinner.hide();
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                }
            );
    }
}
