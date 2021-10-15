import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HeightService } from "app/shared/services/height.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "app/shared/services/common.service";
import { TranslateService } from "@ngx-translate/core";
import { LiabilitiesPartnerService } from "app/core/services/report/liabilities-partner.service";
import { LiabilitiesPartnerModel } from "app/core/models/liabilityPartnerReport.model";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { ToastService } from "app/shared/services/toast.service";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { DownloadService } from "app/shared/services/download.service";
import { NOT_SIGN, SIGNED } from "app/shared/constants/param.constants";

@Component({
  selector: "jhi-liabilities-partner",
  templateUrl: "./liabilities-partner.component.html",
  styleUrls: ["./liabilities-partner.component.scss"]
})
export class LiabilitiesPartnerComponent implements OnInit {
  form: FormGroup;
  height: number;
  itemsPerPage: any;
  page: any;
  pageSize: any;
  routeData: any;
  maxSizePage: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;

  signCode = "TTK";
  statusSign: any;

  partnerList: LiabilitiesPartnerModel[] = [];

  currentStatusSign: any;

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;
  columns = [
    {
      key: 0,
      value: this.translateService.instant("reportLiabilitiesPartner.partner"),
      isShow: true
    },
    {
      key: 1,
      value: this.translateService.instant("reportLiabilitiesPartner.mmUser"),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant("reportLiabilitiesPartner.mmPay"),
      isShow: true
    },
    {
      key: 3,
      value: this.translateService.instant("reportLiabilitiesPartner.mmOwed"),
      isShow: true
    },
    {
      key: 4,
      value: this.translateService.instant("reportLiabilitiesPartner.note"),
      isShow: true
    }
  ];

  totalSigned: any;
  totalNotSign: any;
  sum = { mmused: 0, mmpayed: 0, mmremain: 0 };

  constructor(
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private appParamsService: AppParamsService,
    private commonService: CommonService,
    private translateService: TranslateService,
    private router: Router,
    private liabilitiesPartnerService: LiabilitiesPartnerService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private commonUtils: CommonUtils,
    private downloadService: DownloadService
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
    this.onSearch(false);
  }

  private buildFrom() {
    this.form = this.formBuilder.group({
      partner: [""],
      contractStatus: [""],
      startDate: [""],
      endDate: [""]
    });
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
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

    this.onSearch(false);
  }

  getStatusSign() {
    this.spinner.show();
    this.appParamsService.getParamByCode(this.signCode).subscribe(res => {
      this.spinner.hide();
      this.statusSign = res.body;
    });
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
  }

