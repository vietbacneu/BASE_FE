import { Component, OnInit } from '@angular/core';
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
import {ThongTinChungApiService} from "app/core/services/QLKH-api/thong-tin-chung-api.service";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {ThemSuaLoaiHangComponent} from "app/modules/qlkh-manager/danh-muc/loai-hang/them-sua-loai-hang/them-sua-loai-hang.component";
import {ConfirmModalComponent} from "app/shared/components/confirm-modal/confirm-modal.component";
import {SERVER_API} from "app/shared/constants/api-resource.constants";

@Component({
  selector: 'jhi-bc-san-pham-danh-thu',
  templateUrl: './bc-san-pham-danh-thu.component.html',
  styleUrls: ['./bc-san-pham-danh-thu.component.scss']
})

export class BcSanPhamDanhThuComponent implements OnInit {


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
      private shareDataFromProjectService: ShareDataFromProjectService,
      private ThongTinApi: ThongTinChungApiService,
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      if (data && data.pagingParams) {
        this.page = data.pagingParams.page;
        this.previousPage = data.pagingParams.page;
        this.reverse = data.pagingParams.ascending;
        this.predicate = data.pagingParams.predicate;
      }
    });
  }

  ngOnInit(): void {
    this.onResize();
    this.buidForm();
    this.loadAllCuaHang();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      maCongNo: [null],
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
    const modalRef = this.modalService.open(ThemSuaLoaiHangComponent, {
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

  loadAllCuaHang() {
    this.ThongTinApi
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


  onSearchData() {
    this.loadAll()
    // this.loadDepartment();
  }

  onExport() {
    this.spinner.show();
    this.ThongTinApi
        .searchCongNoPhaiTra({
          maCongNo: this.form.value.maCongNo,
          loaiHopDong: "xuathang"
        })
        .subscribe(
            res => {
              this.spinner.hide();
              // window.open(res.body.path, '_blank').focus();
              window.open(SERVER_API + "/api" + "/sanPhams/download/?path=" + res.body.path);
            },
            err => {
              this.spinner.hide();
              this.toastService.openErrorToast(
                  this.translateService.instant("common.toastr.messages.error.load")
              );
            }
        );
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  get formControl() {
    return this.form.controls;
  }

  loadAll() {
    this.spinner.show();
    this.ThongTinApi
        .exportCongNo({
          maCongNo: this.form.value.maCongNo,
          loaiHopDong: "xuathang"
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
    this.listData = data;
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
    modalRef.componentInstance.type = "delete";
    modalRef.componentInstance.param = "bản ghi";
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
          "Xóa thành công"
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
