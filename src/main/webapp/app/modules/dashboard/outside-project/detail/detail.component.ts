import { Component, Input, OnInit } from "@angular/core";
import { DataCategoryModel } from "app/modules/system-categories/data-categories/models/DataCategory.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, of, Subject, Subscription } from "rxjs";
import { HeightService } from "app/shared/services/height.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { StatisticsPartnerContractService } from "app/modules/dashboard/outside-project/service/statistics-partner-contract-service";
import { OutsourceUnitModel } from "app/modules/dashboard/outside-project/model/OutsourceUnit.model";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { PartnerCategoryModel } from "app/modules/dashboard/outside-project/model/PartnerCategory.model";
import { DataGridViewModel } from "app/modules/dashboard/outside-project/model/DataGridView.model";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { CommonApiService } from "app/core/services/common-api/common-api.service";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { DataPartnerModel } from "app/modules/dashboard/outside-project/model/DataPartner.model";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import { CommonService } from "app/shared/services/common.service";

@Component({
  selector: "jhi-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"]
})
export class DetailComponent implements OnInit {
  @Input() public selectedData: DataCategoryModel;
  @Input() type;
  form: FormGroup;
  height: number;
  itemsPerPage: any;
  maxSizePage: any;
  routeData: any;
  page: any;
  second: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  dataOutsource: OutsourceUnitModel[];
  partnerCategory: PartnerCategoryModel[];
  searchResponse: any;
  searchData: any;
  paramType = "DL";
  partnerName: string;
  listDataSearch: DataPartnerModel[];
  totalMMUseAccumulatedPartnerCode: number;
  totalMMPayedPartner: number;
  totalMMOwedPartner: number;
  pageIndexSearch: number;

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;

  listOutOrg$ = new Observable<any[]>();
  codeSearchOutOrg;
  notFoundText;
  debouncerOutOrg: Subject<string> = new Subject<string>();

  columns = [
    {
      key: 0,
      value: this.translateService.instant("grid-view.partner"),
      isShow: true
    },
    {
      key: 1,
      value: this.translateService.instant("grid-view.contract-num"),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant("grid-view.partnerCategory"),
      isShow: true
    },
    {
      key: 3,
      value: this.translateService.instant("grid-view.productionUnit"),
      isShow: true
    },
    {
      key: 4,
      value: this.translateService.instant("grid-view.listNameTechnicalClue"),
      isShow: false
    },
    {
      key: 5,
      value: this.translateService.instant(
        "grid-view.listNameBusinessOrganization"
      ),
      isShow: false
    },
    {
      key: 6,
      value: this.translateService.instant("grid-view.listNameBusinessClue"),
      isShow: false
    },
    {
      key: 7,
      value: this.translateService.instant("grid-view.outsourcedUnit"),
      isShow: true
    },
    {
      key: 8,
      value: this.translateService.instant(
        "grid-view.contactPointsForCooperation"
      ),
      isShow: true
    },
    {
      key: 9,
      value: this.translateService.instant("grid-view.totalMMAccumulated"),
      isShow: true
    },
    {
      key: 10,
      value: this.translateService.instant("grid-view.MMPayed"),
      isShow: true
    },
    {
      key: 11,
      value: this.translateService.instant("grid-view.MMOwed"),
      isShow: true
    }
  ];

  MMAccumulated = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 15,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  MMOwed = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 15,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  MMPayed = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 15,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  constructor(
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private statisticsPartnerContractService: StatisticsPartnerContractService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private commonApiService: CommonApiService,
    public commonService: CommonService
  ) {
    this.itemsPerPage = 5;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.page = 1;
  }

  ngOnInit(): void {
    this.searchData = {};
    this.onResize();
    this.buidForm();
    this.setDecimal();
    this.fetchDataOutsourcedUnit();
    this.fetchPartnerCategory();
    this.doSearch(true);
    this.debounceOnSearchOutOrg();
  }

