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
import {ChiTietDonXuatComponent} from "app/modules/qlkh-manager/dl-xuat-hang/xuat-hang/them-sua-xuat-hang/chi-tiet-don-xuat/chi-tiet-don-xuat.component";
import {NhapXuatApiService} from "app/core/services/QLKH-api/nhap-xuat-api.service";
import {ThongTinChungApiService} from "app/core/services/QLKH-api/thong-tin-chung-api.service";
import {CommonUtils} from "app/shared/util/common-utils.service";

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
  renderCuaHang = false;
  listKhachHang: any;
  listCuaHang: any;
  listDonXuat: any = [];
  listPP: any = [];
  renderCbxCuaHang = false;
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
    this.loadCuaHang();
    this.loadAllPP();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      maXuatHang: [null, Validators.required],
      idKhachHang: [null, Validators.required],
      ngayXuat: [null, Validators.required],
      idPhuongThuc: [null, Validators.required],
      idNhanVien: [null, Validators.required],
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData)
      this.listDonXuat = this.selectedData.xuatHangChiTietDTOList
      this.duongDan = this.selectedData.duongDan
      this.hopDongDinhKem = this.selectedData.hopDongDinhKem
      this.checkFile = true;
    }

  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
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

  openModal(type?: string, selectedData?: any, idCuaHang?: any) {
    const modalRef = this.modalService.open(ChiTietDonXuatComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.selectedData = selectedData;
    modalRef.componentInstance.idCuaHang = this.form.value.idCuaHang;
    modalRef.componentInstance.response.subscribe(value => {
      console.log('value', value)
      if (type === 'update') {
        this.listDonXuat = this.listDonXuat.filter(data => data.id !== value.id)
        this.listDonXuat.push(value)
      } else {
        this.listDonXuat.push(value)
      }
      if (this.listDonXuat.length > 0) {
        this.renderCbxCuaHang = true
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
    if (this.listDonXuat) {
      this.listDonXuat = this.listDonXuat.filter(data => data !== item)

    }
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
      maXuatHang: this.form.value.maXuatHang,
      idKhachHang: this.form.value.idKhachHang,
      ngayXuat: this.form.value.ngayXuat,
      idPhuongThuc: this.form.value.idPhuongThuc,
      idNhanVien: this.form.value.idNhanVien,
      duongDan: this.duongDan,
      hopDongDinhKem: this.hopDongDinhKem,
      xuatHangChiTietDTOList: this.listDonXuat,
    };
    if (this.type === "add") {
      this.nhapXuatApiService
          .createXuatHang(data).subscribe(
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
          .createXuatHang(data).subscribe(
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

  onChangeCuaHang(event?: any) {
    if (event.id) {
      this.renderCuaHang = true
    } else {
      this.renderCuaHang = false
    }
  }
}