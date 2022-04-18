import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {TranslateService} from "@ngx-translate/core";
import {HeightService} from "app/shared/services/height.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {JhiEventManager} from "ng-jhipster";
import {ToastService} from "app/shared/services/toast.service";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from "app/shared/services/common.service";
import {ShareDataFromProjectService} from "app/core/services/outsourcing-plan/share-data-from-project";
import {ThongTinChungApiService} from "app/core/services/QLKH-api/thong-tin-chung-api.service";
import {NhapXuatApiService} from "app/core/services/QLKH-api/nhap-xuat-api.service";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {CommonUtils} from "app/shared/util/common-utils.service";
import {ChiTietCongNoComponent} from "app/modules/qlkh-manager/cong-no/chi-tiet-cong-no/chi-tiet-cong-no.component";

@Component({
    selector: 'jhi-them-sua-cong-no',
    templateUrl: './them-sua-cong-no.component.html',
    styleUrls: ['./them-sua-cong-no.component.scss']
})
export class ThemSuaCongNoComponent implements OnInit {
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
    congNoChiTietDTOS: any = [];
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
    listHopDong: any = [];
    listStatus: any;
    listType: any;

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
        this.loadCuaHang();
        this.listStatus = [{"value": "chuathanhtoan", "name": "Chưa thanh toán"}, {
            "value": "dathanhtoan",
            "name": "Đã thanh toán"
        }]
        this.listType = [{"value": "nhaphang", "name": "Nhập hàng"}, {"value": "xuathang", "name": "Xuất hàng"}]

    }

    private buidForm() {
        this.form = this.formBuilder.group({
            maCongNo: [null, Validators.required],
            idHopDong: [null, Validators.required],
            soTien: [null, Validators.required],
            trangThaiThanhToan: [null],
            idNhanVien: [null, Validators.required],
            loaiHopDong: [null, Validators.required],
        });
        if (this.selectedData) {
            this.loadHopDong({"value": this.selectedData.loaiHopDong})
            this.form.patchValue(this.selectedData)
            this.congNoChiTietDTOS = this.selectedData.congNoChiTietDTOS
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
        const modalRef = this.modalService.open(ChiTietCongNoComponent, {
            size: "lg",
            backdrop: "static",
            keyboard: false
        });
        modalRef.componentInstance.type = type;
        modalRef.componentInstance.selectedData = selectedData;
        modalRef.componentInstance.response.subscribe(value => {
            if (type === 'update') {
                this.congNoChiTietDTOS = this.congNoChiTietDTOS.filter(data => data.id !== value.id)
                this.congNoChiTietDTOS.push(value)
            } else {
                this.congNoChiTietDTOS.push(value)
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
        if (this.congNoChiTietDTOS) {
            this.congNoChiTietDTOS = this.congNoChiTietDTOS.filter(data => data !== item)
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
        if (this.form.invalid) {
            this.commonService.validateAllFormFields(this.form);
            return;
        }
        this.spinner.show();
        const data = {
            id: null,
            maCongNo: this.form.value.maCongNo,
            idHopDong: this.form.value.idHopDong,
            soTien: this.form.value.soTien,
            loaiHopDong: this.form.value.loaiHopDong,
            congNoChiTietDTOS: this.congNoChiTietDTOS,
            idNhanVien: this.form.value.idNhanVien,

        };
        var tmp = 0;
        data.congNoChiTietDTOS.forEach(e => {
                tmp += Number.parseInt(e.soTienThanhToan)
            }
        )
        console.log("temp", tmp)
        // if (tmp < Number.parseInt(data.soTien)) {
        //     this.toastService.openErrorToast(
        //         "Số tiền công nợ chi tiết không được nhỏ hơn số tiền trong hợp đồng"
        //     );
        //     this.spinner.hide();
        //     return;
        // }
        if (this.type === "add") {
            console.log(data)
            this.nhapXuatApiService
                .createCongNo(data).subscribe(
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
                .updateCongNo(data).subscribe(
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

    loadHopDong(item) {
        this.listHopDong = []
        this.form.get("idHopDong").setValue(null);
        if (item.value == 'nhaphang') {
            this.thongTinChungApiService
                .searchNhapHang({})
                .subscribe(
                    res => {
                        let tmp = res.body.content
                        if (tmp) {
                            tmp.forEach(e => {
                                e.maHopDong = e.maNhapHang;
                            })
                            this.listHopDong = tmp;
                            console.log("listHopDong", this.listHopDong)
                        }
                    },
                    err => {
                        this.spinner.hide();
                        this.toastService.openErrorToast(
                            this.translateService.instant("common.toastr.messages.error.load")
                        );
                    }
                );
        } else {
            this.thongTinChungApiService
                .searchXuatHang({})
                .subscribe(
                    res => {
                        let tmp = res.body.content
                        if (tmp) {
                            tmp.forEach(e => {
                                e.maHopDong = e.maXuatHang;
                            })
                            this.listHopDong = tmp;
                            console.log("listHopDong", this.listHopDong)
                        }
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

    loadSoTien(item) {
        this.form.get("soTien").setValue(item.soTien)
    }
}