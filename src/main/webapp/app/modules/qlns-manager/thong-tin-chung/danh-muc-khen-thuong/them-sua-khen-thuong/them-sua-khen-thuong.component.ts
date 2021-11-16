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
  selector: 'jhi-them-sua-khen-thuong',
  templateUrl: './them-sua-khen-thuong.component.html',
  styleUrls: ['./them-sua-khen-thuong.component.scss']
})
export class ThemSuaKhenThuongComponent implements OnInit {


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
  listPhongBan:any;
  listChucVu:any;

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
      }else {
        this.page = 1;
      }
    });
  }


  ngOnInit(): void {
    this.buildForm()
  }


  buildForm() {
    this.form = this.formBuilder.group({
      maKhenThuong: [null, Validators.required],
      ten: [null, Validators.required],
      mucThuong: [null],
      mieuTa: [null],
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
      maKhenThuong: this.form.value.maKhenThuong,
      ten: this.form.value.ten,
      mucThuong: this.form.value.mucThuong,
      mieuTa: this.form.value.mieuTa,
    };
    if (this.type === "add") {
      this.thongTinNhanSuApiService
          .createDMKhenThuong(data).subscribe(
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
          .updateDMKhenThuong(data).subscribe(
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
}
