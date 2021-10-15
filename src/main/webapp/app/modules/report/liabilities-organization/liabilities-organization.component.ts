import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HeightService } from "app/shared/services/height.service";
import { LiabilitiesOrganizationService } from "app/core/services/report/liabilities-organization.service";
import * as moment from "moment";
import { HttpResponse } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from "@ngx-translate/core";
import { ToastService } from "app/shared/services/toast.service";
import { CommonService } from "app/shared/services/common.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { ActivatedRoute } from "@angular/router";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { DownloadService } from "app/shared/services/download.service";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";

@Component({
  selector: "jhi-liabilities-organization",
  templateUrl: "./liabilities-organization.component.html",
  styleUrls: ["./liabilities-organization.component.scss"]
})
export class LiabilitiesOrganizationComponent implements OnInit {
  form: FormGroup;
  height: number;
  page: any;
  itemsPerPage: any;
  maxSizePage: any;
  second: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  reportList: any;
  routeData: any;
  signCode = "TTK";
  signatureStatusList: any;

  total = 0;

  // tunglm-iist start

  columns = [
    {
      key: 0,
      value: this.translateService.instant(
        "reportLiabilitiesOrgan.organization"
      ),
      isShow: true
    },
    {
      key: 1,
      value: this.translateService.instant(
        "reportLiabilitiesOrgan.partnerList"
      ),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant("reportLiabilitiesOrgan.mmTotal"),
      isShow: true
    }
  ];
  nonShowColumns: number[] = [11, 12];

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;

  // tunglm-iist end
  constructor(
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private liabilitiesOrganizationService: LiabilitiesOrganizationService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private appParamsService: AppParamsService,
    private translateService: TranslateService,
    private commonService: CommonService,
    private downloadService: DownloadService,
    private commonUtils: CommonUtils,
    private activatedRoute: ActivatedRoute
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
    this.buildFrom();
    this.onResize();
    this.getStatusSign();
    this.onSearchReport();
  }

  private buildFrom() {
    this.form = this.formBuilder.group({
      outsourcingOrgName: [""],
      partnerShortName: [""],
      startTime: [""],
      endTime: [""],
      signatureStatus: [""]
    });
  }

  getAppParamList() {
    const page = 0;
    const limit = 50;
    /*get is signature Status list*/
    this.appParamsService.getParamByCode("TTK").subscribe(res => {
      this.signatureStatusList = res.body;
    });
  }

  private paginateProjectList(data) {
    this.second = data.totalPages;
    this.totalItems = data.totalElements;
    this.reportList = data.content;

    this.total = 0;
    for (let i = 0; i < data.content.length; i++) {
      if (data.content[i].totalMmOwed !== null) {
        this.total = data.content[i].strTotalMmOwed;
        break;
      }
    }
  }

  NVL(val) {
    if (!val) return 0;
    return val;
  }

  getRequestParam() {
    let startTimeFrom = "";
    let startTimeTo = "";
    let endTimeFrom = "";
    let endTimeTo = "";
    if (this.form.value.startTime && this.form.value.startTime !== "") {
      startTimeFrom = this.form.value.startTime.slice(0, 10);
      startTimeTo = this.form.value.startTime.slice(13, 23);
    }
    if (this.form.value.endTime && this.form.value.endTime !== "") {
      endTimeFrom = this.form.value.endTime.slice(0, 10);
      endTimeTo = this.form.value.endTime.slice(13, 23);
    }

    return {
      page: this.page - 1,
      size: this.itemsPerPage,
      organization: this.form.get("outsourcingOrgName").value
        ? this.form.get("outsourcingOrgName").value
        : "",
      partnerShortName: this.form.get("partnerShortName").value
        ? this.form.get("partnerShortName").value
        : "",
      startTimeFrom: startTimeFrom ? startTimeFrom : "",
      startTimeTo: startTimeTo ? startTimeTo : "",
      endTimeFrom: endTimeFrom ? endTimeFrom : "",
      endTimeTo: endTimeTo ? endTimeTo : "",
      signatureStatus: this.form.get("signatureStatus").value
        ? this.form.get("signatureStatus").value
        : ""
    };
  }

