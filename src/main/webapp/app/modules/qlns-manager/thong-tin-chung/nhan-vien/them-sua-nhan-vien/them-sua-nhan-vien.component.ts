import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {ShareDataFromProjectService} from "app/core/services/outsourcing-plan/share-data-from-project";
import {HeightService} from "app/shared/services/height.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "app/shared/services/common.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastService} from "app/shared/services/toast.service";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {ThongTinNhanSuApiService} from "app/core/services/QLNS-api/thong-tin-nhan-su-api.service";

@Component({
    selector: 'jhi-them-sua-nhan-vien',
    templateUrl: './them-sua-nhan-vien.component.html',
    styleUrls: ['./them-sua-nhan-vien.component.scss']
})
export class ThemSuaNhanVienComponent implements OnInit {


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
    listPhongBan: any;
    listChucVu: any;
    listGT: any;

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
        this.buildForm();
        this.loadChucVu();
        this.loadPhongBan();
        this.loadGT();
    }


    buildForm() {
        this.form = this.formBuilder.group({
            ho: [null, Validators.required],
            ten: [null, Validators.required],
            email: [null, Validators.email],
            chucVuId: [null, Validators.required],
            phongBanId: [null, Validators.required],
            sdt: [null],
            gioiTinh: [null],
            ngaySinh: [null],
            quocTich: [null],
            trinhDo: [null],
            diaChi: [null],
            ngayBatDau: [null],
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

    onSubmit() {
        if (this.form.invalid) {
            this.commonService.validateAllFormFields(this.form);
            return;
        }
        this.spinner.show();
        const data = {
            id: null,
            ho: this.form.value.ho,
            ten: this.form.value.ten,
            email: this.form.value.email,
            chucVuId: this.form.value.chucVuId,
            phongBanId: this.form.value.phongBanId,
            trinhDo: this.form.value.trinhDo,
            diaChi: this.form.value.diaChi,
            ngayBatdau: this.form.value.ngayBatdau,
            gioiTinh: this.form.value.gioiTinh,
            ngaySinh: this.form.value.ngaySinh,
            quocTich: this.form.value.quocTich,
        };
        if (this.type === "add") {
            this.thongTinNhanSuApiService
                .createNhanVien(data).subscribe(
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
                .updateNhanVien(data).subscribe(
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

    loadChucVu() {
        this.thongTinNhanSuApiService
            .searchChucVu({})
            .subscribe(
                res => {
                    this.listChucVu = res.body.content
                },
                err => {
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                }
            );
    }
    loadPhongBan() {
        this.thongTinNhanSuApiService
            .searchPhongBan({})
            .subscribe(
                res => {
                    this.listPhongBan = res.body.content
                },
                err => {
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                }
            );
    }
    loadGT(){
        this.listGT = [
            {
                id: "Nam",
                ten: "Nam"
            },
            {
                id: "Nữ",
                ten: "Nữ"
            }
        ];
    }
}
