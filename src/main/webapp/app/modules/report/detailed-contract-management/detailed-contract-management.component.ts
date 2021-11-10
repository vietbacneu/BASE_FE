import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HeightService } from "app/shared/services/height.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "app/shared/services/common.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { DetailedContractManagementService } from "app/core/services/report/detailed-contract-management.service";
import { DownloadService } from "app/shared/services/download.service";
import { Observable, of, Subject } from "rxjs";
import { OutsourcingPlanStatisticService } from "app/core/services/report/outsourcing-plan-statistic.service";
import { HttpResponse } from "@angular/common/http";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";

@Component({
  selector: "jhi-detailed-contract-management",
  templateUrl: "./detailed-contract-management.component.html",
  styleUrls: ["./detailed-contract-management.component.scss"]
})
export class DetailedContractManagementComponent implements OnInit {
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
  listDetail;
  years: number[] = [];
  yy: number;
  debouncer: Subject<string> = new Subject<string>();
  notFoundText;
  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;
  groupCode;

  columns = [
    { key: 0, value: "Số hợp đồng", isShow: true },
    {
      key: 1,
      value: this.translateService.instant(
        "detailedContractManagement.project-code"
      ),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant(
        "detailedContractManagement.partner-code"
      ),
      isShow: true
    },
    {
      key: 3,
      value: this.translateService.instant(
        "detailedContractManagement.plan-project-outsource-code"
      ),
      isShow: true
    },
    { key: 4, value: "Tên dự án", isShow: true },
    { key: 5, value: "Năm hợp tác", isShow: true },
    {
      key: 6,
      value: this.translateService.instant(
        "detailedContractManagement.production-unit"
      ),
      isShow: true
    },
    {
      key: 7,
      value: this.translateService.instant(
        "detailedContractManagement.production-focal"
      ),
      isShow: true
    },
    {
      key: 8,
      value: this.translateService.instant(
        "detailedContractManagement.business-unit"
      ),
      isShow: true
    },
    {
      key: 9,
      value: this.translateService.instant(
        "detailedContractManagement.contact-point-propose-cooperation"
      ),
      isShow: true
    },
    {
      key: 10,
      value: this.translateService.instant(
        "detailedContractManagement.outsource-unit"
      ),
      isShow: true
    },
    {
      key: 11,
      value: this.translateService.instant(
        "detailedContractManagement.sumMMApproved"
      ),
      isShow: true
    },
    {
      key: 12,
      value: this.translateService.instant("detailedContractManagement.MMRest"),
      isShow: true
    },
    {
      key: 13,
      value: this.translateService.instant(
        "detailedContractManagement.MM-practical-use"
      ),
      isShow: true
    }
  ];

  constructor(
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private detailedContractManagementService: DetailedContractManagementService,
    private outsourcingPlanStatisticService: OutsourcingPlanStatisticService,
    private downloadService: DownloadService,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
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
    this.search(false);
    this.debounceOnSearch();
    this.getYear();
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      businessOrgId: [null],
      cooperationYear: [""],
      outsourcingOrgName: [""],
      partnerCode: [""],
      planCode: [""],
      productionOrgId: [null],
      projectCode: [""]
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
    const formValue = this.form.value;
    this.search(false);
  }

