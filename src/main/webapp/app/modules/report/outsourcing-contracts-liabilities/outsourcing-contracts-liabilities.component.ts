import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HeightService } from "app/shared/services/height.service";
import * as moment from "moment";
import { HttpResponse } from "@angular/common/http";
import { OutsourcingContractLiabilitiesService } from "app/core/services/report/outsourcing-contract-liabilities.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "app/shared/services/common.service";
import { ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { CommonApiService } from "app/core/services/common-api/common-api.service";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { DownloadService } from "app/shared/services/download.service";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { DataFormatService } from "app/shared/services/data-format.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { REGEX_PATTERN } from "app/shared/constants/pattern.constants";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { Observable, of, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { OutsourcingPlanStatisticService } from "app/core/services/report/outsourcing-plan-statistic.service";

/**
 * huyenlt-08/06/2020
 *  start validate table
 * text mask
 */
@Component({
  selector: "jhi-outsourcing-contracts-liabilities",
  templateUrl: "./outsourcing-contracts-liabilities.component.html",
  styleUrls: ["./outsourcing-contracts-liabilities.component.scss"]
})
export class OutsourcingContractsLiabilitiesComponent implements OnInit {
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
  routeData: any;
  outsourceContractList: any;
  businessUnitList: any;
  productUnitList: any;
  signatureStatusList: any;
  contractStatusList: any;
  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;
  totalColSpan: any;
  totalColSpanTotal: any;

  columns = [
    {
      key: 0,
      value: this.translateService.instant(
        "reportOutsourcingContract.contractNumber"
      ),
      isShow: true
    },
    {
      key: 1,
      value: this.translateService.instant(
        "reportOutsourcingContract.projectCode"
      ),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant(
        "reportOutsourcingContract.projectName"
      ),
      isShow: true
    },
    {
      key: 3,
      value: this.translateService.instant(
        "reportOutsourcingContract.ttrPakdNumber"
      ),
      isShow: true
    },
    {
      key: 4,
      value: this.translateService.instant(
        "reportOutsourcingContract.outsourcingOrganization"
      ),
      isShow: true
    },
    {
      key: 5,
      value: this.translateService.instant(
        "reportOutsourcingContract.productOrganization"
      ),
      isShow: true
    },
    {
      key: 6,
      value: this.translateService.instant(
        "reportOutsourcingContract.businessOrganization"
      ),
      isShow: true
    },
    {
      key: 7,
      value: this.translateService.instant(
        "reportOutsourcingContract.signedState"
      ),
      isShow: true
    },
    {
      key: 8,
      value: this.translateService.instant(
        "reportOutsourcingContract.contractState"
      ),
      isShow: true
    },
    {
      key: 9,
      value: this.translateService.instant("reportOutsourcingContract.mmPay"),
      isShow: true
    },
    {
      key: 10,
      value: this.translateService.instant("reportOutsourcingContract.mmOwed"),
      isShow: true
    }
  ];

  totalMMOutsource: any;
  totalMMPaid: any;
  totalMMDebit: any;

  listBusinessUnit$ = new Observable<any[]>();
  bUnitSearch;
  listProductUnit$ = new Observable<any[]>();
  pUnitSearch;
  typeSearchUnit;
  debouncer: Subject<string> = new Subject<string>();
  groupCode;
  notFoundText;

  constructor(
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private outsourcingContractLiabilitiesService: OutsourcingContractLiabilitiesService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    public translateService: TranslateService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private commonApiService: CommonApiService,
    private appParamsService: AppParamsService,
    private downloadService: DownloadService,
    private commonUtils: CommonUtils,
    private dataFormatService: DataFormatService,
    private outsourcingPlanStatisticService: OutsourcingPlanStatisticService
  ) {
    this.totalMMOutsource = 0;
    this.totalMMPaid = 0;
    this.totalMMDebit = 0;
    this.totalColSpan = 7;
    this.totalColSpanTotal = 9;
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
    this.buildForm();
    this.onResize();
    this.getAppParamList();
    this.debounceOnSearch();
    this.loadAll();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      partnerCode: [""],
      projectCode: [""],
      contractNumber: [""],
      rentName: [""],
      manufacturingOrgName: [""],
      businessName: [""],
      signatureStatus: [""],
      contractStatus: [""],
      startTime: [""],
      endTime: [""],
      businessID: [null],
      manufacturingOrgID: [null]
    });
  }

  getAppParamList() {
    const page = 0;
    const limit = 50;
    /*get is signature Status list*/
    this.appParamsService.getParamByCode("TTK").subscribe(res => {
      this.signatureStatusList = res.body;
    });

    /*get is contract Status list*/
    this.appParamsService.getParamByCode("TTHD").subscribe(res => {
      this.contractStatusList = res.body;
    });

    /*get business unit list*/
    this.commonApiService
      .getOrganizationList(page, limit, "business")
      .subscribe(res => {
        this.businessUnitList = res.body.data;
      });

    /*get product unit list*/
    this.commonApiService
      .getOrganizationList(page, limit, "product")
      .subscribe(res => {
        this.productUnitList = res.body.data;
      });
  }

  private paginateProjectList(data) {
    this.totalMMDebit = 0;
    this.totalMMPaid = 0;
    this.totalMMOutsource = 0;
    this.second = data.totalPages;
    this.totalItems = data.totalElements;
    this.outsourceContractList = data.content;
    this.outsourceContractList = data.content ? data.content : null;

    if (
      this.outsourceContractList.length != null &&
      this.outsourceContractList.length > 0
    ) {
      this.totalMMOutsource = this.outsourceContractList[0]["totalData"][
        "strTotalMMOutsource"
      ];
      this.totalMMPaid = this.outsourceContractList[0]["totalData"][
        "strTotalMMPaid"
      ];
      this.totalMMDebit = this.outsourceContractList[0]["totalData"][
        "strTotalMMDebit"
      ];
    }
    this.outsourceContractList.push({
      isTotal: true,
      totalMMPaid: this.totalMMPaid,
      totalMMOutsource: this.totalMMOutsource,
      totalMMDebit: this.totalMMDebit
    });
  }

  loadAll() {
    this.spinner.show();
    // fix trim after search
    if (
      [null, undefined].indexOf(document.getElementById("contractNumber")) < 0
    ) {
      document.getElementById("contractNumber")["value"] = this.form.get(
        "contractNumber"
      ).value
        ? this.form.get("contractNumber").value.trim()
        : "";
      document.getElementById("partnerCode")["value"] = this.form.get(
        "partnerCode"
      ).value
        ? this.form.get("partnerCode").value.trim()
        : "";
      document.getElementById("projectCode")["value"] = this.form.get(
        "projectCode"
      ).value
        ? this.form.get("projectCode").value.trim()
        : "";
      document.getElementById("outsourcingOrganization")[
        "value"
      ] = this.form.get("rentName").value
        ? this.form.get("rentName").value.trim()
        : "";
    }
    // end fix
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

    this.outsourcingContractLiabilitiesService
      .getAllReport({
        page: this.page - 1,
        size: this.itemsPerPage,
        partnerCode: this.form.get("partnerCode").value
          ? this.form.get("partnerCode").value
          : "",
        projectCode: this.form.get("projectCode").value
          ? this.form.get("projectCode").value
          : "",
        contractNumber: this.form.get("contractNumber").value
          ? this.form.get("contractNumber").value
          : "",
        rentName: this.form.get("rentName").value
          ? this.form.get("rentName").value
          : "",
        manufacturingOrgName: this.form.get("manufacturingOrgName").value
          ? this.form.get("manufacturingOrgName").value
          : "",
        businessName: this.form.get("businessName").value
          ? this.form.get("businessName").value
          : "",
        signatureStatus: this.form.get("signatureStatus").value
          ? this.form.get("signatureStatus").value
          : "",
        contractStatus: this.form.get("contractStatus").value
          ? this.form.get("contractStatus").value
          : "",
        startTimeFrom: startTimeFrom ? startTimeFrom : "",
        startTimeTo: startTimeTo ? startTimeTo : "",
        endTimeFrom: endTimeFrom ? endTimeFrom : "",
        endTimeTo: endTimeTo ? endTimeTo : "",
        manufacturingOrgID: this.form.get("manufacturingOrgID").value
          ? this.form.get("manufacturingOrgID").value
          : "",
        businessID: this.form.get("businessID").value
          ? this.form.get("businessID").value
          : ""
      })
      .subscribe(
        (res: HttpResponse<[]>) => {
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

  onExport() {
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }
    this.spinner.show();
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
    this.outsourcingContractLiabilitiesService
      .exportExcel({
        partnerCode: this.form.get("partnerCode").value
          ? this.form.get("partnerCode").value
          : "",
        projectCode: this.form.get("projectCode").value
          ? this.form.get("projectCode").value
          : "",
        contractNumber: this.form.get("contractNumber").value
          ? this.form.get("contractNumber").value
          : "",
        rentName: this.form.get("rentName").value
          ? this.form.get("rentName").value
          : "",
        manufacturingOrgName: this.form.get("manufacturingOrgName").value
          ? this.form.get("manufacturingOrgName").value
          : "",
        businessName: this.form.get("businessName").value
          ? this.form.get("businessName").value
          : "",
        signatureStatus: this.form.get("signatureStatus").value
          ? this.form.get("signatureStatus").value
          : "",
        contractStatus: this.form.get("contractStatus").value
          ? this.form.get("contractStatus").value
          : "",
        startTimeFrom: startTimeFrom ? startTimeFrom : "",
        startTimeTo: startTimeTo ? startTimeTo : "",
        endTimeFrom: endTimeFrom ? endTimeFrom : "",
        endTimeTo: endTimeTo ? endTimeTo : "",
        manufacturingOrgID: this.form.get("manufacturingOrgID").value
          ? this.form.get("manufacturingOrgID").value
          : "",
        businessID: this.form.get("businessID").value
          ? this.form.get("businessID").value
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

  changePageSize(size) {
    this.itemsPerPage = size;
    this.loadAll();
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

  toggleColumns(col) {
    let colSpan = 0;
    let colSpanTotal = 0;
    col.isShow = !col.isShow;

    for (let i = 0; i < 7; i++) {
      if (this.columns[i].isShow == true) {
        colSpan += 1;
      }
    }
    this.totalColSpan = colSpan;

    for (let i = 0; i < 10; i++) {
      if (this.columns[i].isShow == true) {
        colSpanTotal += 1;
      }
    }
    this.totalColSpanTotal = colSpanTotal;
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
      $(".ng-option").css("display", "none");
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
}
