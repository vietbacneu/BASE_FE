import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ProfileAppraisalService } from "app/core/services/profile-appraisal/profile-appraisal.service";
import { OutsourcingInfomationReportService } from "app/core/services/report/outsourcing-infomation-report.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { HeightService } from "app/shared/services/height.service";
import { DownloadService } from "app/shared/services/download.service";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import { REGEX_REPLACE_PATTERN } from "app/shared/constants/pattern.constants";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";

@Component({
  selector: "jhi-partner-contract",
  templateUrl: "./partner-contract.component.html",
  styleUrls: ["./partner-contract.component.scss"]
})
export class PartnerContractComponent implements OnInit {
  height: number;
  form: FormGroup;
  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  maxSizePage = 10;
  previousPage: any;

  contractList;
  contractStatus: any;
  ULNL: any;
  decimalPointSignSeparate;
  decimalPointSpace;
  buttonDisable;
  message;

  contractValue = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 20,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;

  columns = [
    { key: 0, value: "Số hợp đồng", isShow: true },
    { key: 1, value: "Mã đối tác", isShow: true },
    { key: 2, value: "Mã dự án", isShow: true },
    { key: 3, value: "Số TTr PAKD", isShow: true },
    { key: 4, value: "Thời gian bắt đầu", isShow: true },
    { key: 5, value: "Thời gian kết thúc", isShow: true },
    { key: 6, value: "Trạng thái hợp đồng", isShow: true },
    { key: 7, value: "Trạng thái thẩm định ULNL", isShow: true },
    { key: 8, value: "Giá trị hợp đồng", isShow: true },
    { key: 9, value: "Sô tiền còn nợ", isShow: true },
    { key: 10, value: "Tổng MM đã thẩm định", isShow: true }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private profileAppraisalService: ProfileAppraisalService,
    private reportService: OutsourcingInfomationReportService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private heightService: HeightService,
    private downloadService: DownloadService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.maxSizePage = MAX_SIZE_PAGE;
  }

  ngOnInit() {
    this.onResize();
    this.buildForm();
    this.getContractStatus();
    this.getUlnl();
    this.setDecimal();
    this.search(true);
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      projectCode: [""],
      partnerCode: [""],
      estimateEffortStatus: [""],
      contractStatus: [""],
      contractNum: [""],
      ttrPakdNum: [""],
      contractValue: [""],
      startTime: [""],
      endTime: [""]
    });
  }

  setDecimal() {
    // this.contractValue.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.contractValue.decimalSymbol = this.decimalPointSpace;
    this.contractValue = createNumberMask({ ...this.contractValue });
  }

  getDate(value) {
    return new Date(value).getTime();
  }

  checkDate() {
    this.message = "";
    const value = this.form.value;
    const endDate = value.startTime;
    const createdDate = value.endTime;
    if (endDate !== "" && createdDate !== "") {
      if (this.getDate(value.startTime) - this.getDate(value.endTime) > 0) {
        this.message = "Thời gian bắt đầu đang lớn hơn thời gian kết thúc";
        this.buttonDisable = true;
        return 1;
      } else {
        this.message = "";
        this.buttonDisable = false;
      }
    }
  }

  getContractStatus() {
    this.reportService
      .getSignStatusOrContractStatus("TTHD")
      .subscribe(res => (this.contractStatus = res));
  }

  getUlnl() {
    this.reportService
      .getSignStatusOrContractStatus("ULNL")
      .subscribe(res => (this.ULNL = res));
  }

  onKeyInput(event, element) {
    const value = this.getValueOfField(element);
    let valueChange = event.target.value;
    valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.NUMBER, "");
    if (value !== valueChange) {
      this.setValueToField(element, valueChange);
      return false;
    }
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
      document.getElementById("partnerCode")["value"] = this.form.get(
        "partnerCode"
      ).value
        ? this.form.get("partnerCode").value.trim()
        : "";
      document.getElementById("ttrPakdNum")["value"] = this.form.get(
        "ttrPakdNum"
      ).value
        ? this.form.get("ttrPakdNum").value.trim()
        : "";
      document.getElementById("contractNum")["value"] = this.form.get(
        "contractNum"
      ).value
        ? this.form.get("contractNum").value.trim()
        : "";
    }
    if (isShowFirst) {
      this.previousPage = 1;
      this.page = 1;
    }
    const data = {
      projectCode: this.form.value.projectCode
        ? this.form.value.projectCode
        : "",
      partnerCode: this.form.value.partnerCode
        ? this.form.value.partnerCode
        : "",
      estimateEffortStatus: this.form.value.estimateEffortStatus
        ? this.form.value.estimateEffortStatus
        : "",
      contractStatus: this.form.value.contractStatus
        ? this.form.value.contractStatus
        : "",
      contractNum: this.form.value.contractNum
        ? this.form.value.contractNum
        : "",
      ttrPakdNum: this.form.value.ttrPakdNum ? this.form.value.ttrPakdNum : "",
      // contractValue: this.form.value.contractValue ? this.form.value.contractValue.replace(',', '.') : '',
      contractValue: this.form.value.contractValue,
      startTime: this.form.value.startTime ? this.form.value.startTime : "",
      endTime: this.form.value.endTime ? this.form.value.endTime : "",
      page: this.page - 1,
      size: this.itemsPerPage
    };

    this.reportService.searchContract(data).subscribe(
      res => {
        this.spinner.hide();
        this.contractList = res.body.content;
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

  transition() {
    this.search(false);
  }

  convertDate(str) {
    const date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  onExport() {
    this.spinner.show();
    const data = {
      projectCode: this.form.value.projectCode
        ? this.form.value.projectCode
        : "",
      partnerCode: this.form.value.partnerCode
        ? this.form.value.partnerCode
        : "",
      estimateEffortStatus: this.form.value.estimateEffortStatus
        ? this.form.value.estimateEffortStatus
        : "",
      contractStatus: this.form.value.contractStatus
        ? this.form.value.contractStatus
        : "",
      contractNum: this.form.value.contractNum
        ? this.form.value.contractNum
        : "",
      ttrPakdNum: this.form.value.ttrPakdNum ? this.form.value.ttrPakdNum : "",
      contractValue: this.form.value.contractValue
        ? this.form.value.contractValue.replace(",", ".")
        : "",
      startTime: this.form.value.startTime ? this.form.value.startTime : "",
      endTime: this.form.value.endTime ? this.form.value.endTime : ""
    };
    this.reportService.exportExcelContract(data).subscribe(
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