  onResize() {
    this.height = this.heightService.onResizeHeight280Px();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      partnerShortName: ["", Validators.maxLength(255)],
      partnerCategory: [""],
      outsourcedUnit: [null],
      MMOwed: ["", Validators.maxLength(20)],
      MMAccumulated: [""],
      MMPayed: ["", Validators.maxLength(20)]
    });
  }

  setDecimal() {
    this.MMAccumulated = createNumberMask({ ...this.MMAccumulated });
    this.MMOwed = createNumberMask({ ...this.MMOwed });
    this.MMPayed = createNumberMask({ ...this.MMPayed });
  }

  onCloseAddModal() {
    this.activeModal.dismiss();
    this.form.reset();
    this.activeModal.dismiss(true);
    this.debounceOnSearchOutOrg();
  }

  fetchDataOutsourcedUnit() {
    this.spinner.show();
    this.statisticsPartnerContractService.fetchDataOutsourcedUnit().subscribe(
      res => {
        if (res.statusCode === "SUCCESS") {
          this.dataOutsource = res.data;
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastService.openErrorToast(
            this.translateService.instant("common.toastr.messages.error.load")
          );
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

  fetchPartnerCategory() {
    this.spinner.show();
    this.statisticsPartnerContractService.fetchDataPartnerCategory().subscribe(
      res => {
        if (res.statusCode === "SUCCESS") {
          this.partnerCategory = res.data;
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastService.openErrorToast(
            this.translateService.instant("common.toastr.messages.error.load")
          );
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

  doSearch(isShowFirst: any) {
    if (!this.form.valid) return;

    // set show first page
    if (isShowFirst) {
      this.previousPage = 1;
      this.page = 1;
    }
    this.searchData.partnerShortName = this.form.value.partnerShortName;
    this.searchData.partnerCategory = this.form.value.partnerCategory;
    this.searchData.outsourcedUnit = this.form.value.outsourcedUnit;
    this.searchData.totalMMOwed = this.form.get("MMOwed").value.toString()
      ? this.form
          .get("MMOwed")
          .value.toString()
          .replace(/\./g, "")
          .replace(/\,/g, ".")
      : "";

    this.searchData.totalMMUseAccumulated = this.form
      .get("MMAccumulated")
      .value.toString()
      ? this.form
          .get("MMAccumulated")
          .value.toString()
          .replace(/\./g, "")
          .replace(/\,/g, ".")
      : "";

    this.searchData.totalMMPayed = this.form.get("MMPayed").value.toString()
      ? this.form
          .get("MMPayed")
          .value.toString()
          .replace(/\./g, "")
          .replace(/\,/g, ".")
      : "";

    this.searchData.page = this.page;
    this.searchData.limit = this.itemsPerPage;
    this.statisticsPartnerContractService.search(this.searchData).subscribe(
      res => {
        if (res.statusCode === "SUCCESS") {
          this.searchResponse = res.data;
          this.build();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.toastService.openErrorToast(
            this.translateService.instant("common.toastr.messages.error.load")
          );
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

  build() {
    this.totalMMUseAccumulatedPartnerCode = 0;
    this.totalMMPayedPartner = 0;
    this.totalMMOwedPartner = 0;
    this.totalItems = this.searchResponse.data.dataCount;
    this.listDataSearch = this.searchResponse.data.data;
    // if (this.listDataSearch != null) {
    //   this.format(this.listDataSearch);
    // }
    // set gia tri cho truong tong
    const totalMMPartner = this.searchResponse.sumPartnerCode;
    this.totalMMUseAccumulatedPartnerCode =
      totalMMPartner.totalMMAccumulated == null
        ? 0
        : totalMMPartner.totalMMAccumulated;
    this.totalMMPayedPartner =
      totalMMPartner.totalMMPayed == null ? 0 : totalMMPartner.totalMMPayed;
    this.totalMMOwedPartner =
      totalMMPartner.totalMMOwed == null ? 0 : totalMMPartner.totalMMOwed;
  }

  loadPage(page: any) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    const formValue = this.form.value;
    this.doSearch(false);
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.transition();
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
  }

  getOutOrgList(key: String) {
    this.commonApiService.getOutsourceOrganization(key).subscribe(res => {
      this.listOutOrg$ = of(res.body.data);
      if (res.body.data.length === 0) {
        $(".ng-option").css("display", "block");
        this.notFoundText = "common.select.notFoundText";
      }
    });
  }

  /**
   * Outsource Name autocomplete
   * @param event
   */
  onSelectOutOrg(event) {
    this.codeSearchOutOrg = event.term;
    const term = event.term;
    if (term !== "") {
      this.debouncerOutOrg.next(term);
      this.notFoundText = "";
      $(".ng-option").css("display", "none");
    } else {
      this.codeSearchOutOrg = of([]);
      $(".ng-option").css("display", "block");
    }
  }

  onClearOutOrg() {
    this.listOutOrg$ = of([]);
    this.codeSearchOutOrg = "";
  }

  onSearchOutOrgClose() {
    if (!this.form.value.id) {
      this.listOutOrg$ = of([]);
      this.codeSearchOutOrg = "";
    }
  }

  debounceOnSearchOutOrg() {
    this.debouncerOutOrg
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.getOutOrgList(value));
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  get formControl() {
    return this.form.controls;
  }

  customSearchFn(term: string, item: any) {
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
    let partnerName = item.partnerName.toLocaleLowerCase();
    // const partnerShortName = item.partnerShortName.toLocaleLowerCase();

    partnerName = partnerName.replace(
      /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,
      "a"
    );
    partnerName = partnerName.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    partnerName = partnerName.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    partnerName = partnerName.replace(
      /ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,
      "o"
    );
    partnerName = partnerName.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    partnerName = partnerName.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    partnerName = partnerName.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    partnerName = partnerName.replace(
      /\u0300|\u0301|\u0303|\u0309|\u0323/g,
      ""
    ); // Huyền sắc hỏi ngã nặng
    partnerName = partnerName.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return (
      partnerCode.indexOf(term) > -1 ||
      partnerName.indexOf(term) > -1 ||
      // partnerShortName.indexOf(term) > -1 ||
      (partnerCode + " - " + partnerName).includes(term)
    );
  }

  /**
   * HungND 19/08/2020
   */
  ignoreRezo(controlName: string) {
    if (this.form.get(controlName).value === 0)
      this.form.get(controlName).setValue("");
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

  deleteZero(event) {
    const value = event.target.value;
    if (Number(value) === 0) {
      event.target.value = value.replace(value, "");
    }
  }

  format(listDataSearch: DataPartnerModel[]) {
    for (let index = 0; index < listDataSearch.length; index++) {
      const data = listDataSearch[index];
      if (data.totalMMUseAccumulated != null) {
        data.totalMMUseAccumulated = data.totalMMUseAccumulated
          .toString()
          .replace(".", ",");
      }
      if (data.totalMMPayed != null) {
        data.totalMMPayed = data.totalMMPayed.toString().replace(".", ",");
      }
      if (data.totalMMOwed != null) {
        data.totalMMOwed = data.totalMMOwed.toString().replace(".", ",");
      }
    }
  }
}