  onExport() {
    this.spinner.show();
    const data = {
      page: this.page - 1,
      size: this.itemsPerPage,
      businessOrgId: this.form.get("businessOrgId").value
        ? this.form.get("businessOrgId").value
        : "",
      cooperationYear: this.form.get("cooperationYear").value
        ? this.form.get("cooperationYear").value
        : "",
      outsourcingOrgName: this.form.get("outsourcingOrgName").value
        ? this.form.get("outsourcingOrgName").value
        : "",
      partnerCode: this.form.get("partnerCode").value
        ? this.form.get("partnerCode").value
        : "",
      planCode: this.form.get("planCode").value
        ? this.form.get("planCode").value
        : "",
      productionOrgId: this.form.get("productionOrgId").value
        ? this.form.get("productionOrgId").value
        : "",
      projectCode: this.form.get("projectCode").value
        ? this.form.get("projectCode").value
        : ""
    };
    this.detailedContractManagementService.exportExcel(data).subscribe(
      res => {
        this.spinner.hide();
        if (res) {
          this.downloadService.downloadFile(res);
        }
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

  search(isShowFirst: boolean) {
    this.spinner.show();
    // set show first page
    if (isShowFirst) {
      this.previousPage = 1;
      this.page = 1;
    }
    const data = {
      page: this.page - 1,
      size: this.itemsPerPage,
      businessOrgId: this.form.get("businessOrgId").value
        ? this.form.get("businessOrgId").value
        : "",
      cooperationYear: this.form.get("cooperationYear").value
        ? this.form.get("cooperationYear").value
        : "",
      outsourcingOrgName: this.form.get("outsourcingOrgName").value
        ? this.form.get("outsourcingOrgName").value
        : "",
      partnerCode: this.form.get("partnerCode").value
        ? this.form.get("partnerCode").value
        : "",
      planCode: this.form.get("planCode").value
        ? this.form.get("planCode").value
        : "",
      productionOrgId: this.form.get("productionOrgId").value
        ? this.form.get("productionOrgId").value
        : "",
      projectCode: this.form.get("projectCode").value
        ? this.form.get("projectCode").value
        : ""
    };

    this.detailedContractManagementService.getAll(data).subscribe(
      res => {
        this.spinner.hide();
        const contentRes = res.body.content;
        if (contentRes.length > 0) {
          contentRes.push({
            isSum: true,
            actualEffortId: 0,
            projectCode: "Tổng",
            strTotalAppraisedMM:
              contentRes[0]["totalData"]["strTotalAppraisedMM"],
            strTotalUsedMM: contentRes[0]["totalData"]["strTotalUsedMM"],
            strTotalRemainMM: contentRes[0]["totalData"]["strTotalRemainMM"]
          });
        }
        this.listDetail = contentRes;
        this.totalItems = res.body.totalElements;
        //this.maxSizePage = res.body.totalPages;
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

  toggleColumns(col) {
    col.isShow = !col.isShow;
  }

  // debounceOnSearch() {
  //   this.debouncer.pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH)).subscribe(value => this.loadDataOnSearchUnit(value));
  // }

  // onSearchUnit(event, type) {
  //   type === 1 ? (this.pUnitSearch = event.term) : (this.bUnitSearch = event.term);
  //   const term = event.term;
  //   this.typeSearchUnit = type;
  //   if (term !== '') {
  //     this.debouncer.next(term);
  //   } else {
  //     type === 1 ? (this.listProductUnit$ = of([])) : (this.listBusinessUnit$ = of([]));
  //   }
  // }

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

  // loadDataOnSearchUnit(term) {
  //   this.outsourcingPlanStatisticService
  //     .getUnit({
  //       name: term,
  //       pageSize: ITEMS_PER_PAGE,
  //       page: 0
  //     })
  //     .subscribe((res: HttpResponse<any[]>) => {
  //       if (res) {
  //         this.typeSearchUnit === 1
  //           ? (this.listProductUnit$ = of(res.body['data'].sort((a, b) => a.name.localeCompare(b.name))))
  //           : (this.listBusinessUnit$ = of(res.body['data'].sort((a, b) => a.name.localeCompare(b.name))));
  //       } else {
  //         this.typeSearchUnit === 1 ? (this.listProductUnit$ = of([])) : (this.listBusinessUnit$ = of([]));
  //       }
  //     });
  // }

  // onClearUnit(type: number) {
  //   switch (type) {
  //     case 1: {
  //       this.listProductUnit$ = of([]);
  //       this.pUnitSearch = '';
  //       break;
  //     }
  //     case 2: {
  //       this.listBusinessUnit$ = of([]);
  //       this.bUnitSearch = '';
  //       break;
  //     }
  //   }
  // }

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

  // onSearchUnitClose(type) {
  //   if (!this.form.value.businessUnitId && type === 2) {
  //     this.listBusinessUnit$ = of([]);
  //     this.bUnitSearch = '';
  //   }
  //   if (!this.form.value.productUnitId && type === 1) {
  //     this.listProductUnit$ = of([]);
  //     this.pUnitSearch = '';
  //   }
  // }

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

  getYear() {
    const todays = new Date();
    this.yy = todays.getFullYear();
    for (let i = this.yy; i >= 1970; i--) {
      this.years.push(i);
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
}
