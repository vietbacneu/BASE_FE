import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {ShareDataFromProjectService} from "app/core/services/outsourcing-plan/share-data-from-project";
import {HeightService} from "app/shared/services/height.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "app/shared/services/common.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";

@Component({
  selector: 'jhi-chi-tiet-don-xuat',
  templateUrl: './chi-tiet-don-xuat.component.html',
  styleUrls: ['./chi-tiet-don-xuat.component.scss']
})
export class ChiTietDonXuatComponent implements OnInit {

  @Input() public selectedData;
  @Input() type;

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
  listSanPham:any;
  listNCC:any;

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
      } else {
        this.page = 1;
      }
    });
  }


  ngOnInit(): void {
    this.buildForm()
  }


  buildForm() {
    this.form = this.formBuilder.group({
      id_san_pham: [null, Validators.required],
      nha_cung_cap: [null, Validators.required],
      so_luong: [null, Validators.required],
      don_gia: [null, Validators.required],
      ngay_san_xuat: [''],
      ngay_het_han: [''],
      tong_tien: [0],
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

  onSubmit(typeSubmit?: any) {
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }
    // this.spinner.show();
    // const data = {
    //   id: null,
    //   reportType: this.form.value.reportValue,
    //   objId: this.form.value.depId,
    //   userName: this.form.value.name,
    //   roleType: this.form.value.roleCode,
    // };
    // if (this.type === "add") {
    //   this.departmentManagementService
    //       .saveOrUpdate(data).subscribe(
    //       res => {
    //         this.spinner.hide();
    //         if (200 <= res.body.code && res.body.code < 300) {
    //           this.toastService.openSuccessToast(
    //               this.translateService.instant(
    //                   "serviceManagement.create.success"
    //               ),
    //               this.translateService.instant(
    //                   "functionManagement.toastr.messages.success.title"
    //               )
    //           );
    //           this.response.emit(true)
    //           if (typeSubmit && typeSubmit === 'addAndClose') {
    //             this.onCloseModal();
    //           }
    //         }
    //       },
    //       error => {
    //         if (error.status == STATUS_CODE.BAD_REQUEST) {
    //           this.toastService.openErrorToast(
    //               error.error,
    //           );
    //         } else {
    //           this.toastService.openErrorToast(
    //               this.translateService.instant("common.toastr.messages.error.load")
    //           );
    //         }
    //         this.response.emit(false)
    //         this.spinner.hide();
    //       }
    //   );
    // }
    // if (this.type === "update") {
    //   if (this.selectedData !== undefined) data.id = this.selectedData.id;
    //   this.departmentManagementService
    //       .saveOrUpdate(data).subscribe(
    //       res => {
    //         this.spinner.hide();
    //         if (200 <= res.body.code && res.body.code < 300) {
    //           this.toastService.openSuccessToast(
    //               this.translateService.instant(
    //                   "serviceManagement.update.success"
    //               ),
    //               this.translateService.instant(
    //                   "functionManagement.toastr.messages.success.title"
    //               )
    //           );
    //           this.response.emit(true)
    //           this.onCloseModal();
    //         }
    //       },
    //       error => {
    //         if (error.status == STATUS_CODE.BAD_REQUEST) {
    //           this.toastService.openErrorToast(
    //               error.error,
    //           );
    //         } else {
    //           this.toastService.openErrorToast(
    //               this.translateService.instant("common.toastr.messages.error.load")
    //           );
    //         }
    //         this.response.emit(false)
    //         this.spinner.hide();
    //       }
    //   );
    // }
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
  onChange(){
    if (!this.form.value.so_luong){
      this.setValueToField('tong_tien',  this.form.value.don_gia)
    }else if(this.form.value.so_luong && this.form.value.don_gia){
      const total = this.form.value.don_gia * this.form.value.so_luong
      this.setValueToField('tong_tien',  total)
    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
  }
}