  validateTime(field: string) {
    if (field === "startTime") {
      let startTimeFrom = "";
      let startTimeTo = "";
      if (this.form.value.startTime && this.form.value.startTime !== "") {
        startTimeFrom = this.form.value.startTime.slice(0, 10);
        startTimeTo = this.form.value.startTime.slice(13, 23);
      }
      if (
        !this.validateDate(startTimeFrom) ||
        !this.validateDate(startTimeTo)
      ) {
        return true;
      }
    }
    if (field === "endTime") {
      let endTimeFrom = "";
      let endTimeTo = "";

      if (this.form.value.endTime && this.form.value.endTime !== "") {
        endTimeFrom = this.form.value.endTime.slice(0, 10);
        endTimeTo = this.form.value.endTime.slice(13, 23);
      }

      if (!this.validateDate(endTimeFrom) || !this.validateDate(endTimeTo)) {
        return true;
      }
    }
  }

  loadAll() {
    let startTimeFrom = "";
    let startTimeTo = "";
    let endTimeFrom = "";
    let endTimeTo = "";
    if (this.form.value.startTime && this.form.value.startTime !== "") {
      startTimeFrom = this.form.value.startTime.slice(0, 10);
      startTimeTo = this.form.value.startTime.slice(13, 23);
    }
    if (this.form.value.endTime && this.form.value.endTime !== "") {
      endTimeFrom = this.form.value.endTime.slice(0, 10);
      endTimeTo = this.form.value.endTime.slice(13, 23);
    }

    if (!this.validateDate(startTimeFrom) || !this.validateDate(startTimeTo)) {
      this.toastService.openWarningToast("Thời gian bắt đầu không hợp lệ");
      return;
    }
    if (!this.validateDate(endTimeFrom) || !this.validateDate(endTimeTo)) {
      this.toastService.openWarningToast("Thời gian kết thúc không hợp lệ");
      return;
    }
    this.spinner.show();
    this.liabilitiesOrganizationService
      .getAllReport({
        page: this.page - 1,
        size: this.itemsPerPage,
        organization: this.form.get("outsourcingOrgName").value
          ? this.form.get("outsourcingOrgName").value
          : "",
        partnerShortName: this.form.get("partnerShortName").value
          ? this.form.get("partnerShortName").value
          : "",
        startTimeFrom: startTimeFrom ? startTimeFrom : "",
        startTimeTo: startTimeTo ? startTimeTo : "",
        endTimeFrom: endTimeFrom ? endTimeFrom : "",
        endTimeTo: endTimeTo ? endTimeTo : "",
        signatureStatus: this.form.get("signatureStatus").value
          ? this.form.get("signatureStatus").value
          : ""
      })
      .subscribe(
        (res: HttpResponse<[]>) => {
          this.spinner.hide();
          // this.reportList = res.body['content'];

          this.paginateProjectList(res.body);
        },
        error => {
          this.spinner.hide();
          this.toastService.openErrorToast(
            this.translateService.instant("common.toastr.messages.error.load")
          );
        }
      );
  }

  onSearchReport() {
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return true;
    }
    this.page = 1;
    this.loadAll();
  }

  onExport() {
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }
    this.spinner.show();
    this.liabilitiesOrganizationService
      .exportExcel(this.getRequestParam())
      .subscribe(
        res => {
          this.spinner.hide();
          if (res) {
            this.downloadService.downloadFile(res);
          }
        },
        error => {
          this.spinner.hide();
          if (error.status === STATUS_CODE.BAD_REQUEST) {
            this.commonUtils.parseErrorBlob(error).subscribe(res => {
              this.toastService.openErrorToast(res.data);
            });
          } else {
            error.error.data
              ? this.toastService.openErrorToast(error.error.data)
              : this.toastService.openErrorToast(
                  this.translateService.instant(
                    "common.toastr.messages.error.export"
                  )
                );
          }
        }
      );
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.loadAll();
    }
  }

  // tunglm-iist start
  checkShowColumns(index) {
    for (const key of this.nonShowColumns) {
      if (key === index) {
        return false;
      }
    }
    return true;
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
  }

  getStatusSign() {
    this.spinner.show();
    this.appParamsService.getParamByCode("TTK").subscribe(res => {
      this.spinner.hide();
      this.signatureStatusList = res.body;
    });
  }

  // tunglm-iist end
  changePageSize(size) {
    this.itemsPerPage = size;
    this.loadAll();
  }

  trimSpace(fieldName) {
    this.setValueToField(fieldName, this.getValueOfField(fieldName).trim());
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }

  private validateDate(date) {
    if ([undefined, null, ""].indexOf(date) >= 0) return true;

    const arrDate = date.split("/");
    if (arrDate.length !== 3) return false;

    const day = +arrDate[0];
    const month = +arrDate[1];

    if ([2, 4, 6, 9, 11].indexOf(month) >= 0 && day > 30) return false;
    if (month === 2 && day > 29) return false;
    return true;
  }
}
