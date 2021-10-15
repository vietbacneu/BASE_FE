import { Component, OnInit } from "@angular/core";
import { Observable, of, Subject } from "rxjs";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HeightService } from "app/shared/services/height.service";
import { OutsourcingInfomationReportService } from "app/core/services/report/outsourcing-infomation-report.service";
import { OutsourcingPlanStatisticService } from "app/core/services/report/outsourcing-plan-statistic.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { ProfileAppraisalService } from "app/core/services/profile-appraisal/profile-appraisal.service";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { DownloadService } from "app/shared/services/download.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import { HttpResponse } from "@angular/common/http";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { ISOUTSOURCE } from "app/shared/constants/param.constants";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";

@Component({
  selector: "jhi-partner-project",
  templateUrl: "./partner-project.component.html",
  styleUrls: ["./partner-project.component.scss"]
})
export class PartnerProjectComponent implements OnInit {
  listBusinessUnit$ = new Observable<any[]>();
  bUnitSearch;
  listProductUnit$ = new Observable<any[]>();
  listOutsourceUnit$ = new Observable<any[]>();
  pUnitSearch;
  oUnitSearch;
  groupCode;

  pmSearch;
  amSearch;
  listPm$ = new Observable<any[]>();
  listAm$ = new Observable<any[]>();
  typeSearchUnit;
  typeSearchUser;

  partnerType;
  isOutsourceList;

  notFoundText;
  debouncer: Subject<string> = new Subject<string>();
  debouncerUser: Subject<string> = new Subject<string>();
  height: number;
  form: FormGroup;
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  maxSizePage = 10;
  previousPage: any;

  files = [];

  projectList = [];
  decimalPointSignSeparate;
  decimalPointSpace;

