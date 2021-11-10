import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HeightService } from "app/shared/services/height.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { CommonService } from "app/shared/services/common.service";
import { ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { REGEX_PATTERN } from "app/shared/constants/pattern.constants";
import { DownloadService } from "app/shared/services/download.service";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { CommonApiService } from "app/core/services/common-api/common-api.service";
import { DateTimeModel } from "app/core/models/base.model";
import { DataFormatService } from "app/shared/services/data-format.service";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";
import { Observable, of, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { HttpResponse } from "@angular/common/http";
import { OutsourcingPlanStatisticService } from "app/core/services/report/outsourcing-plan-statistic.service";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { OutsourcingInfomationReportService } from "app/core/services/report/outsourcing-infomation-report.service";

@Component({
  selector: "jhi-project-list",
  templateUrl: "./project-list.component.html",
  styleUrls: ["./project-list.component.scss"]
})
export class ProjectListComponent implements OnInit {
  form: FormGroup;
  height: number;

  page: any;
  itemsPerPage: any;
  maxSizePage: any;
  routeData: any;
  second: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  projectList: any;
  beginDate = new Date();
  ISOUTSOURCE = "ISOUTSOURCE";
  BUSINESS_CODE = "business";
  PRODUCT_CODE = "product";
  isOutsourceList: any;
  businessUnitList: any;
  productUnitList: any;

  listBusinessUnit$ = new Observable<any[]>();
  bUnitSearch;
  listProductUnit$ = new Observable<any[]>();
  pUnitSearch;
  typeSearchUnit;
  debouncer: Subject<string> = new Subject<string>();
  groupCode;
  messageDate = null;
  contractStatus: any;
  contractStatusMap: any;
  signStatus: any;
  signStatusMap: any;
  listBusiness$ = new Observable<any[]>();
  partnerSearch;
  notFoundText;

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;
  columns = [
    {
      key: 0,
      value: this.translateService.instant("reportProject.projectCode"),
      isShow: true
    },
    {
      key: 1,
      value: this.translateService.instant("reportProject.projectName"),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant("reportProject.partnerShortName"),
      isShow: true
    },
    {
      key: 3,
      value: this.translateService.instant("reportProject.customer"),
      isShow: true
    },
    {
      key: 4,
      value: this.translateService.instant("reportProject.pm"),
      isShow: true
    },
    {
      key: 5,
      value: this.translateService.instant("reportProject.productOrganization"),
      isShow: true
    },
    {
      key: 6,
      value: this.translateService.instant("reportProject.am"),
      isShow: true
    },
    {
      key: 7,
      value: this.translateService.instant(
        "reportProject.businessOrganization"
      ),
      isShow: true
    },
    {
      key: 8,
      value: this.translateService.instant("reportProject.startDate"),
      isShow: true
    },
    {
      key: 9,
      value: this.translateService.instant("reportProject.endDate"),
      isShow: true
    },
    {
      key: 10,
      value: this.translateService.instant("reportProject.expectedDate"),
      isShow: true
    },
    {
      key: 11,
      value: this.translateService.instant("reportProject.outsourcing"),
      isShow: true
    },
    {
      key: 12,
      value: this.translateService.instant("reportProject.programmingLanguage"),
      isShow: true
    },
    {
      key: 13,
      value: this.translateService.instant("reportProject.frameworks"),
      isShow: true
    },
    {
      key: 14,
      value: this.translateService.instant("reportProject.database"),
      isShow: true
    },
    {
      key: 15,
      value: this.translateService.instant("reportProject.version"),
      isShow: true
    },
    {
      key: 16,
      value: this.translateService.instant("reportProject.note"),
      isShow: true
    }
  ];

  constructor(
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private versionManagementService: VersionManagementService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private appParamsService: AppParamsService,
    private commonApiService: CommonApiService,
    private downloadService: DownloadService,
    private commonUtils: CommonUtils,
    private dataFormatService: DataFormatService,
    private outsourcingPlanStatisticService: OutsourcingPlanStatisticService,
    private reportService: OutsourcingInfomationReportService
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

  ngOnInit() {
    this.beginDate.setDate(1);
    this.buildForm();
    this.onResize();
    this.getAppParamList();
    this.getContractStatus();
    this.getSignStatus();
    this.debounceOnSearch();
    this.loadAll();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      partnerCode: [null],
      projectName: [""],
      customer: [""],
      productOrgId: [null],
      productUnitName: [""],
      businessOrgId: [null],
      businessUnitName: [""],
      isOutsource: [""],
      startDate: [new Date()],
      endDate: [new Date()],
      signatureStatus: [""], //Trạng thái ký
      contractStatus: [""] //Trạng thái hđong
    });
    this.beginDate = null;
  }

  getContractStatus() {
    this.reportService.getSignStatusOrContractStatus("TTHD").subscribe(res => {
      this.contractStatus = res;
      if (this.contractStatus && this.contractStatus.length > 0) {
        this.contractStatusMap = {};
        this.contractStatus.forEach(c => {
          this.contractStatusMap[c.id] = c.paramName;
        });
      }
    });
  }

  getSignStatus() {
    this.reportService.getSignStatusOrContractStatus("TTK").subscribe(res => {
      this.signStatus = res;
      if (this.signStatus && this.signStatus.length > 0) {
        this.signStatusMap = {};
        this.signStatus.forEach(c => {
          this.signStatusMap[c.id] = c.paramName;
        });
      }
    });
  }

  private paginateProjectList(body) {
    this.second = body.pageCount;
    this.totalItems = body.dataCount;
    this.projectList = body.data ? body.data : null;
  }

  loadAll() {
    this.spinner.show();
    this.versionManagementService
      .search({
        code: "",
        product: "",
        business: "",
        isReportSearch: 1,
        page: this.page - 1,
        limit: this.itemsPerPage,
        partnerCode: this.form.get("partnerCode").value
          ? this.form.get("partnerCode").value
          : "",
        name: this.form.get("projectName").value
          ? this.form.get("projectName").value
          : "",
        customer: this.form.get("customer").value
          ? this.form.get("customer").value
          : "",
        productOrgId: this.form.get("productOrgId").value
          ? this.form.get("productOrgId").value
          : "",
        businessOrgId: this.form.get("businessOrgId").value
          ? this.form.get("businessOrgId").value
          : "",
        isOutsource: this.form.get("isOutsource").value
          ? this.form.get("isOutsource").value
          : "",
        startDate: this.form.get("startDate").value
          ? moment.utc(this.form.get("startDate").value).format("YYYY-MM-DD")
          : "",
        endDate: this.form.get("endDate").value
          ? moment.utc(this.form.get("endDate").value).format("YYYY-MM-DD")
          : "",
        signatureStatus: this.form.get("signatureStatus").value
          ? this.form.get("signatureStatus").value
          : "",
        contractStatus: this.form.get("contractStatus").value
          ? this.form.get("contractStatus").value
          : ""
      })
      .subscribe(
        res => {
          this.spinner.hide();
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

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.loadAll();
    }
  }

  onExport() {
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }
    this.spinner.show();
    this.versionManagementService
      .doExport({
        code: "",
        product: "",
        business: "",
        isReportSearch: 1,
        page: this.page - 1,
        limit: this.itemsPerPage,
        partnerCode: this.form.get("partnerCode").value
          ? this.form.get("partnerCode").value
          : "",
        name: this.form.get("projectName").value
          ? this.form.get("projectName").value
          : "",
        customer: this.form.get("customer").value
          ? this.form.get("customer").value
          : "",
        productOrgId: this.form.get("productOrgId").value
          ? this.form.get("productOrgId").value
          : "",
        businessOrgId: this.form.get("businessOrgId").value
          ? this.form.get("businessOrgId").value
          : "",
        isOutsource: this.form.get("isOutsource").value
          ? this.form.get("isOutsource").value
          : "",
        startDate: this.form.get("startDate").value
          ? moment.utc(this.form.get("startDate").value).format("YYYY-MM-DD")
          : "",
        endDate: this.form.get("endDate").value
          ? moment.utc(this.form.get("endDate").value).format("YYYY-MM-DD")
          : "",
        signatureStatus: this.form.get("signatureStatus").value
          ? this.form.get("signatureStatus").value
          : "",
        contractStatus: this.form.get("contractStatus").value
          ? this.form.get("contractStatus").value
          : ""
      })
      .subscribe(
        res => {
          this.spinner.hide();
          if (res) {
            this.downloadService.downloadFile(res);
          }
        },
        error => {
          this.spinner.hide();
        }
      );
  }

  isDateErr(field: string) {
    const d1 = new Date(this.form.get("startDate").value);
    const d3 = new Date(d1.toString());
    d3.setMonth(d1.getMonth());
    /*if (d1.getMonth()) {
      if (Number(d3.getMonth()) - Number(d1.getMonth())) {
        d3.setDate(d3.getDate() - 1);
      }
    } else {
      if (Number(d3.getMonth() + 12) - Number(d1.getMonth())) {
        d3.setDate(d3.getDate() - 1);
      }
    }*/
    const dt1 = DateTimeModel.fromLocalString(this.form.get("startDate").value);
    const dt2 = DateTimeModel.fromLocalString(this.form.get("endDate").value);
    const dt3 = DateTimeModel.fromLocalString(d3.toString());
    if (field === "startDate") {
      if (this.dataFormatService.after(dt1, dt2)) return true;
      else return false;
    }
    if (field === "endDate") {
      if (this.dataFormatService.after(dt2, dt3)) return true;
      else return false;
    }
  }

  getAppParamList() {
    const page = 0;
    const limit = 50;
    /*get is outsource list*/
    this.appParamsService.getParamByCode(this.ISOUTSOURCE).subscribe(res => {
      this.isOutsourceList = res.body;
    });

    /*get business unit list*/
    this.commonApiService
      .getOrganizationList(page, limit, this.BUSINESS_CODE)
      .subscribe(res => {
        this.businessUnitList = res.body.data;
      });

    /*get product unit list*/
    this.commonApiService
      .getOrganizationList(page, limit, this.PRODUCT_CODE)
      .subscribe(res => {
        this.productUnitList = res.body.data;
      });
  }

  customSearchFn(term: string, item: any) {
    const replacedKey = term.replace(REGEX_PATTERN.SEARCH_DROPDOWN_LIST, "");
    const newRegEx = new RegExp(replacedKey, "gi");
    const purgedPosition = item.name.replace(
      REGEX_PATTERN.SEARCH_DROPDOWN_LIST,
      ""
    );
    return newRegEx.test(purgedPosition);
  }

  onChangeProduct(event) {
    if (event) {
      this.form.get("productUnitName").setValue(event.id);
    } else {
      this.form.get("productUnitName").setValue("");
    }
  }

  onChangeBusiness(event) {
    if (event) {
      this.form.get("businessUnitName").setValue(event.id);
    } else {
      this.form.get("businessUnitName").setValue("");
    }
  }

  onClearProduct() {
    this.form.get("productUnitName").setValue("");
  }

  // onClearBusiness() {
  //   this.form.get('businessUnitName').setValue('');
  // }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.loadAll();
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  displayFieldHasError(field: string) {
    return {
      "has-error": this.isFieldValid(field)
    };
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
    }

    // type === 1 ? (this.pUnitSearch = event.term) : (this.bUnitSearch = event.term);
    const term = event.term;
    this.typeSearchUnit = type;
    if (term !== "") {
      this.debouncer.next(term);
      this.notFoundText = "";
    } else {
      type === 1
        ? (this.listProductUnit$ = of([]))
        : (this.listBusinessUnit$ = of([]));
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
  }

  debounceOnSearch() {
    this.debouncer
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.loadDataOnSearchUnit(value));
  }

  loadDataOnSearchUnit(term) {
    this.groupCode = "";
    if (this.typeSearchUnit === 1) {
      this.groupCode = "SX";
    }
    if (this.typeSearchUnit === 2) {
      this.groupCode = "KD";
    }
    this.outsourcingPlanStatisticService
      .getUnit({
        name: term,
        groupCode: this.groupCode,
        pageSize: ITEMS_PER_PAGE,
        page: 0
      })
      .subscribe((res: HttpResponse<any[]>) => {
        if (res) {
          if (res.body["data"] === null)
            this.notFoundText = "common.select.notFoundText";
          this.typeSearchUnit === 1
            ? (this.listProductUnit$ = of(
                res.body["data"].sort((a, b) => a.name.localeCompare(b.name))
              ))
            : this.typeSearchUnit === 2
            ? (this.listBusinessUnit$ = of(
                res.body["data"].sort((a, b) => a.name.localeCompare(b.name))
              ))
            : (this.listProductUnit$ = of(
                res.body["data"].sort((a, b) => a.name.localeCompare(b.name))
              ));
        } else {
          this.typeSearchUnit === 1
            ? (this.listProductUnit$ = of([]))
            : this.typeSearchUnit === 2
            ? (this.listBusinessUnit$ = of([]))
            : (this.listProductUnit$ = of([]));
        }
      });
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
  }

  customSearchFnMDA(term: string, item: any) {
    term = term.toLocaleLowerCase();
    term = term.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    term = term.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    term = term.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    term = term.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    term = term.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    term = term.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    term = term.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    term = term.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    term = term.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

    const partnerCode = item.partnerCode.toLocaleLowerCase();
    const partnerName = item.partnerName.toLocaleLowerCase();
    let partnerShortName = item.partnerShortName.toLocaleLowerCase();

    partnerShortName = partnerShortName.replace(
      /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,
      "a"
    );
    partnerShortName = partnerShortName.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    partnerShortName = partnerShortName.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    partnerShortName = partnerShortName.replace(
      /ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,
      "o"
    );
    partnerShortName = partnerShortName.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    partnerShortName = partnerShortName.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    partnerShortName = partnerShortName.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    partnerShortName = partnerShortName.replace(
      /\u0300|\u0301|\u0303|\u0309|\u0323/g,
      ""
    ); // Huyền sắc hỏi ngã nặng
    partnerShortName = partnerShortName.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return (
      partnerCode.indexOf(term) > -1 ||
      partnerName.indexOf(term) > -1 ||
      partnerShortName.indexOf(term) > -1 ||
      (partnerCode + " - " + partnerName + " - " + partnerShortName).includes(
        term
      )
    );
  }

  onSearchPartner(value) {
    this.partnerSearch = value.term;
    this.outsourcingPlanStatisticService
      .getPartnerAutoComplete({
        partnerSearch: value.term
      })
      .subscribe(res => {
        if (res) {
          this.listBusiness$ = of(res.body["data"]);
        } else {
          this.listBusiness$ = of([]);
        }
      });
  }

  onClearPartner() {
    this.listBusiness$ = of([]);
    this.setValueToField("name", "");
  }

  onSearchPartnerClose() {
    if (!this.form.value.id) {
      this.listBusiness$ = of([]);
      this.partnerSearch = "";
    }
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }
}
