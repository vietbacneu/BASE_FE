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
import {NhapXuatApiService} from "app/core/services/QLKH-api/nhap-xuat-api.service";
import {ThongTinChungApiService} from "app/core/services/QLKH-api/thong-tin-chung-api.service";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";

@Component({
  selector: 'jhi-in-ban-hang',
  templateUrl: './in-ban-hang.component.html',
  styleUrls: ['./in-ban-hang.component.scss']
})
export class InBanHangComponent implements OnInit {

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
  renderCuaHang = false;
  listKhachHang: any;
  listCuaHang: any;
  listDonNhap: any = [];
  renderCbxCuaHang = false;
  sum = 0;

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
      public nhapXuatApiService: NhapXuatApiService,
      public thongTinChungApiService: ThongTinChungApiService,
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
    this.loadKhachHang();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      maNhapHang: [null,],
      idCuaHang: [null,],
      idNhaCungCap: [null,],
      ngayNhap: [null,],
    });
    if (this.selectedData) {
      console.log(this.selectedData)
      this.form.patchValue(this.selectedData)
      this.listDonNhap = this.selectedData.banHangChiTietDTOS
      this.listDonNhap.forEach(e => {
        console.log(e.tongTien)
        this.sum = this.sum + Number.parseInt(e.tongTien)
      })
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

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  get formControl() {
    return this.form.controls;
  }

  loadAll() {

  }

  onCancel(print?: any) {
    if (print === 'onPrint') {
      location.reload()
    }
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

  onSubmit(cmpName?: any, reloadPage?: any) {
    // let printContents = document.getElementById(cmpName).innerHTML;
    // let originalContents = document.body.innerHTML;
    // document.body.innerHTML = printContents;

    window.print();
    // document.body.innerHTML = originalContents;
    // setTimeout(() => {
    //     document.body.innerHTML = ""
    //     // document.body.innerHTML = document.getElementById(reloadPage).innerHTML
    //     // this.onCancel('onPrint');
    // }, 10)
    // document.body.innerHTML = originalContents;
  }

  loadCuaHang() {
    this.thongTinChungApiService
        .searchChiNhanh({})
        .subscribe(
            res => {
              this.listCuaHang = res.body.content
            },
            err => {
              this.toastService.openErrorToast(
                  this.translateService.instant("common.toastr.messages.error.load")
              );
            }
        );
  }

  loadKhachHang() {
    this.thongTinChungApiService
        .searchKhachHang({})
        .subscribe(
            res => {
              this.listKhachHang = res.body.content
            },
            err => {
              this.toastService.openErrorToast(
                  this.translateService.instant("common.toastr.messages.error.load")
              );
            }
        );
  }

}
