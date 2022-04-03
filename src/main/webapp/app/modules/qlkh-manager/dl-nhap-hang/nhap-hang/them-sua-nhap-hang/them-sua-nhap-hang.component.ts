import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {HeightService} from "app/shared/services/height.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {JhiEventManager} from "ng-jhipster";
import {ToastService} from "app/shared/services/toast.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from "app/shared/services/common.service";
import {ShareDataFromProjectService} from "app/core/services/outsourcing-plan/share-data-from-project";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {ChiTietDonNhapComponent} from "app/modules/qlkh-manager/dl-nhap-hang/nhap-hang/them-sua-nhap-hang/chi-tiet-don-nhap/chi-tiet-don-nhap.component";
import {ThongTinChungApiService} from "app/core/services/QLKH-api/thong-tin-chung-api.service";
import {NhapXuatApiService} from "app/core/services/QLKH-api/nhap-xuat-api.service";
import {CommonUtils} from "app/shared/util/common-utils.service";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'jhi-them-sua-nhap-hang',
    templateUrl: './them-sua-nhap-hang.component.html',
    styleUrls: ['./them-sua-nhap-hang.component.scss']
})
export class ThemSuaNhapHangComponent implements OnInit {
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
    pageSize = 10;
    total: number;
    reverse: any;
    items = 12;
    listData: any;
    listNhaCungCap: any;
    listCuaHang: any;
    listDonNhap: any = [];
    listPP: any = [];
    file: any;
    validMaxSize = 5;
    errImport = false;
    successImport = false;
    successMessage;
    errMessage;
    hopDongDinhKem: any;
    duongDan: any;
    checkFile = false;

    constructor(
        private http: HttpClient,
        public translateService: TranslateService,
        private heightService: HeightService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private eventManager: JhiEventManager,
        private toastService: ToastService,
        private modalService: NgbModal,
        protected router: Router,
        protected commonService: CommonService,
        private shareDataFromProjectService: ShareDataFromProjectService,
        private thongTinChungApiService: ThongTinChungApiService,
        private nhapXuatApiService: NhapXuatApiService,
        public activeModal: NgbActiveModal,
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
        console.log('type', this.type)
        this.onResize();
        this.buidForm();
        this.loadNhaCungCap();
        this.loadAllPP();
        this.loadCuaHang()
    }

    private buidForm() {
        this.form = this.formBuilder.group({
            maNhapHang: [null, Validators.required],
            idNhaCungCap: [null, Validators.required],
            ngayNhap: [null, Validators.required],
            idPhuongThuc: [null, Validators.required],
            idNhanVien: [null, Validators.required],
        });
        if (this.selectedData) {
            this.form.patchValue(this.selectedData)
            this.listDonNhap = this.selectedData.nhapHangChiTietDTOList
            this.duongDan = this.selectedData.duongDan
            this.hopDongDinhKem = this.selectedData.hopDongDinhKem
            this.checkFile = true;
        }
    }

    onResize() {
        this.height = this.heightService.onResizeWithoutFooter();
    }

    setValueToField(item, data) {
        this.form.get(item).setValue(data);
    }

    getValueOfField(item) {
        return this.form.get(item).value;
    }

