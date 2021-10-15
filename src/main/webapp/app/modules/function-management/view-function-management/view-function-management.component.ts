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
import { numberFormat } from "highcharts";

@Component({
  selector: "jhi-view-project-management",
  templateUrl: "./view-function-management.component.html",
  styleUrls: ["./view-function-management.component.scss"]
})
export class ViewFunctionManagementComponent implements OnInit {
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
  messageDuplicate = "";
  isDuplicate = false;

  keyword: string;
  data = [];
  listStatus: any = [];
  listWorkType: any = [];
  listVersion: any[] = [];

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
      if (data && data.pagingParams) {
        this.page = data.pagingParams.page;
        this.previousPage = data.pagingParams.page;
        this.reverse = data.pagingParams.ascending;
        this.predicate = data.pagingParams.predicate;
      }
    });
  }

  ngOnInit() {
    this.buidForm();
    this.listWorkType = [
      {
        id: "Giải pháp",
        name: "Giải pháp"
      },
      {
        id: "Phát triển",
        name: "Phát triển"
      },
      {
        id: "Kiểm thử",
        name: "Kiểm thử"
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
  }

  selectEvent(item) {
    // do something with selected item
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

  // convert Organization name -> code
  convertOrgCombo(name, orgList) {
    for (let i = 0; i < orgList.length; i++) {
      if (orgList[i].name === name) {
        return orgList[i].id;
      }
    }
    return;
  }

  // convert param name -> code
  convertParam(name, isUserList) {
    for (let i = 0; i < isUserList.length; i++) {
      if (isUserList[i].paramName === name) {
        return isUserList[i].id;
      }
    }
    return null;
  }

  onCancel() {
    if (this.type != "detail" && this.checkFormValueChanges(this.form.value)) {
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

  checkFormValueChanges(formValue) {
    if (
      this.type === "add" &&
      formValue.functionType === "" &&
      formValue.workType === "" &&
      formValue.effort === "" &&
      formValue.versionCode === "" &&
      formValue.status === 0
    ) {
      return false;
    }
    if (
      this.type === "update" &&
      this.selectedData.functionType === formValue.functionType &&
      this.selectedData.workType === formValue.workType &&
      this.selectedData.effort === formValue.effort &&
      this.selectedData.status === formValue.status &&
      this.selectedData.versionCode === formValue.versionCode
    ) {
      return false;
    }
    return true;
  }

  onCloseModal() {
    this.activeModal.dismiss();
    this.form.reset();
    this.activeModal.dismiss(true);
  }

  onResize() {
    this.height = this.heightService.onResize();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      functionType: ["", [Validators.required]],
      workType: ["", Validators.required],
      effort: ["", Validators.required],
      versionCode: ["", Validators.required],
      status: [0]
    });
    if (this.selectedData) {
      this.searchVersion(this.selectedData.versionCode);
      if (
        this.selectedData.workType === "Giải pháp" ||
        this.selectedData.workType === "giải pháp"
      ) {
        this.selectedData.workType = "Giải pháp";
      }
      if (
        this.selectedData.workType === "Phát triển" ||
        this.selectedData.workType === "phát triển"
      ) {
        this.selectedData.workType = "Phát triển";
      }
      if (
        this.selectedData.workType === "Kiểm thử" ||
        this.selectedData.workType === "kiểm thử"
      ) {
        this.selectedData.workType = "Kiểm thử";
      }
      this.form.patchValue(this.selectedData);
    }
  }

  onBlurCheckRegex(fieldName) {
    this.setErrorField(fieldName, REGEX_REPLACE_PATTERN.DOUBLE);
  }

  onBlurCheckExist(fieldName) {
    if (this.defaultPmCode === this.getValueOfField(fieldName))
      this.isPmCodeExist = false;
    // check trung
    else {
      // this.versionManagementService.checkpmCodeExist(this.getValueOfField(fieldName)).subscribe(res => {
      //   if (res.body.statusCode === 'SUCCESS') {
      //     this.isPmCodeExist = false;
      //   }
      //   if (res.body.statusCode === 'ELEMENT_USED') {
      //     this.isPmCodeExist = true;
      //   }
      // });
    }
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

  checkDouble(item: string) {
    const array = (item + "").indexOf(".");
    if (array === -1) {
      item = item + ".0";
    }
    return item;
  }

  onSubmit() {
    this.isDuplicate = false;
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      console.log(this.form);
      console.log(this.form.value.versionCode);
      return;
    }
    this.spinner.show();
    const data = {
      id: null,
      functionType: this.form.value.functionType,
      workType: this.form.value.workType,
      effort: this.checkDouble(this.form.value.effort),
      versionCode: this.form.value.versionCode,
      status: this.form.value.status
    };
    if (this.selectedData !== undefined) data.id = this.selectedData.id;

    this.versionManagementService.saveFunction(data).subscribe(
      res => {
        this.spinner.hide();

        if (res.body.statusCode === "SUCCESS") {
          if (this.type === "add") {
            this.toastService.openSuccessToast(
              this.translateService.instant(
                "functionManagement.toastr.messages.success.add"
              ),
              this.translateService.instant(
                "functionManagement.toastr.messages.success.title"
              )
            );
          }
          if (this.type === "update") {
            this.toastService.openSuccessToast(
              this.translateService.instant(
                "functionManagement.toastr.messages.success.update"
              ),
              this.translateService.instant(
                "functionManagement.toastr.messages.success.title"
              )
            );
          }

          this.eventManager.broadcast({
            name: "dataPmChange"
          });
          this.onCloseModal();
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

  paramList() {
    const page = 0;
    const size = 50;

    // get is outsource list
    this.appParamsService.getParamByCode(ISOUTSOURCE).subscribe(res => {
      this.isOutsourceList = res.body;
      if (this.type === "update" && this.selectedData.isOutsource != null) {
        const isOutsourceCode = this.convertParam(
          this.selectedData.isOutsource,
          this.isOutsourceList
        );
        this.form.get("isOutsource").setValue(isOutsourceCode);
      }
    });

    // get business unit list
    const bodyBusiness = {
      page: 0,
      size: 500,
      groupCode: BUSINESS
    };

    this.organizationCategoriesService.search(bodyBusiness).subscribe(res => {
      this.businessUnitList = res.data;
      if (this.type === "update" && this.selectedData.businessOrg != null) {
        const businessCode = this.convertOrgCombo(
          this.selectedData.businessOrg,
          this.businessUnitList
        );
        this.form.get("businessOrg").setValue(businessCode);
      }
    });

    // get product unit list
    const bodyProduct = {
      page: 0,
      size: 500,
      groupCode: PRODUCT
    };

    this.organizationCategoriesService.search(bodyProduct).subscribe(res => {
      this.productUnitList = res.data;
      if (this.type === "update" && this.selectedData.productionOrg != null) {
        const productCode = this.convertOrgCombo(
          this.selectedData.productionOrg,
          this.productUnitList
        );
        this.form.get("productionOrg").setValue(productCode);
      }
    });

    // get program language list
    // this.appParamsService.getParamByCode(PRO_LANGUAGE).subscribe(res => {
    //   this.proLanguageList = res.body;
    //   if (this.type === 'update' && this.selectedData.programmingLanguage != null) {
    //     const proLanguageCode = this.convertParam(this.selectedData.programmingLanguage, this.proLanguageList);
    //     this.form.get('programmingLanguage').setValue(proLanguageCode);
    //   }
    // });

    this.appParamsService
      .getParamByCode(PRO_LANGUAGE)
      .subscribe((res: HttpResponse<any[]>) => {
        if (res) {
          this.proLanguageList = res.body;
          // soft alphaB
          this.proLanguageList.sort(function(a, b) {
            let nameA: string;
            let nameB: string;
            if (a.name !== null) nameA = a.name.toUpperCase();
            if (b.name !== null) nameB = b.name.toUpperCase();
            if (nameA < nameB) return -1;
            else return 1;
            return 0;
          });
        } else {
          this.proLanguageList = [];
        }
      });
  }

  isDateErr(field: string) {
    const d1 = new Date(this.form.get("startDate").value);
    const d3 = new Date(d1.toString());
    d3.setMonth(d1.getMonth() + 6);
    if (d1.getMonth() < 6) {
      if (Number(d3.getMonth()) - Number(d1.getMonth()) > 6) {
        d3.setDate(d3.getDate() - 1);
      }
    } else {
      if (Number(d3.getMonth() + 12) - Number(d1.getMonth()) > 6) {
        d3.setDate(d3.getDate() - 1);
      }
    }
    const dt1 = DateTimeModel.fromLocalString(this.form.get("startDate").value);
    const dt2 = DateTimeModel.fromLocalString(this.form.get("endDate").value);
    const dt3 = DateTimeModel.fromLocalString(d3.toString());
    if (field === "startDate") {
      return this.dataFormatService.after(dt1, dt2);
    }
    if (field === "endDate") {
      return this.dataFormatService.after(dt2, dt3);
    }
  }

  formatPreShow(content: string) {
    if (content.length > 60) return content.substring(0, 60) + "...";
    else return content;
  }

  /**
   * Product autocomplete
   * @param event
   */

  getOrgList(keyWork: any, code: any) {
    const data = {
      groupCode: code,
      keyWord: keyWork,
      page: 0,
      pageSize: 10
    };
  }

  // convert data from 'dd/MM/yyyy' to 'yyyy/MM/dd'
  convertDate(dateInput: any) {
    if (dateInput === null || dateInput === "") return null;
    const arr = dateInput.split("/");
    return arr[2] + "/" + arr[1] + "/" + arr[0];
  }

  convertDateUpdate(str) {
    const date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  /**
   *  So sánh ngày tháng
   * Nếu date1 > date2 => 1
   * Nếu date1 = date2 => 0
   * Nếu date1 < date2 => -1
   * Nếu valid input => -2
   *
   * @param date1
   * @param date2
   */
  equalDateStr(date1: string, date2: string) {
    if (
      date1 == null ||
      date2 == null ||
      date1 === "" ||
      date2 === "" ||
      date1 === undefined ||
      date2 === undefined
    )
      return -2;
    const dt1 = this.fortmatDate(date1);
    const dt2 = this.fortmatDate(date2);
    if (dt1 > dt2) return 1;
    else if (dt1 < dt2) return -1;
    else return 0;
  }

  fortmatDate(dateString: string): DateTimeModel {
    const date = new Date(dateString);
    const isValidDate = !isNaN(date.valueOf());
    if (!dateString || !isValidDate) {
      return null;
    }
    return new DateTimeModel({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    });
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
