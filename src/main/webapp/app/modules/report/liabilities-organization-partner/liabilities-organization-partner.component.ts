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
import { LiabilitiesOrganizationPartnerService } from "app/core/services/report/liabilities-organization-partner.service";
import { DownloadService } from "app/shared/services/download.service";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";

@Component({
  selector: "jhi-liabilities-organization-partner",
  templateUrl: "./liabilities-organization-partner.component.html",
  styleUrls: ["./liabilities-organization-partner.component.scss"]
})
export class LiabilitiesOrganizationPartnerComponent implements OnInit {
  height: number;
  form: FormGroup;
  itemsPerPage: any;
  maxSizePage: any;
  routeData: any;
  page: any;
  pageSize: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  listLiabilities: any;
  sum = { mmused: 0, mmpayed: 0, mmremain: 0 };
  // tunglm-iist start
  columns = [
    { key: 0, value: "Đối tác", isShow: true },
    {
      key: 1,
      value: this.translateService.instant(
        "liabilitiesOrganizationPartner.outsourcing-unit"
      ),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant(
        "liabilitiesOrganizationPartner.man-months-use"
      ),
      isShow: true
    },
    {
      key: 3,
      value: this.translateService.instant(
        "liabilitiesOrganizationPartner.man-months-pay"
      ),
      isShow: true
    },
    {
      key: 4,
      value: this.translateService.instant(
        "liabilitiesOrganizationPartner.man-months-owe"
      ),
      isShow: true
    },
    {
      key: 5,
      value: this.translateService.instant(
        "liabilitiesOrganizationPartner.note"
      ),
      isShow: true
    }
  ];
  nonShowColumns: number[] = [11, 12];
  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;
  // tunglm-iist end
  constructor(
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private liabilitiesOrganizationPartnerService: LiabilitiesOrganizationPartnerService,
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
      }
    });
  }

  ngOnInit() {
    this.buidForm();
    this.onResize();
    this.search(false);
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      partnerName: [""],
      partner: [""]
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
    this.search(true);
  }
  // tunglm-iist start
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
  }
  // tunglm-iist end
  onExport() {
    this.spinner.show();
    const data = {
      partnerShortName: this.form.value.partner,
      partnerName: this.form.value.partnerName,
      page: this.page - 1,
      limit: this.itemsPerPage
    };
    this.liabilitiesOrganizationPartnerService.exportExcel(data).subscribe(
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

  // tunglm
  private paginateProjectList(data) {
    if (data.content.length > 0) {
      data.content.push({
        isSum: true,
        partnerName: "Tổng",
        unitId: null,
        strTotalUsedMM: data.content[0]["sumData"]["strTotalUsedMM"],
        strMmPayed: data.content[0]["sumData"]["strMmPayed"],
        strMmOwed: data.content[0]["sumData"]["strMmOwed"]
      });
    }
    this.listLiabilities = data.content;
  }

  search(isShowFirst: boolean) {
    this.spinner.show();
    const data = {
      partnerShortName: this.form.value.partner,
      partnerName: this.form.value.partnerName,
      page: this.page - 1,
      // limit: this.itemsPerPage
      size: this.itemsPerPage
    };

    this.liabilitiesOrganizationPartnerService.getAll(data).subscribe(
      res => {
        this.spinner.hide();
        this.paginateProjectList(res.body);
        // this.listLiabilities = res.body.content;
        this.totalItems = res.body.totalElements;
        this.pageSize = res.body.pageSize;
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
