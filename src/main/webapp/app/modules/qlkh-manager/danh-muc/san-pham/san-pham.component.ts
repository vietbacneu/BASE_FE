import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {HeightService} from "app/shared/services/height.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {JhiEventManager} from "ng-jhipster";
import {ToastService} from "app/shared/services/toast.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from "app/shared/services/common.service";
import {ShareDataFromProjectService} from "app/core/services/outsourcing-plan/share-data-from-project";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {ThemSuaLoaiHangComponent} from "app/modules/qlkh-manager/danh-muc/loai-hang/them-sua-loai-hang/them-sua-loai-hang.component";
import {ConfirmModalComponent} from "app/shared/components/confirm-modal/confirm-modal.component";
import {ThemSuaSanPhamComponent} from "app/modules/qlkh-manager/danh-muc/san-pham/them-sua-san-pham/them-sua-san-pham.component";
import {ThongTinChungApiService} from "app/core/services/QLKH-api/thong-tin-chung-api.service";

@Component({
    selector: 'jhi-san-pham',
    templateUrl: './san-pham.component.html',
    styleUrls: ['./san-pham.component.scss']
})
export class SanPhamComponent implements OnInit {

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
    listTypeProduct: any;
    listStatus: any;

    constructor(
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
        protected thongTinChungApiService: ThongTinChungApiService,
        private shareDataFromProjectService: ShareDataFromProjectService,
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
        this.onResize();
        this.buidForm();
    }

    private buidForm() {
        this.form = this.formBuilder.group({
            maSanPham: [null],
            tenSanPham: [null],
            idDanhMuc: [null],
            trangThai: [null],
        });
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
        const modalRef = this.modalService.open(ThemSuaSanPhamComponent, {
            size: "lg",
            backdrop: "static",
            keyboard: false
        });
        modalRef.componentInstance.type = type;
        modalRef.componentInstance.selectedData = selectedData;
        modalRef.componentInstance.response.subscribe(value => {
            if (value === true) {
                this.loadAll();
            }
        });
        modalRef.result.then(result => {
        }).catch(() => {
        });
    }

    onSearchData() {
        this.loadAll()
        // this.loadDepartment();
    }

    isFieldValid(field: string) {
        return !this.form.get(field).valid && this.form.get(field).touched;
    }

    get formControl() {
        return this.form.controls;
    }

    loadAll() {
        this.spinner.show();
        this.thongTinChungApiService
            .searchSanPham({
                isCount: 1,
                maSanPham: this.form.value.maSanPham,
                tenSanPham: this.form.value.tenSanPham,
                idDanhMuc: this.form.value.idDanhMuc,
                trangThai: this.form.value.trangThai,
                page: this.page - 1,
                size: this.itemsPerPage,
            })
            .subscribe(
                res => {
                    this.spinner.hide();
                    this.paginateListData(res.body);
                },
                err => {
                    this.spinner.hide();
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                }
            );
    }


    private paginateListData(data) {
        this.totalItems = data.totalElements;
        this.listData = data.content;
        this.maxSizePage = data.totalPages;
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

    onDelete(id: any) {
        const modalRef = this.modalService.open(ConfirmModalComponent, {
            centered: true,
            backdrop: "static"
        });
        modalRef.componentInstance.type = "deactivate";
        modalRef.componentInstance.param = this.translateService.instant(
            "managementDepartmentUser.confirmLock"
        );
        modalRef.componentInstance.onCloseModal.subscribe(value => {
            if (value === true) {
                this.onSubmitDelete(id);
            }
        });
    }

    onSubmitDelete(id: any = []) {
        this.spinner.show();
        // this.departmentManagementService.deleteUserToDepartment({id: id}).subscribe(
        //     res => {
        //       this.shareDataFromProjectService.getDataFromList(null);
        //       this.handleResponseSubmit(res);
        //       this.loadAll();
        //     },
        //     err => {
        //       this.spinner.hide()
        //       if (err.status == STATUS_CODE.BAD_REQUEST) {
        //         this.toastService.openErrorToast(
        //             err.error,
        //         );
        //       } else {
        //         this.toastService.openErrorToast(
        //             this.translateService.instant("common.toastr.messages.error.load")
        //         );
        //       }
        //     }
        // );
    }

    handleResponseSubmit(res) {
        this.spinner.hide();
        if (res) {
            this.toastService.openSuccessToast(
                this.translateService.instant("managementDepartmentUser.button.lock.success")
            );
            this.eventManager.broadcast({
                name: "outSourcingChange"
            });
        } else {
            this.toastService.openErrorToast(
                this.translateService.instant("managementDepartmentUser.error.delete")
            );
        }
    }


}