  onSearch(isShowFirst: boolean) {
    this.spinner.show();

    // trim space
    this.form.get("partner").setValue(this.form.get("partner").value.trim());

    // set show first page
    if (isShowFirst) {
      this.previousPage = 1;
      this.page = 1;
    }

    // prepare date
    let startTimeFromWrap = "";
    let startTimeToWrap = "";
    let endTimeFromWrap = "";
    let endTimeToWrap = "";
    if (this.form.value.startDate && this.form.value.startDate !== "") {
      startTimeFromWrap = this.form.value.startDate.slice(0, 10);
      startTimeToWrap = this.form.value.startDate.slice(13, 23);
    }
    if (this.form.value.endDate && this.form.value.endDate !== "") {
      endTimeFromWrap = this.form.value.endDate.slice(0, 10);
      endTimeToWrap = this.form.value.endDate.slice(13, 23);
    }

    const data = {
      partnerShortName: this.form.value.partner,
      contractStatus: this.form.value.contractStatus,
      startTimeFrom: startTimeFromWrap,
      startTimeTo: startTimeToWrap,
      endTimeFrom: endTimeFromWrap,
      endTimeTo: endTimeToWrap,

      page: this.page - 1,
      size: this.itemsPerPage
    };

    this.liabilitiesPartnerService.getAll(data).subscribe(
      res => {
        this.liabilitiesPartnerService.getTotalMM(data, NOT_SIGN).subscribe(
          res1 => {
            this.totalNotSign = res1.body;
            this.liabilitiesPartnerService.getTotalMM(data, SIGNED).subscribe(
              res2 => {
                this.totalSigned = res2.body;
                this.currentStatusSign = this.form.value.contractStatus;
                this.spinner.hide();
                let stt = this.itemsPerPage * (this.page - 1) + 1;
                const notSignText = {
                  id: null,
                  endTimeFrom: "",
                  endTimeTo: "",
                  note: "",
                  signatureStatus: 0,
                  signatureStatusCode: "",
                  signatureStatusName: "",
                  startTimeFrom: "",
                  startTimeTo: "",
                  totalMMPayed: this.totalNotSign.totalMMPayed,
                  totalMMRemain: this.totalNotSign.totalMMRemain,
                  totalUsedMM: this.totalNotSign.totalUsedMM,

                  strTotalMMPayed: this.totalNotSign.strTotalMMPayed,
                  strTotalMMRemain: this.totalNotSign.strTotalMMRemain,
                  strTotalUsedMM: this.totalNotSign.strTotalUsedMM,
                  partnerShortName: "Chưa ký"
                };
                const signedText = {
                  id: null,
                  endTimeFrom: "",
                  endTimeTo: "",
                  note: "",
                  signatureStatus: 0,
                  signatureStatusCode: "",
                  signatureStatusName: "",
                  startTimeFrom: "",
                  startTimeTo: "",
                  totalMMPayed: this.totalSigned.totalMMPayed,
                  totalMMRemain: this.totalSigned.totalMMRemain,
                  totalUsedMM: this.totalSigned.totalUsedMM,

                  strTotalMMPayed: this.totalSigned.strTotalMMPayed,
                  strTotalMMRemain: this.totalSigned.strTotalMMRemain,
                  strTotalUsedMM: this.totalSigned.strTotalUsedMM,
                  partnerShortName: "Đã ký"
                };
                // reset list
                this.partnerList = [];

                if (this.form.value.contractStatus === "") {
                  let isHasDK = true;
                  let isHasCK = true;
                  let index = 0;
                  if (res.body.content && res.body.content.length > 0) {
                    res.body.content.forEach(c => {
                      c.stt = stt++;
                      if (c.signatureStatusCode === NOT_SIGN && isHasCK) {
                        this.partnerList.unshift(notSignText);
                        isHasCK = false;
                      } else if (c.signatureStatusCode === SIGNED && isHasDK) {
                        this.partnerList.splice(index + 1, 0, signedText);
                        isHasDK = false;
                      }
                      this.partnerList.push(c);
                      index++;
                    });
                  }
                } else if (this.form.value.contractStatus === NOT_SIGN) {
                  res.body.content.forEach(c => {
                    c.stt = stt++;
                  });
                  this.partnerList = res.body.content;
                  this.partnerList.unshift(notSignText);
                } else if (this.form.value.contractStatus === SIGNED) {
                  res.body.content.forEach(c => {
                    c.stt = stt++;
                  });
                  this.partnerList = res.body.content;
                  this.partnerList.unshift(signedText);
                }

                if (this.totalNotSign === undefined) this.totalNotSign = 0;
                if (this.totalSigned === undefined) this.totalSigned = 0;

                this.totalItems = res.body.totalElements;
                this.pageSize = res.body.size;

                this.liabilitiesPartnerService.getTotalMM(data, null).subscribe(
                  res3 => {
                    // Sum all
                    this.sum.mmused = res3.body.strTotalUsedMM;
                    this.sum.mmpayed = res3.body.strTotalMMPayed;
                    this.sum.mmremain = res3.body.strTotalMMRemain;
                  },
                  error => {
                    this.toastService.openErrorToast(
                      res.body.message,
                      this.translateService.instant("common.toastr.title.error")
                    );
                  }
                );
              },
              error => {
                this.toastService.openErrorToast(
                  res.body.message,
                  this.translateService.instant("common.toastr.title.error")
                );
              }
            );
          },
          error => {
            this.toastService.openErrorToast(
              res.body.message,
              this.translateService.instant("common.toastr.title.error")
            );
          }
        );
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  onExport() {
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }
    this.spinner.show();

    // prepare date
    let startTimeFromWrap = "";
    let startTimeToWrap = "";
    let endTimeFromWrap = "";
    let endTimeToWrap = "";
    if (this.form.value.startDate && this.form.value.startDate !== "") {
      startTimeFromWrap = this.form.value.startDate.slice(0, 10);
      startTimeToWrap = this.form.value.startDate.slice(13, 23);
    }
    if (this.form.value.endDate && this.form.value.endDate !== "") {
      endTimeFromWrap = this.form.value.startDate.slice(0, 10);
      endTimeToWrap = this.form.value.startDate.slice(13, 23);
    }

    const data = {
      partnerShortName: this.form.value.partner,
      contractStatus: this.form.value.contractStatus,
      startTimeFrom: startTimeFromWrap,
      startTimeTo: startTimeToWrap,
      endTimeFrom: endTimeFromWrap,
      endTimeTo: endTimeToWrap
    };

    this.liabilitiesPartnerService.exportExcel(data).subscribe(
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
}
