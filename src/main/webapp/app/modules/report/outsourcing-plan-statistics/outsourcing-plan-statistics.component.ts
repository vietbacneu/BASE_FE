import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { CommonService } from "app/shared/services/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from "@ngx-translate/core";
import { OutsourcingPlanService } from "app/core/services/outsourcing-plan/outsourcing-plan.service";
import { HeightService } from "app/shared/services/height.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { OutsourcingPlanStatisticService } from "app/core/services/report/outsourcing-plan-statistic.service";
import { Observable, of, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { HttpResponse } from "@angular/common/http";
import { ToastService } from "app/shared/services/toast.service";
import { DownloadService } from "app/shared/services/download.service";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";

@Component({
  selector: "jhi-outsourcing-plan-statistics",
  templateUrl: "./outsourcing-plan-statistics.component.html",
  styleUrls: ["./outsourcing-plan-statistics.component.scss"]
})
export class OutsourcingPlanStatisticsComponent implements OnInit {
  height: number;
  form: FormGroup;
  itemsPerPage: any;
  maxSizePage: any;
  routeData: any;
  page: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  listProductUnit$ = new Observable<any[]>();
  listBusinessUnit$ = new Observable<any[]>();
  pUnitSearch;
  bUnitSearch;
  typeSearchUnit;
  outsourcingPlan;
  planStatusList: any;
  outsourceTypeList: any;
  debouncer: Subject<string> = new Subject<string>();
  notFoundText;
  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;

  columns = [
    {
      key: 0,
      value: this.translateService.instant(
        "outsourcingPlanReport.project-code"
      ),
      isShow: true
    },
    {
      key: 1,
      value: this.translateService.instant(
        "outsourcingPlanReport.project-name"
      ),
      isShow: true
    },
    { key: 2, value: "Kế hoạch thuê ngoài", isShow: true },
    {
      key: 3,
      value: this.translateService.instant("outsourcingPlanReport.pm"),
      isShow: true
    },
    {
      key: 4,
      value: this.translateService.instant(
        "outsourcingPlanReport.production-unit"
      ),
      isShow: true
    },
    {
      key: 5,
      value: this.translateService.instant("outsourcingPlanReport.am"),
      isShow: true
    },
    {
      key: 6,
      value: this.translateService.instant(
        "outsourcingPlanReport.business-unit"
      ),
      isShow: true
    },
    {
      key: 7,
      value: this.translateService.instant("outsourcingPlanReport.start-time"),
      isShow: true
    },
    {
      key: 8,
      value: this.translateService.instant("outsourcingPlanReport.end-time"),
      isShow: true
    },
    {
      key: 9,
      value: this.translateService.instant(
        "outsourcingPlanReport.outsourcing-type"
      ),
      isShow: true
    },
    {
      key: 10,
      value: this.translateService.instant("outsourcingPlanReport.mmos"),
      isShow: true
    },
    {
      key: 11,
      value: this.translateService.instant(
        "outsourcingPlanReport.human-number"
      ),
      isShow: true,
      col: 5
    },
    {
      key: 12,
      value: this.translateService.instant(
        "outsourcingPlanReport.human-required"
      ),
      isShow: true,
      col: 4
    },
    {
      key: 13,
      value: this.translateService.instant("outsourcingPlanReport.sum"),
      isShow: true
    },
    { key: 14, value: "Số lượng BA", isShow: true },
    { key: 15, value: "Số lượng Dev", isShow: true },
    { key: 16, value: "Số lượng Dev Mobile", isShow: true },
    { key: 17, value: "Số lượng Tester", isShow: true },
    { key: 18, value: "Yêu cầu BA", isShow: true },
    { key: 19, value: "Yêu cầu Dev", isShow: true },
    { key: 20, value: "Yêu cầu Dev Mobile", isShow: true },
    { key: 21, value: "Yêu cầu Tester", isShow: true },
    {
      key: 22,
      value: this.translateService.instant("outsourcingPlanReport.description"),
      isShow: true
    }
  ];

  nonShowColumns: number[] = [11, 12];

  constructor(
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private appParamsService: AppParamsService,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private outsourcingPlanStatisticService: OutsourcingPlanStatisticService,
    private downloadService: DownloadService,
    private commonService: CommonService
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
    this.buidForm();
    this.onResize();
    this.getPlanStatusList();
    this.debounceOnSearch();
    this.search();
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      outsourcedPlan: "",
      startTime: "",
      endTime: "",
      productUnitId: null,
      outsourceType: "",
      businessUnitId: null,
      projectManagementCode: [""]
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
    this.search();
  }

  onExport() {
    const str = " - ";
    this.spinner.show();
    let startDateFrom, endDateFrom, startDateTo, endDateTo;
    if (this.form.value.startTime) {
      if (this.form.value.startTime.indexOf(str) === 10) {
        startDateFrom = this.form.value.startTime.split(" - ")[0];
        endDateFrom = this.form.value.startTime.split(" - ")[1];
      } else {
        startDateFrom = this.form.value.startTime;
      }
    }
    if (this.form.value.endTime) {
      if (this.form.value.endTime.indexOf(str) === 10) {
        startDateTo = this.form.value.endTime.split(" - ")[0];
        endDateTo = this.form.value.endTime.split(" - ")[1];
      } else {
        startDateTo = this.form.value.endTime;
      }
    }

    const data = {
      businessOrgId: this.form.value.businessUnitId
        ? this.form.value.businessUnitId
        : "",
      outsourceType: this.form.value.outsourceType
        ? this.form.value.outsourceType
        : "",
      planCode: this.form.value.outsourcedPlan
        ? this.form.value.outsourcedPlan
        : "",
      productionOrgId: this.form.value.productUnitId
        ? this.form.value.productUnitId
        : "",
      projectCode: this.form.value.projectManagementCode
        ? this.form.value.projectManagementCode
        : "",
      startTimeFrom: startDateFrom ? startDateFrom : "",
      startTimeTo: startDateTo ? startDateTo : "",
      endTimeFrom: endDateFrom ? endDateFrom : "",
      endTimeTo: endDateTo ? endDateTo : "",
      page: this.page - 1,
      size: this.itemsPerPage
    };
    this.outsourcingPlanStatisticService.exportExcel(data).subscribe(
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

  search() {
    const str = " - ";
    this.spinner.show();
    let startDateFrom, endDateFrom, startDateTo, endDateTo;
    if (this.form.value.startTime) {
      if (this.form.value.startTime.indexOf(str) === 10) {
        startDateFrom = this.form.value.startTime.split(" - ")[0];
        endDateFrom = this.form.value.startTime.split(" - ")[1];
      } else {
        startDateFrom = this.form.value.startTime;
      }
    }
    if (this.form.value.endTime) {
      if (this.form.value.endTime.indexOf(str) === 10) {
        startDateTo = this.form.value.endTime.split(" - ")[0];
        endDateTo = this.form.value.endTime.split(" - ")[1];
      } else {
        startDateTo = this.form.value.endTime;
      }
    }

    const data = {
      businessOrgId: this.form.value.businessUnitId
        ? this.form.value.businessUnitId
        : "",
      outsourceType: this.form.value.outsourceType
        ? this.form.value.outsourceType
        : "",
      planCode: this.form.value.outsourcedPlan
        ? this.form.value.outsourcedPlan
        : "",
      productionOrgId: this.form.value.productUnitId
        ? this.form.value.productUnitId
        : "",
      projectCode: this.form.value.projectManagementCode
        ? this.form.value.projectManagementCode
        : "",
      startTimeFrom: startDateFrom ? startDateFrom : "",
      startTimeTo: startDateTo ? startDateTo : "",
      endTimeFrom: endDateFrom ? endDateFrom : "",
      endTimeTo: endDateTo ? endDateTo : "",
      page: this.page - 1,
      size: this.itemsPerPage
    };

    this.outsourcingPlanStatisticService.getAll(data).subscribe(
      res => {
        this.spinner.hide();
        const contentRes = res.body.content;

        if (contentRes.length > 0) {
          contentRes.push({
            isTotal: true,
            strMmOS: contentRes[0]["strTotalMmos"],
            strTotal: contentRes[0]["strTotalOfTotal"],
            strBaNumber: contentRes[0]["strTotalBaNumber"],
            strDevNumber: contentRes[0]["strTotalDevNumber"],
            strTestNumber: contentRes[0]["strTotalTestNumber"],
            strDevMobileNumber: contentRes[0]["strTotalDevMobileNumber"]
          });
        }

        this.outsourcingPlan = contentRes;
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

  getPlanStatusList() {
    const outsourceType = "OUTSOURCE_TYPE";

    this.spinner.show();

    this.appParamsService.getParamByCode(outsourceType).subscribe(
      res => {
        this.spinner.hide();
        this.outsourceTypeList = res.body;
      },
      error => {
        this.spinner.hide();
        this.commonService.openToastMess(
          error.error.code,
          true,
          this.translateService.instant("common.action.search")
        );
      }
    );
  }

  debounceOnSearch() {
    this.debouncer
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.loadDataOnSearchUnit(value));
  }

  onSearchUnit(event, type) {
    type === 1
      ? (this.pUnitSearch = event.term)
      : (this.bUnitSearch = event.term);
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

  loadDataOnSearchUnit(term) {
    let groupCode = "";
    if (this.typeSearchUnit === 1) {
      groupCode = "SX";
    }
    if (this.typeSearchUnit === 2) {
      groupCode = "KD";
    }
    this.outsourcingPlanStatisticService
      .getUnit({
        name: term,
        groupCode: groupCode,
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
            : (this.listBusinessUnit$ = of(
                res.body["data"].sort((a, b) => a.name.localeCompare(b.name))
              ));
        } else {
          this.typeSearchUnit === 1
            ? (this.listProductUnit$ = of([]))
            : (this.listBusinessUnit$ = of([]));
        }
      });
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

  trimSpace(fieldName) {
    this.setValueToField(fieldName, this.getValueOfField(fieldName).trim());
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }

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

    let col1 = 0;
    for (let i = 13; i <= 17; i++) {
      if (this.columns[i].isShow) {
        col1++;
      }
    }
    this.columns[11].col = col1;

    let col2 = 0;
    for (let i = 18; i <= 21; i++) {
      if (this.columns[i].isShow) {
        col2++;
      }
    }
    this.columns[12].col = col2;
  }
}
