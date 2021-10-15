import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HeightService } from "app/shared/services/height.service";
import { NgxSpinnerService } from "ngx-spinner";
import { OutsourcingInfomationReportService } from "app/core/services/report/outsourcing-infomation-report.service";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { Observable, of, Subject } from "rxjs";
import { DownloadService } from "app/shared/services/download.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import { HttpResponse } from "@angular/common/http";

@Component({
  selector: "jhi-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.scss"]
})
export class CustomerComponent implements OnInit {
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
    includeThousandsSeparator: false,
    // allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 15,
    thousandsSeparatorSymbol: ",",
    decimalSymbol: "."
  };
  listUnit1$ = new Observable<any[]>();
  unitSearch1;
  debouncer1: Subject<string> = new Subject<string>();
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

  private buildForm() {
    this.form = this.formBuilder.group({
      partnerName: [""],
      partnerCode: [""],
      regBusinessAddress: [""],
      totalScore: [""]
    });
  }

  setDecimal() {
    this.totalScore.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    this.totalScore.decimalSymbol = this.decimalPointSpace;
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
      totalScore: this.form.value.totalScore ? this.form.value.totalScore : "",
      page: this.page - 1,
      size: this.itemsPerPage
    };

    this.reportService.searchPartner(data).subscribe(
      res => {
        this.spinner.hide();
        this.partnerList = res.body.content;
        this.totalItems = res.body.totalElements;
        this.maxSizePage = res.body.totalPages;
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
      totalScore: this.form.value.totalScore ? this.form.value.totalScore : ""
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
        if (this.unitSearch1) {
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
