import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { DataCategoryModel } from "app/modules/system-categories/data-categories/models/DataCategory.model";
import { DataCategoryService } from "app/modules/system-categories/data-categories/services/data-category.service";
import { Observable } from "rxjs";
import { DataCategoryTypeModel } from "app/modules/system-categories/data-categories/models/DataCategoryType.model";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import {
  ModalDismissReasons,
  NgbActiveModal,
  NgbModal
} from "@ng-bootstrap/ng-bootstrap";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { OrganizationCategoriesModel } from "app/core/models/system-categories/organization-categories.model";
import { ActivatedRoute } from "@angular/router";
import { HeightService } from "app/shared/services/height.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { CustomValidationService } from "app/modules/system-categories/data-categories/services/custom-validation.service";
import { CommonService } from "app/shared/services/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { omit } from "lodash";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { JhiEventManager } from "ng-jhipster";
import { NgSelectComponent } from "@ng-select/ng-select";
import { REGEX_REPLACE_PATTERN } from "app/shared/constants/pattern.constants";

@Component({
  selector: "jhi-create-data-category",
  templateUrl: "./create-data-category.component.html",
  styleUrls: ["./create-data-category.component.scss"]
})
export class CreateDataCategoryComponent implements OnInit {
  @Input() public selectedData: DataCategoryModel;
  @Input() type;
  @ViewChild("ngSelect", { static: false }) ngSelect: NgSelectComponent;
  form: FormGroup;
  isCheckedAdd = false;
  height: number;
  itemsPerPage: any;
  maxSizePage: any;
  routeData: any;
  page: any;
  second: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  formValue = [];
  isModalConfirmShow = false;
  dataCategoryType: DataCategoryTypeModel[];
  dataCategory: DataCategoryModel;
  dataCategories: DataCategoryModel[];
  submitted = false;
  searchData: any;
  paramType: "DL";
  isDuplicateDataCategoryCode = false;
  // check dữ liệu đã được sử dụng hay chưa
  isDataUsed = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private dataCategoryService: DataCategoryService,
    customValidationService: CustomValidationService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private eventManager: JhiEventManager
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

  ngOnInit() {
    this.searchData = {};
    this.buidForm();
    //this.setValueOfForm();
    this.onResize();
    //this.fetchDataCategoryType();
    this.dataCategoryService.currentDataCategory.subscribe(result => {
      this.dataCategories = result;
    });
  }

  setValueOfForm() {
    this.type === "update"
      ? this.form.get("type").setValue(this.selectedData.type)
      : null;
  }

  fetchDataCategoryType() {
    this.dataCategoryService
      .fetchAllDataCategoryType("DL")
      .subscribe(result => {
        this.dataCategoryType = result;
        console.warn(2, this.dataCategoryType);
      });
  }

  checkFormValueChanges(formValue) {
    if (
      this.type === "add" &&
      formValue.name === "" &&
      formValue.code === "" &&
      formValue.description === "" &&
      formValue.note === ""
    ) {
      return false;
    }
    if (
      this.type === "update" &&
      this.selectedData.name === formValue.name &&
      this.selectedData.code === formValue.code &&
      // this.selectedData.type === formValue.type &&
      this.selectedData.description === formValue.description &&
      this.selectedData.note === formValue.note
    ) {
      return false;
    }
    return true;
  }

