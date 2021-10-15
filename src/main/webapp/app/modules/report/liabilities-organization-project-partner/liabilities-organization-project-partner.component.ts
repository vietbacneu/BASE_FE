import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HeightService } from "app/shared/services/height.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { ActivatedRoute } from "@angular/router";
import { HttpResponse } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { LiabilitiesOrganizationProjectPartnerService } from "app/core/services/report/liabilities-organization-project-partner.service";
import { TranslateService } from "@ngx-translate/core";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { CommonApiService } from "app/core/services/common-api/common-api.service";
import { ToastService } from "app/shared/services/toast.service";
import { CommonService } from "app/shared/services/common.service";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { DownloadService } from "app/shared/services/download.service";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { Observable, of, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { OutsourcingPlanStatisticService } from "app/core/services/report/outsourcing-plan-statistic.service";
import { OutsourcingInfomationReportService } from "app/core/services/report/outsourcing-infomation-report.service";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import {
  REGEX_PATTERN,
  REGEX_REPLACE_PATTERN
} from "app/shared/constants/pattern.constants";

@Component({
  selector: "jhi-liabilities-organization-project-partner",
  templateUrl: "./liabilities-organization-project-partner.component.html",
  styleUrls: ["./liabilities-organization-project-partner.component.scss"]
})
export class LiabilitiesOrganizationProjectPartnerComponent implements OnInit {
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
  reportList: any;
  listBusinessUnit$ = new Observable<any[]>();
  bUnitSearch;
  listProductUnit$ = new Observable<any[]>();
  pUnitSearch;
  typeSearchUnit;
  debouncer: Subject<string> = new Subject<string>();
  groupCode;
  ULNL: any;
  contractStatus: any;
  signStatus: any;
  dataList: any;
  totalItem: any;
  notFoundText;

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;

  columns = [
    { key: 0, value: "Số hợp đồng", isShow: true },
    {
      key: 1,
      value: this.translateService.instant(
        "liabilities.outsourcingOrganization"
      ),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant("liabilities.partner"),
      isShow: true
    },
    {
      key: 3,
      value: this.translateService.instant("liabilities.projectCode"),
      isShow: true
    },
    {
      key: 4,
      value: this.translateService.instant("liabilities.expertiseState"),
      isShow: true
    },
    {
      key: 5,
      value: this.translateService.instant("liabilities.ttrPakdNumber"),
      isShow: true
    },
    {
      key: 6,
      value: this.translateService.instant("liabilities.mmUse"),
      isShow: true
    },
    {
      key: 7,
      value: this.translateService.instant("liabilities.mmNotUse"),
      isShow: true
    },
    {
      key: 8,
      value: this.translateService.instant("liabilities.mmPay"),
      isShow: true
    },
    {
      key: 9,
      value: this.translateService.instant("liabilities.mmOwed"),
      isShow: true
    },
    {
      key: 10,
      value: this.translateService.instant("liabilities.signedState"),
      isShow: true
    },
    {
      key: 11,
      value: this.translateService.instant("liabilities.contractState"),
      isShow: true
    }
  ];
  colSpanContractNumber: number;

  constructor(
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private liabilitiesOrganizationProjectPartnerService: LiabilitiesOrganizationProjectPartnerService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private appParamsService: AppParamsService,
    private commonApiService: CommonApiService,
    private commonService: CommonService,
    private downloadService: DownloadService,
    private commonUtils: CommonUtils,
    private outsourcingPlanStatisticService: OutsourcingPlanStatisticService,
    private reportService: OutsourcingInfomationReportService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.colSpanContractNumber = 6;
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
    this.getContractStatus();
    this.getSignStatus();
    this.getUlnl();
    this.debounceOnSearch();
    this.onSearchReport();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      rentName: [""], //Đơn vị thuê ngoài
      projectCode: [""], //Mã dự án
      partnerCode: [""], //Mã đối tác
      manufacturingOrgID: [null], //Đơn vị sản xuất
      businessOrgId: [null], //Đơn vị kinh doanh
      estimateEffortStatus: [""], //Trạng thái thẩm định ULNL
      ttrPakdNum: [""],
      debitMM: [""], // MM còn nợ
      signatureStatus: [""], //Trạng thái ký
      contractStatus: [""] //Trạng thái hđong
    });
  }

  private paginateProjectList(data) {
    this.second = data.totalPages;
    this.totalItems = data.totalElements;
    this.reportList = data.content;
    this.reportList = data.content ? data.content : null;
  }

  getRequestParam() {
    return {
      page: this.page > 0 ? this.page - 1 : 0,
      size: this.itemsPerPage,
      rentName: this.form.get("rentName").value
        ? this.form.get("rentName").value
        : "",
      projectCode: this.form.get("projectCode").value
        ? this.form.get("projectCode").value
        : "",
      partnerCode: this.form.get("partnerCode").value
        ? this.form.get("partnerCode").value
        : "",
      manufacturingOrgID: this.form.get("manufacturingOrgID").value
        ? this.form.get("manufacturingOrgID").value
        : "",
      businessOrgId: this.form.get("businessOrgId").value
        ? this.form.get("businessOrgId").value
        : "",
      estimateEffortStatus: this.form.get("estimateEffortStatus").value
        ? this.form.get("estimateEffortStatus").value
        : "",
      ttrPakdNum: this.form.get("ttrPakdNum").value
        ? this.form.get("ttrPakdNum").value
        : "",
      debitMM: this.form.get("debitMM").value
        ? this.form.get("debitMM").value.replace(",", ".")
        : "",
      signatureStatus: this.form.get("signatureStatus").value
        ? this.form.get("signatureStatus").value
        : "",
      contractStatus: this.form.get("contractStatus").value
        ? this.form.get("contractStatus").value
        : ""
    };
  }

  loadAll() {
    if (+this.form.get("debitMM").value === 0) {
      this.form.get("debitMM").setValue("");
    }
    this.spinner.show();
    this.liabilitiesOrganizationProjectPartnerService
      .getAllReport(this.getRequestParam())
      .subscribe(
        (res: any) => {
          this.spinner.hide();
          this.paginateProjectList(res.body);

          this.dataList = [];
          this.totalItem = {
            actualEffortId: null,
            partnerAndContract: "Tổng",
            isTotal: true,
            isParent: true,
            strTotalUsedMM: "0",
            strTotalNotUsedMM: "0",
            strTotalMMPaid: "0",
            strTotalDebitMM: "0"
          };
          if (this.reportList.length > 0) {
            this.totalItem.strTotalUsedMM = this.reportList[0]["total"][
              "strTotalUsedMM"
            ];
            this.totalItem.strTotalNotUsedMM = this.reportList[0]["total"][
              "strTotalNotUsedMM"
            ];
            this.totalItem.strTotalMMPaid = this.reportList[0]["total"][
              "strTotalMMPaid"
            ];
            this.totalItem.strTotalDebitMM = this.reportList[0]["total"][
              "strTotalDebitMM"
            ];
          }
          this.reportList.forEach((rp: any) => {
            this.dataList.push(rp);
            if (rp["innerData"]) {
              rp.isParent = true;
              rp["innerData"].forEach((inner: any) => {
                this.dataList.push(inner);
              });
              // this.sumValue(rp);
            }
          });
          if (this.dataList.length > 0) {
            this.dataList.push(this.totalItem);
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

  // tinh tong client khong dung
  // sumValue(obj) {
  //   this.totalItem.totalUsedMM = this.totalItem.totalUsedMM + this.NVL(obj.totalUsedMM);
  //   this.totalItem.totalNotUsedMM = this.totalItem.totalNotUsedMM + this.NVL(obj.totalNotUsedMM);
  //   this.totalItem.totalMMPaid = this.totalItem.totalMMPaid + this.NVL(obj.totalMMPaid);
  //   this.totalItem.totalDebitMM = this.totalItem.totalDebitMM + this.NVL(obj.totalDebitMM);
  // }

  NVL(value) {
    return value ? value : 0;
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
    this.liabilitiesOrganizationProjectPartnerService
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

  changePageSize(size) {
    this.itemsPerPage = size;
    this.loadAll();
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

  getUlnl() {
    this.reportService.getSignStatusOrContractStatus("ULNL").subscribe(res => {
      this.ULNL = res;
    });
  }

  getContractStatus() {
    this.reportService.getSignStatusOrContractStatus("TTHD").subscribe(res => {
      this.contractStatus = res;
    });
  }

  getSignStatus() {
    this.reportService.getSignStatusOrContractStatus("TTK").subscribe(res => {
      this.signStatus = res;
    });
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
    let colSpan = 0;
    for (let i = 0; i < 6; i++) {
      if (this.columns[i].isShow) {
        colSpan++;
      }
    }
    this.colSpanContractNumber = colSpan;
  }

  onInputChangeDebitMM(event) {
    const value = event.target.value;
    if (value.toString().includes(",") && event.key === ",") {
      //  không cho phép nhập 2 dấu chấm
      return false;
    } else if (value === "" && event.key === ",") {
      //  không cho phép nhập '.' khi bắt đầu
      return false;
    } else {
      //  không cho phép chữ
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode === 44) {
        return true;
      } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
    }
    if (value.split(",").length > 0 && value.split(",")[1].length >= 2) {
      return false;
    }
    return true;
  }
  deleteZero(event) {
    const value = event.target.value;
    if (Number(value) === 0) {
      event.target.value = value.replace(value, "");
    }
  }
  getValueOfField(item) {
    return this.form.get(item).value;
  }
  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }
  onKeyInput(event, element) {
    const value = this.getValueOfField(element);
    let valueChange = event.target.value;
    if ("debitMM" === element) {
      valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.NUMBER, "");
    }
    if (value !== valueChange) {
      this.setValueToField(element, valueChange);
      return false;
    }
  }
}