  totalAppraisedMM = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: "",
    decimalSymbol: ","
  };

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;

  columns = [
    { key: 0, value: "Mã dự án", isShow: true },
    { key: 1, value: "Tên dự án", isShow: true },
    { key: 2, value: "Có/Không thuê ngoài", isShow: true },
    { key: 3, value: "Đối tác", isShow: true },
    { key: 4, value: "Loại đối tác", isShow: true },
    { key: 5, value: "Đơn vị sản xuất", isShow: true },
    { key: 6, value: "Đầu mối sản xuất", isShow: true },
    { key: 7, value: "Đơn vị kinh doanh", isShow: true },
    { key: 8, value: "Đầu mối kinh doanh", isShow: true },
    { key: 9, value: "Đơn vị thuê ngoài", isShow: true },
    { key: 10, value: "Đầu mối đề nghị hợp tác", isShow: true },
    { key: 11, value: "Số MM thẩm định", isShow: true },
    { key: 12, value: "Số MM sử dụng thực tế", isShow: true },
    { key: 13, value: "Số MM còn lại", isShow: true },
    { key: 14, value: "Số TTr PAKD", isShow: true }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private heightService: HeightService,
    private reportService: OutsourcingInfomationReportService,
    private outsourcingPlanStatisticService: OutsourcingPlanStatisticService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private profileAppraisalService: ProfileAppraisalService,
    private appParamsService: AppParamsService,
    private downloadService: DownloadService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.maxSizePage = MAX_SIZE_PAGE;
  }

  ngOnInit() {
    this.onResize();
    this.buildForm();
    this.debounceOnSearch();
    this.getPartnerType();
    this.getIsOutsource();
    this.setDecimal();
    this.search(true);
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
  }

  setDecimal() {
    this.totalAppraisedMM = createNumberMask({ ...this.totalAppraisedMM });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      projectCode: [""],
      projectName: [""],
      partnerCode: [""],
      partnerType: [""],
      am: [null],
      pm: [null],
      outsourcingOrgId: [""],
      businessOrgId: [null],
      manufacturingOrgId: [null],
      totalAppraisedMM: [""],
      isOutsource: [""],
      proposedCooperationName: [""]
    });
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  onError(event) {}

  get f() {
    return this.form.controls;
  }

  search(isShowFirst: boolean) {
    this.spinner.show();
    if ([null, undefined].indexOf(document.getElementById("projectCode")) < 0) {
      document.getElementById("projectCode")["value"] = this.form.get(
        "projectCode"
      ).value
        ? this.form.get("projectCode").value.trim()
        : "";
      document.getElementById("projectName")["value"] = this.form.get(
        "projectName"
      ).value
        ? this.form.get("projectName").value.trim()
        : "";
      document.getElementById("partnerCode")["value"] = this.form.get(
        "partnerCode"
      ).value
        ? this.form.get("partnerCode").value.trim()
        : "";
      document.getElementById("proposedCooperationName")[
        "value"
      ] = this.form.get("proposedCooperationName").value
        ? this.form.get("proposedCooperationName").value.trim()
        : "";
      document.getElementById("totalAppraisedMM")["value"] = this.form.get(
        "totalAppraisedMM"
      ).value
        ? this.form.get("totalAppraisedMM").value.trim()
        : "";
      document.getElementById("outsourcingOrgId")["value"] = this.form.get(
        "outsourcingOrgId"
      ).value
        ? this.form.get("outsourcingOrgId").value.trim()
        : "";
    }
    if (isShowFirst) {
      this.previousPage = 1;
      this.page = 1;
    }
    const data = {
      projectName: this.form.value.projectName
        ? this.form.value.projectName
        : "",
      projectCode: this.form.value.projectCode
        ? this.form.value.projectCode
        : "",
      partnerCode: this.form.value.partnerCode
        ? this.form.value.partnerCode
        : "",
      partnerType: this.form.value.partnerType
        ? this.form.value.partnerType
        : "",
      am: this.form.value.am ? this.form.value.am : "",
      pm: this.form.value.pm ? this.form.value.pm : "",
      outSourcingOrgName: this.form.value.outsourcingOrgId
        ? this.form.value.outsourcingOrgId
        : "",
      businessOrgId: this.form.value.businessOrgId
        ? this.form.value.businessOrgId
        : "",
      manufacturingOrgId: this.form.value.manufacturingOrgId
        ? this.form.value.manufacturingOrgId
        : "",
      proposedCooperationName: this.form.value.proposedCooperationName
        ? this.form.value.proposedCooperationName
        : "",
      totalAppraisedMM: this.form.value.totalAppraisedMM
        ? this.form.value.totalAppraisedMM.replace(",", ".")
        : "",
      isOutsource: this.form.value.isOutsource
        ? this.form.value.isOutsource
        : "",
      page: this.page - 1,
      size: this.itemsPerPage
    };

    this.reportService.searchOutsourcingProject(data).subscribe(
      res => {
        this.spinner.hide();
        this.projectList = res.body.content;
        this.totalItems = res.body.totalElements;
      },
      error => {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.load")
        );
      }
    );
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

  onSearchUnit(event, type) {
    switch (type) {
      case 1: {
        this.pUnitSearch = event.term;
        break;
      }
      case 2: {
        this.bUnitSearch = event.term;
        break;
      }
      case 3: {
        this.oUnitSearch = event.term;
        break;
      }
    }

    // type === 1 ? (this.pUnitSearch = event.term) : (this.bUnitSearch = event.term);
    const term = event.term;
    this.typeSearchUnit = type;
    if (term !== "") {
      this.debouncer.next(term);
      this.notFoundText = "";
      $(".ng-option").css("display", "none");
    } else {
      type === 1
        ? (this.listProductUnit$ = of([]))
        : type === 2
        ? (this.listBusinessUnit$ = of([]))
        : (this.listOutsourceUnit$ = of([]));
    }
  }

  onClearUnit(type: number) {
    switch (type) {
      case 1: {
        this.listProductUnit$ = of([]);
        this.pUnitSearch = "";
        break;
      }
      case 2: {
        this.listBusinessUnit$ = of([]);
        this.bUnitSearch = "";
        break;
      }
      case 3: {
        this.listOutsourceUnit$ = of([]);
        this.oUnitSearch = "";
        break;
      }
    }
  }

  onClearUser(type) {
    switch (type) {
      case 1: {
        this.listPm$ = of([]);
        this.pmSearch = "";
        break;
      }
      case 2: {
        this.listAm$ = of([]);
        this.amSearch = "";
        break;
      }
    }
  }

  onSearchUnitClose(type) {
    if (!this.form.value.businessUnitId && type === 2) {
      this.listBusinessUnit$ = of([]);
      this.bUnitSearch = "";
    }
    if (!this.form.value.productUnitId && type === 1) {
      this.listProductUnit$ = of([]);
      this.pUnitSearch = "";
    }
    if (!this.form.value.outsourcingOrgId && type === 3) {
      this.listOutsourceUnit$ = of([]);
      this.oUnitSearch = "";
    }
  }

  loadDataOnSearchUnit(term) {
    this.typeSearchUnit === 1
      ? (this.groupCode = "SX")
      : this.typeSearchUnit === 2
      ? (this.groupCode = "KD")
      : (this.groupCode = "");

    this.outsourcingPlanStatisticService
      .getUnit({
        name: term,
        groupCode: this.groupCode,
        pageSize: ITEMS_PER_PAGE,
        page: 0
      })
      .subscribe((res: HttpResponse<any[]>) => {
        if (res) {
          if (res.body["data"] === null) {
            this.notFoundText = "common.select.notFoundText";
            $(".ng-option").css("display", "block");
          }
          this.typeSearchUnit === 1
            ? (this.listProductUnit$ = of(
                res.body["data"].sort((a, b) => a.name.localeCompare(b.name))
              ))
            : this.typeSearchUnit === 2
            ? (this.listBusinessUnit$ = of(
                res.body["data"].sort((a, b) => a.name.localeCompare(b.name))
              ))
            : (this.listOutsourceUnit$ = of(
                res.body["data"].sort((a, b) => a.name.localeCompare(b.name))
              ));
        } else {
          this.typeSearchUnit === 1
            ? (this.listProductUnit$ = of([]))
            : this.typeSearchUnit === 2
            ? (this.listBusinessUnit$ = of([]))
            : (this.listOutsourceUnit$ = of([]));
        }
      });
  }

  loadDataOnSearchUser(term) {
    //
    this.reportService
      .searchUserByName({
        text: term,
        limit: 10
      })
      .subscribe(res => {
        if (res) {
          if (res.body.length === 0)
            this.notFoundText = "common.select.notFoundText";
          this.typeSearchUser === 1
            ? (this.listPm$ = of(
                res.body.sort((a, b) => a.name.localeCompare(b.name))
              ))
            : (this.listAm$ = of(
                res.body.sort((a, b) => a.name.localeCompare(b.name))
              ));
        } else {
          this.typeSearchUser === 1
            ? (this.listPm$ = of([]))
            : (this.listAm$ = of([]));
        }
      });
  }

  onSearchUserClose(type) {
    if (!this.form.value.pm && type === 1) {
      this.listPm$ = of([]);
      this.pmSearch = "";
    }
    if (!this.form.value.am && type === 2) {
      this.listAm$ = of([]);
      this.amSearch = "";
    }
  }

  debounceOnSearch() {
    this.debouncer
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.loadDataOnSearchUnit(value));
    this.debouncerUser
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => {
        this.loadDataOnSearchUser(value);
      });
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.transition();
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    this.search(false);
  }

  getPartnerType() {
    // this.profileAppraisalService.getPartnerCategoryList(null).subscribe(res => {
    //   if (res) {
    //     this.partnerType = res.body;
    //   }
    // });
  }

  getIsOutsource() {
    this.appParamsService.getParamByCode(ISOUTSOURCE).subscribe(res => {
      if (res) {
        this.isOutsourceList = res.body;
      }
    });
  }

  onSearchUser(event, type) {
    switch (type) {
      case 1: {
        this.pmSearch = event.term;
        break;
      }
      case 2: {
        this.amSearch = event.term;
        break;
      }
    }
    const term = event.term;
    this.typeSearchUser = type;
    if (term !== "") {
      this.debouncerUser.next(term);
      this.notFoundText = null;
    } else {
      type === 1 ? (this.listPm$ = of([])) : (this.listAm$ = of([]));
    }
  }

  onExport() {
    this.spinner.show();
    const data = {
      projectName: this.form.value.projectName
        ? this.form.value.projectName
        : "",
      projectCode: this.form.value.projectCode
        ? this.form.value.projectCode
        : "",
      partnerCode: this.form.value.partnerCode
        ? this.form.value.partnerCode
        : "",
      partnerType: this.form.value.partnerType
        ? this.form.value.partnerType
        : "",
      am: this.form.value.am ? this.form.value.am : "",
      pm: this.form.value.pm ? this.form.value.pm : "",
      outSourcingOrgName: this.form.value.outsourcingOrgId
        ? this.form.value.outsourcingOrgId
        : "",
      businessOrgId: this.form.value.businessOrgId
        ? this.form.value.businessOrgId
        : "",
      manufacturingOrgId: this.form.value.manufacturingOrgId
        ? this.form.value.manufacturingOrgId
        : "",
      proposedCooperationName: this.form.value.proposedCooperationName
        ? this.form.value.proposedCooperationName
        : "",
      totalAppraisedMM: this.form.value.totalAppraisedMM
        ? this.form.value.totalAppraisedMM.replace(",", ".")
        : "",
      isOutsource: this.form.value.isOutsource
        ? this.form.value.isOutsource
        : ""
    };
    this.reportService.exportExcelOutsourcingProject(data).subscribe(
      res => {
        this.spinner.hide();
        if (res) {
          this.downloadService.downloadFile(res);
        }
      },
      error => {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.load")
        );
      }
    );
  }
  deleteZero(event) {
    const value = event.target.value;
    if (Number(value) === 0) {
      event.target.value = value.replace(value, "");
    }
  }
}