  onCloseAddModal() {
    // todo: CHECK NẾU NGƯỜI DÙNG KHÔNG NHẬP DỮ LIỆU KHI THÊM MỚI THÌ CLOSE POPUP
    if (this.type !== "detail" && this.checkFormValueChanges(this.form.value)) {
      this.isModalConfirmShow = true;
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: "static"
      });
      modalRef.componentInstance.type = "confirm";
      modalRef.componentInstance.onCloseModal.subscribe(value => {
        if (value === true) {
          this.activeModal.dismiss();
          this.form.reset();
        }
        this.isModalConfirmShow = false;
      });
    } else {
      this.activeModal.dismiss();
      this.form.reset();
      this.activeModal.dismiss(true);
    }
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      code: ["", [Validators.required, CustomValidationService.validMaxLength]],
      name: [
        "",
        [Validators.required, CustomValidationService.validMaxLength250]
      ],
      // type: ['', [Validators.required]],
      description: ["", CustomValidationService.validMaxLength255],
      note: ["", CustomValidationService.validMaxLength255]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      this.dataCategoryService.checkUsed(this.selectedData.id).subscribe(
        res => {
          console.warn(res);
          if (res.body.statusCode === "DATA_CATEGORY_USED") {
            this.isDataUsed = true;
          }
        },
        error => {
          this.isDataUsed = false;
        }
      );
    }
  }

  onSubmitData() {
    // TH: người dùng không sửa dữ liệu, click button ghi lại thì đóng popup
    if (this.isUpdate(this.formValue)) {
      // validate data
      if (this.form.invalid) {
        this.commonService.validateAllFormFields(this.form);
        return;
      }
      if (this.isDuplicateDataCategoryCode) {
        return;
      }
      this.commonService.trimSpaceFormValue(this.form);
      if (this.type === "update") {
        this.form.value.id = this.selectedData.id;
      }
      let data = this.form.value;
      if (this.type === "add") {
        data = omit(data, ["id"]);
      }
      this.saveData(data);
      // // open popup update confirm
      // if (this.type === 'update') {
      //   const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true, backdrop: 'static' });
      //   modalRef.componentInstance.type = 'update';
      //   modalRef.componentInstance.param = this.translateService.instant('projectManagement.popup.this-value');
      //   modalRef.componentInstance.onCloseModal.subscribe(value => {
      //     if (value === true) {
      //       this.saveData(data);
      //     }
      //   });
      // }
      // // open popup create confirm
      // if (this.type === 'add') {
      //   const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true, backdrop: 'static' });
      //   modalRef.componentInstance.type = 'create';
      //   modalRef.componentInstance.param = this.translateService.instant('projectManagement.popup.this-value');
      //   modalRef.componentInstance.onCloseModal.subscribe(value => {
      //     if (value === true) {
      //       this.saveData(data);
      //     }
      //   });
      // }
    } else {
      this.activeModal.dismiss();
      this.form.reset();
      this.activeModal.dismiss(true);
    }
  }

  saveData(data) {
    this.spinner.show();

    this.dataCategoryService.save(data).subscribe(
      res => {
        console.warn(res);
        this.spinner.hide();
        if (
          (res && res.status === STATUS_CODE.SUCCESS) ||
          res.status === STATUS_CODE.CREATED
        ) {
          console.warn("ADD RESPONSE", res);
          this.type === "add"
            ? this.toastService.openSuccessToast(
                this.translateService.instant(
                  "common.toastr.messages.success.add",
                  {
                    paramName: this.translateService.instant(
                      "dataCategories.action.add"
                    )
                  }
                )
              )
            : this.toastService.openSuccessToast(
                this.translateService.instant(
                  "common.toastr.messages.success.update",
                  {
                    paramName: this.translateService.instant(
                      "dataCategories.action.update"
                    )
                  }
                )
              );

          this.eventManager.broadcast({
            name: "dataCategoryChangeList"
          });
          this.closeAfterUpdateOrInsert();
        } else {
          this.toastService.openErrorToast(
            this.translateService.instant("common.toastr.messages.error.save")
          );
        }
      },
      error => {
        this.spinner.hide();
        error.error.data
          ? this.toastService.openErrorToast(error.error.data)
          : this.toastService.openErrorToast(
              this.translateService.instant("common.toastr.messages.error.save")
            );
      }
    );
  }

  closeAfterUpdateOrInsert() {
    this.activeModal.dismiss();
    this.form.reset();
    this.activeModal.dismiss(true);
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  submitSaveData() {
    //TODO: call back-end save data
    this.dataCategory = new DataCategoryModel();
    this.dataCategory.code = this.form.value.code;
    this.dataCategory.name = this.form.value.name;
    // this.dataCategory.type = this.form.value.type;

    this.dataCategoryService.save(this.dataCategory).subscribe(result => {
      this.dataCategoryService.fetchAll(this.searchData).subscribe(data => {
        this.dataCategories = data;
        this.dataCategoryService.changeDataCategory(this.dataCategories);
      });
    });
  }

  get buildFormControl() {
    return this.form.controls;
  }

  displayFieldHasError(field: string) {
    return {
      "has-error": this.isFieldValid(field)
    };
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  onBlurCode(fieldName) {
    this.setValueToField(fieldName, this.getValueOfField(fieldName).trim());
    if ("code" === fieldName) {
      this.setErrorField(fieldName, REGEX_REPLACE_PATTERN.DATA_CATEGORIES);
    }
    // check trung
    this.dataCategoryService
      .checkDataCategoryCodeExist(
        this.getValueOfField(fieldName),
        this.selectedData === undefined ? "" : this.selectedData.id
      )
      .subscribe(res => {
        if (res.body.statusCode === "DATA_CATEGORY_EXIST") {
          this.isDuplicateDataCategoryCode = true;
        }
        if (
          res.body.statusCode === "DATA_CATEGORY_NOT_EXIST" ||
          res.body.statusCode === "DATA_CATEGORY_EXIST_UPDATE"
        ) {
          this.isDuplicateDataCategoryCode = false;
        }
      });
  }

  setErrorField(field: string, pattern) {
    const result = this.getValueOfField(field).match(pattern);
    if (result) {
      result.forEach(it => {
        if (it !== "") {
          this.form.controls[field].setErrors({ pattern: true });
        }
      });
    }
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }

  get formControl() {
    return this.form.controls;
  }

  isUpdate(formValue) {
    if (
      this.type === "update" &&
      this.selectedData.name === formValue.name &&
      this.selectedData.code === formValue.code &&
      // this.selectedData.type === formValue.type &&
      this.selectedData.description === formValue.description &&
      this.selectedData.note === formValue.note
    ) {
      return false;
    }
    return true;
  }
}
