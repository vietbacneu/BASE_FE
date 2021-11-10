import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { HeightService } from "app/shared/services/height.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OrganizationCategoriesService } from "app/core/services/system-management/organization-categories.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { ProjectManagementModel } from "app/core/models/project-management/project-management.model";
import * as moment from "moment";
import { CommonService } from "app/shared/services/common.service";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";
import { JhiEventManager } from "ng-jhipster";
import { REGEX_REPLACE_PATTERN } from "app/shared/constants/pattern.constants";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { Observable, of, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { CommonApiService } from "app/core/services/common-api/common-api.service";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import {
  BUSINESS,
  ISOUTSOURCE,
  PRO_LANGUAGE,
  PRODUCT
} from "app/shared/constants/param.constants";
import { NgxSpinnerService } from "ngx-spinner";
import { DateTimeModel } from "app/core/models/base.model";
import { DataFormatService } from "app/shared/services/data-format.service";
import { HttpResponse } from "@angular/common/http";
import { AppParamModel } from "./../../../core/models/profile-management/app-param.model";

@Component({
  selector: "jhi-view-non-function-management",
  templateUrl: "./view-non-function-management.component.html",
  styleUrls: ["./view-non-function-management.component.scss"]
})
export class ViewNonFunctionManagementComponent implements OnInit {
  @Input() public selectedData;
  @Input() type;

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
  formValue: any[];

  isError = true;

  isOutsourceList: any;
  businessUnitList: any;
  productUnitList: any;
  proLanguageList: any[];

  isPmCodeExist = false;
  defaultPmCode = "";

  keyword: string;
  data = [];
  listOutsource: any = [];
  listVersion: any[] = [];
  listStatus: any = [];
  messageDuplicate = "";
  isDuplicate = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private organizationCategoriesService: OrganizationCategoriesService,
    private commonService: CommonService,
    private versionManagementService: VersionManagementService,
    private eventManager: JhiEventManager,
    private appParamsService: AppParamsService,
    private commonApiService: CommonApiService,
    private toastService: ToastService,
    public translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private dataFormatService: DataFormatService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {

    });
  }

  ngOnInit() {
    this.buidForm();
    this.onResize();
    this.listOutsource = [
      {
        id: "Không",
        name: "Không"
      },
      {
        id: "Có",
        name: "Có"
      }
    ];
    this.listStatus = [
      {
        id: 1,
        name: "Hiệu lực"
      },
      {
        id: 0,
        name: "Không hiệu lực"
      }
    ];
    if (this.selectedData) this.defaultPmCode = this.selectedData.projectCode;
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.

    const page = 0;
    const size = 50;
  }

  transform(items: any, term: any): any {
    if (term === undefined) return items;

    return items.filter(function(Product) {
      return Product.prdName.toLowerCase().includes(term.toLowerCase());
    });
  }

  onFocused(e) {
    // do something when input is focused
  }

  onCancel() {
    if (this.type === "detail") {
      this.onCloseModal();
    } else {
      if (this.checkFormValueChanges(this.form.value)) {
        const modalRef = this.modalService.open(ConfirmModalComponent, {
          centered: true,
          backdrop: "static"
        });
        modalRef.componentInstance.type = "confirm";
        modalRef.componentInstance.onCloseModal.subscribe(value => {
          if (value === true) {
            this.onCloseModal();
          }
        });
      } else {
        this.onCloseModal();
      }
    }
  }
  checkFormValueChanges(formValue) {
    if (
      this.type === "add" &&
      formValue.workCode === "" &&
      formValue.workName === "" &&
      formValue.effort === "" &&
      formValue.versionCode === null &&
      formValue.status === 0 &&
      formValue.scopeWork === null &&
      formValue.isOutsource === "Không" &&
      formValue.note === "" &&
      formValue.example === ""
    ) {
      return false;
    }
    if (
      this.type === "update" &&
      this.selectedData.workCode === formValue.workCode &&
      this.selectedData.workName === formValue.workName &&
      this.selectedData.effort === formValue.effort &&
      this.selectedData.status === formValue.status &&
      this.selectedData.scopeWork === formValue.scopeWork &&
      this.selectedData.note === formValue.note &&
      this.selectedData.example === formValue.example &&
      this.selectedData.versionCode === formValue.versionCode
    ) {
      return false;
    }
    return true;
  }

  onCloseModal() {
    this.form.reset();
    this.activeModal.dismiss(true);
  }

  onResize() {
    this.height = this.heightService.onResize();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      workCode: ["", Validators.compose([Validators.required])],
      workName: ["", Validators.required],
      effort: ["", Validators.required],
      scopeWork: [null],
      versionCode: [null, Validators.required],
      isOutsource: "Không",
      note: [""],
      status: 0,
      example: [""]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      this.searchVersion(this.selectedData.versionCode);
    }
  }

  onBlurCheckRegex(fieldName) {
    this.setErrorField(fieldName, REGEX_REPLACE_PATTERN.DOUBLE);
  }

  setErrorField(field: string, pattern) {
    const result = String(this.getValueOfField(field)).match(pattern);
    if (result == null) {
      this.form.controls[field].setErrors({ pattern: true });
    }
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }

  get formControl() {
    return this.form.controls;
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  onSubmit() {
    // validate common
    this.isError = false;
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }

    // Chốt lại không cần confirm khi tạo mới hoặc sửa
    this.onSubmitData();
  }

  checkDouble(item: string) {
    const array = (item + "").indexOf(".");
    if (array === -1) {
      item = item + ".0";
    }
    return item;
  }

  onSubmitData() {
    this.spinner.show();
    this.isDuplicate = false;
    const data = {
      id: null,
      workCode: this.form.value.workCode,
      workName: this.form.value.workName,
      effort: this.checkDouble(this.form.value.effort),
      scopeWork: this.form.value.scopeWork,
      versionCode: this.form.value.versionCode,
      isOutsource: this.form.value.isOutsource,
      note: this.form.value.note,
      example: this.form.value.example,
      status: this.form.value.status
    };
    if (this.selectedData !== undefined) data.id = this.selectedData.id;

    this.versionManagementService.saveNonFunction(data).subscribe(
      res => {
        this.spinner.hide();
        if (res.body.statusCode === "SUCCESS") {
          this.onCloseModal();
          if (this.type === "add") {
            this.toastService.openSuccessToast(
              this.translateService.instant(
                "nonFunctionManagement.toastr.messages.success.add"
              ),
              this.translateService.instant(
                "nonFunctionManagement.toastr.messages.success.title"
              )
            );
          }
          if (this.type === "update") {
            this.toastService.openSuccessToast(
              this.translateService.instant(
                "nonFunctionManagement.toastr.messages.success.update"
              ),
              this.translateService.instant(
                "nonFunctionManagement.toastr.messages.success.title"
              )
            );
          }

          this.eventManager.broadcast({
            name: "dataPmChange"
          });
        } else {
          this.isDuplicate = true;
          this.messageDuplicate = res.body.message;
        }
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  formatPreShow(content: string) {
    if (content.length > 60) return content.substring(0, 60) + "...";
    else return content;
  }

  searchVersion(event) {
    if (event) {
      this.versionManagementService
        .getVersion(0, 50, event)
        .subscribe((res: HttpResponse<AppParamModel[]>) => {
          if (res) {
            this.listVersion = res.body["data"].map(i => {
              i.versionName = i.versionCode + " - " + i.versionName;
              return i;
            });
          } else {
            this.listVersion = [];
          }
        });
    }
  }
  onClearVersion(type) {
    if (type === 1) {
      this.listVersion = [];
    }
  }
  trimSpace(element) {
    let value = this.getValueOfField(element);
    if ("workType" === element) {
      value = value.trim();
    }
    if ("functionType" === element) {
      value = value.trim();
    }
  }
}
