import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Observable, of, Subject } from "rxjs";
import { HeightService } from "app/shared/services/height.service";
import { NgxSpinnerService } from "ngx-spinner";
import { OutsourcingInfomationReportService } from "app/core/services/report/outsourcing-infomation-report.service";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { DownloadService } from "app/shared/services/download.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { HttpResponse } from "@angular/common/http";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { INVOICE_DRAFT } from "app/shared/constants/invoice-draft.constants";

@Component({
  selector: "jhi-partner-outside",
  templateUrl: "./partner-outside.component.html",
  styleUrls: ["./partner-outside.component.scss"]
})
export class PartnerOutsideComponent implements OnInit {
  height: number;
  form: FormGroup;
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  maxSizePage = 10;
  previousPage: any;
  partnerList = [];
  debouncer: Subject<string> = new Subject<string>();
  debouncerUser: Subject<string> = new Subject<string>();
  decimalPointSignSeparate;
  decimalPointSpace;
  totalScore = {
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
  currencyMasksNumber = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 9,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: INVOICE_DRAFT.MAX_LENGTH_MONEY,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };
  listUnit1$ = new Observable<any[]>();
  unitSearch1;
  notFoundText;
  debouncer1: Subject<string> = new Subject<string>();

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;

  columns = [
    { key: 0, value: "Mã đối tác", isShow: true },
    { key: 1, value: "Tên đối tác", isShow: true },
    { key: 2, value: "Ngành nghề đăng kí kinh doanh", isShow: true },
    { key: 3, value: "Điểm năng lực", isShow: true },
    { key: 4, value: "Thời điểm hợp tác", isShow: true },
    { key: 5, value: "Hợp đồng đã tham gia", isShow: true },
    { key: 6, value: "Giá trị của hợp đồng tương ứng", isShow: true },
    { key: 7, value: "Các dự án đã tham gia", isShow: true },
    { key: 8, value: "Số MM đã thẩm định", isShow: true },
    { key: 9, value: "MM còn lại", isShow: true }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private heightService: HeightService,
    private spinner: NgxSpinnerService,
    private reportService: OutsourcingInfomationReportService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private downloadService: DownloadService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.maxSizePage = MAX_SIZE_PAGE;
  }

  ngOnInit() {
    this.onResize();
    this.buildForm();
    this.setDecimal();
    this.debounceOnSearch1();
    this.search(true);
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      partnerName: [""],
      partnerCode: [""],
      regBusinessAddress: [null],
      totalScore: [""]
    });
  }

  setDecimal() {
    // this.totalScore.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.totalScore.decimalSymbol = this.decimalPointSpace;
    this.currencyMasksNumber = createNumberMask({
      ...this.currencyMasksNumber
    });
    this.totalScore = createNumberMask({ ...this.totalScore });
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
    if ([null, undefined].indexOf(document.getElementById("partnerCode")) < 0) {
      document.getElementById("partnerCode")["value"] = this.form.get(
        "partnerCode"
      ).value
        ? this.form.get("partnerCode").value.trim()
        : "";
      document.getElementById("partnerName")["value"] = this.form.get(
        "partnerName"
      ).value
        ? this.form.get("partnerName").value.trim()
        : "";
    }
    if (isShowFirst) {
      this.previousPage = 1;
      this.page = 1;
    }
    const data = {
      partnerName: this.form.value.partnerName
        ? this.form.value.partnerName
        : "",
      partnerCode: this.form.value.partnerCode
        ? this.form.value.partnerCode
        : "",
      regBusinessAddress: this.form.value.regBusinessAddress
        ? this.form.value.regBusinessAddress
        : "",
      totalScore: this.form.value.totalScore
        ? this.form.value.totalScore.replace(",", ".")
        : "",
      page: this.page - 1,
      size: this.itemsPerPage
    };

    this.reportService.searchPartner(data).subscribe(
      res => {
        this.spinner.hide();
        this.partnerList = res.body.content;
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

  transition() {
    this.search(false);
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

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.transition();
  }

  onExport() {
    this.spinner.show();
    const data = {
      partnerName: this.form.value.partnerName
        ? this.form.value.partnerName
        : "",
      partnerCode: this.form.value.partnerCode
        ? this.form.value.partnerCode
        : "",
      regBusinessAddress: this.form.value.regBusinessAddress
        ? this.form.value.regBusinessAddress
        : "",
      totalScore: this.form.value.totalScore
        ? this.form.value.totalScore.replace(",", ".")
        : ""
    };
    this.reportService.exportExcelPartner(data).subscribe(
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

  onSearchUnit1(event) {
    this.unitSearch1 = event.term;
    const term = event.term;
    if (term !== "") {
      this.debouncer1.next(term);
      this.notFoundText = "";
      $(".ng-option").css("display", "none");
    } else {
      this.listUnit1$ = of([]);
    }
  }
  debounceOnSearch1() {
    this.debouncer1
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.loadDataOnSearchUnit1(value));
  }
  loadDataOnSearchUnit1(term) {
    this.reportService
      .getDataAutoConplete(term)
      .subscribe((res: HttpResponse<any[]>) => {
        if (res) {
          if (res["content"].length === 0) {
            this.notFoundText = "common.select.notFoundText";
            $(".ng-option").css("display", "block");
          }
          this.listUnit1$ = of(
            res["content"].sort((a, b) => a.name.localeCompare(b.name))
          );
        } else {
          this.listUnit1$ = of([]);
        }
      });
  }
  onClearUnit1() {
    this.listUnit1$ = of([]);
    this.unitSearch1 = "";
  }

  onSearchUnitClose1() {
    if (!this.form.value.parentName) {
      this.listUnit1$ = of([]);
      this.unitSearch1 = "";
    }
  }
}