    trimSpace(element) {
        const value = this.getValueOfField(element);
        if (value) {
            this.setValueToField(element, value.trim());
        }
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.loadAll()
        }
    }

    changePageSize(size) {
        this.itemsPerPage = size;
        this.loadAll();
    }

    openModal(type?: string, selectedData?: any) {
        const modalRef = this.modalService.open(ChiTietDonNhapComponent, {
            size: "lg",
            backdrop: "static",
            keyboard: false
        });
        modalRef.componentInstance.type = type;
        modalRef.componentInstance.selectedData = selectedData;
        modalRef.componentInstance.response.subscribe(value => {
            if (type === 'update') {
                this.listDonNhap = this.listDonNhap.filter(data => data.id !== value.id)
                this.listDonNhap.push(value)
            } else {
                this.listDonNhap.push(value)
            }
        });
        modalRef.result.then(result => {
        }).catch(() => {
        });
    }

    isFieldValid(field: string) {
        return !this.form.get(field).valid && this.form.get(field).touched;
    }

    get formControl() {
        return this.form.controls;
    }

    loadAll() {
    }

    onCancel() {
        this.form.reset();
        this.activeModal.dismiss(true);
    }

    sort() {
        const result = [this.predicate + "," + (this.reverse ? "desc" : "asc")];
        if (this.predicate !== "modifiedDate") {
            result.push("modifiedDate");
        }
        return result;
    }

    formatPreShow(content: string) {
        if (content.length > 60) return content.substring(0, 60) + "...";
        else return content;
    }

    onDelete(item: any) {
        if (this.listDonNhap) {
            this.listDonNhap = this.listDonNhap.filter(data => data !== item)
        }
    }

    onError(event) {
        if (event === "") {
            this.errImport = false;
            this.successImport = true;
            this.successMessage = this.translateService.instant(
                "common.import.success.upload"
            );
        } else {
            this.errImport = true;
            this.successImport = false;
            this.errMessage = event;
        }
    }

    onChangeFile(event) {
        this.file = event;
        if (CommonUtils.tctGetFileSize(this.file) > this.validMaxSize) {
            this.errImport = true;
            this.successImport = false;
            this.errMessage = this.translateService.instant(
                "common.import.error.exceedMaxSize"
            );
            return false;
        }
        console.log(this.file)
        const formData: FormData = new FormData();
        if (this.file != null && this.file.length > 0) {
            for (let i = 0; i < this.file.length; i++) {
                formData.append("file", this.file[i], this.file[i]['name']);
            }
            this.thongTinChungApiService
                .upload(formData)
                .subscribe(
                    res => {
                        this.checkFile = false
                        this.duongDan = res.body.duongDan
                        this.hopDongDinhKem = res.body.hopDongDinhKem
                        this.spinner.hide();
                    },
                    err => {
                        this.spinner.hide();
                        this.toastService.openErrorToast(
                            this.translateService.instant("common.toastr.messages.error.load")
                        );
                    }
                );
        } else {
            this.duongDan = ''
            this.hopDongDinhKem = ''
        }
    }

    loadAllPP() {
        this.spinner.show();
        this.thongTinChungApiService
            .searchPhuongThuc({
                maPhuongThuc: this.form.value.maPhuongThuc,
                tenPhuongThuc: this.form.value.tenPhuongThuc,
            })
            .subscribe(
                res => {
                    this.spinner.hide();
                    this.listPP = res.body.content;
                },
                err => {
                    this.spinner.hide();
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                }
            );
    }


    onSubmit(typeSubmit?: any) {
        if (!this.file && this.type == 'add') {
            this.errImport = true;
            this.toastService.openErrorToast(
                "Hợp đồng đính kém không được để trống"
            );
            this.successImport = false;
            this.errMessage = this.translateService.instant(
                "common.import.error.notChooseFile"
            );
            return;
        }
        if (this.form.invalid) {
            this.commonService.validateAllFormFields(this.form);
            return;
        }
        this.spinner.show();
        const data = {
            id: null,
            maNhapHang: this.form.value.maNhapHang,
            mieuTa: this.form.value.mieuTa,
            idNhaCungCap: this.form.value.idNhaCungCap,
            ngayNhap: this.form.value.ngayNhap,
            idPhuongThuc: this.form.value.idPhuongThuc,
            duongDan: this.duongDan,
            idNhanVien: this.form.value.idNhanVien,
            hopDongDinhKem: this.hopDongDinhKem,
            nhapHangChiTietDTOList: this.listDonNhap,
        };
        if (this.type === "add") {
            console.log(data)
            this.nhapXuatApiService
                .createNhapHang(data).subscribe(
                res => {
                    this.spinner.hide();
                    this.toastService.openSuccessToast(
                        "Thêm mới thành công",
                    );
                    this.response.emit(true)
                    this.onCancel();
                },
                error => {

                    this.toastService.openErrorToast(
                        "Thêm mới thất bại"
                    );
                    this.response.emit(false)
                    this.spinner.hide();
                }
            );
        }
        if (this.type === "update") {
            if (this.selectedData !== undefined) data.id = this.selectedData.id;
            this.nhapXuatApiService
                .updateNhapHang(data).subscribe(
                res => {
                    this.spinner.hide();
                    this.toastService.openSuccessToast(
                        "Cập nhập thành công"
                    );
                    this.response.emit(true)
                    this.onCancel();
                },
                error => {
                    this.toastService.openErrorToast(
                        "Thất bại"
                    );
                    this.response.emit(false)
                    this.spinner.hide();
                }
            );
        }
    }

    loadCuaHang() {
        this.thongTinChungApiService
            .searchChiNhanh({})
            .subscribe(
                res => {
                    this.listCuaHang = res.body.content
                },
                err => {
                    this.spinner.hide();
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                }
            );
    }

    loadNhaCungCap() {
        this.thongTinChungApiService
            .searchNCC({})
            .subscribe(
                res => {
                    this.listNhaCungCap = res.body.content
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