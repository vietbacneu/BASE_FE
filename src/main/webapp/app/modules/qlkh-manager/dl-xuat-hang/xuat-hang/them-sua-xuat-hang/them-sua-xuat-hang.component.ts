import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
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
import {ChiTietDonXuatComponent} from "app/modules/qlkh-manager/dl-xuat-hang/xuat-hang/them-sua-xuat-hang/chi-tiet-don-xuat/chi-tiet-don-xuat.component";

@Component({
  selector: 'jhi-them-sua-xuat-hang',
  templateUrl: './them-sua-xuat-hang.component.html',
  styleUrls: ['./them-sua-xuat-hang.component.scss']
})
export class ThemSuaXuatHangComponent implements OnInit {

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
      }else {
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
      ma_don_hang: [null],
      mieu_ta: [null],
      chi_tiet_don_nhap: [null]
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
    const modalRef = this.modalService.open(ChiTietDonXuatComponent, {
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

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  get formControl() {
    return this.form.controls;
  }

  loadAll() {
    // this.spinner.show();
    // this.departmentManagementService
    //     .search({
    //       isCount:  1,
    //       ten_loai_hang: this.form.value.ten_loai_hang,
    //       nha_cung_cap: this.form.value.nha_cung_cap ,
    //       page: this.page - 1,
    //       size: this.itemsPerPage,
    //     })
    //     .subscribe(
    //         res => {
    //           this.spinner.hide();
    //           this.paginateListData(res.body);
    //         },
    //         err => {
    //           this.spinner.hide();
    //           this.userList = []
    //           this.toastService.openErrorToast(
    //               this.translateService.instant("common.toastr.messages.error.load")
    //           );
    //         }
    //     );
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

  onDelete(id: any) {
  }


}
