import { Component, Input, OnInit } from "@angular/core";
import { ProjectManagementModel } from "app/core/models/project-management/project-management.model";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { HeightService } from "app/shared/services/height.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MAX_SIZE_PAGE } from "app/shared/constants/pagination.constants";
import { TranslateService } from "@ngx-translate/core";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonApiService } from "app/core/services/common-api/common-api.service";
import { Observable, of, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { LiabilitiesOutPartnerService } from "app/core/services/dashboard/liabilities-out- partner.service";
import { CommonService } from "app/shared/services/common.service";
import { createNumberMask } from "text-mask-addons/dist/textMaskAddons";

@Component({
  selector: "jhi-liabilities-partner-popup",
  templateUrl: "./liabilities-partner-popup.component.html",
  styleUrls: ["./liabilities-partner-popup.component.scss"]
})
export class LiabilitiesPartnerPopupComponent implements OnInit {
  @Input() public selectedData: ProjectManagementModel;
  /**
   * show == 'column' => show theo biểu đồ cột (các MM)
   * show == 'circle' => show theo biểu đồ tròn (số tiền còn nợ)
   */
  @Input() public show: boolean;

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
  formValue: any[];

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;

  listLiabilities: any;

  wrapListOutOrg: any;
  listOutOrg$ = new Observable<any[]>();
  codeSearchOutOrg;
  debouncerOutOrg: Subject<string> = new Subject<string>();
  notFoundText;

  mmUsedTotal = 0;
  mmPayedTotal = 0;
  mmOwedTotal = 0;
  moneyOwedTotal = 0;

  currencyMask = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: false,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  columns = [
    {
      key: 0,
      value: this.translateService.instant("liabilitiesPartner.unitOutsource"),
      isShow: true
    },
    {
      key: 1,
      value: this.translateService.instant("liabilitiesPartner.partner"),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant("liabilitiesPartner.partnerType"),
      isShow: true
    },
    {
      key: 3,
      value: this.translateService.instant("liabilitiesPartner.poiter"),
      isShow: true
    },
    {
      key: 4,
      value: this.translateService.instant("liabilitiesPartner.MMUsed"),
      isShow: this.show
    },
    {
      key: 5,
      value: this.translateService.instant("liabilitiesPartner.MMPayed"),
      isShow: this.show
    },
    {
      key: 6,
      value: this.translateService.instant("liabilitiesPartner.MMRemain"),
      isShow: this.show
    },
    {
      key: 7,
      value: this.translateService.instant("liabilitiesPartner.moneyOwed"),
      isShow: this.show
    }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public translateService: TranslateService,
    private liabilitiesOutPartnerService: LiabilitiesOutPartnerService,
    private spinner: NgxSpinnerService,
    private commonApiService: CommonApiService,
    public commonService: CommonService
  ) {
    this.maxSizePage = MAX_SIZE_PAGE;
    this.page = 1;
    this.itemsPerPage = 5;
  }

  ngOnInit() {
    this.buidForm();
    this.onResize();
    this.debounceOnSearchOutOrg();
    this.fetchData(false);
    this.setDecimal();

    // show hide default
    this.columns[4].isShow = this.show;
    this.columns[5].isShow = this.show;
    this.columns[6].isShow = this.show;
    this.columns[7].isShow = !this.show;
  }

  onCancel() {
    this.onCloseModal();
  }

  onCloseModal() {
    this.activeModal.dismiss();
    this.form.reset();
    this.activeModal.dismiss(true);
  }

  onResize() {
    this.height = this.heightService.onResize();
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

    this.fetchData(false);
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      ousourceUnitName: [null],
      partner: [""],
      MMUsed: [""],
      MMPayed: [""],
      MMRemain: [""],
      moneyRemain: [""]
    });
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
  }

  fetchData(isShowFirst: boolean) {
    this.spinner.show();

    // check validate
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }

    // trim space
    this.form.get("partner").setValue(this.form.get("partner").value.trim());

    // set show first page
    if (isShowFirst) {
      this.previousPage = 1;
      this.page = 1;
    }
    const data = {
      organization: this.form.get("ousourceUnitName").value
        ? this.form.get("ousourceUnitName").value
        : "",
      partnerShortName: this.form.get("partner").value
        ? this.form.get("partner").value
        : "",
      MMUsed: this.form.get("MMUsed").value.toString()
        ? this.form
            .get("MMUsed")
            .value.toString()
            .replace(/\./g, "")
            .replace(/\,/g, ".")
        : "",
      MMPayed: this.form.get("MMPayed").value.toString()
        ? this.form
            .get("MMPayed")
            .value.toString()
            .replace(/\./g, "")
            .replace(/\,/g, ".")
        : "",
      MMRemain: this.form.get("MMRemain").value.toString()
        ? this.form
            .get("MMRemain")
            .value.toString()
            .replace(/\./g, "")
            .replace(/\,/g, ".")
        : "",
      moneyRemain: this.form.get("moneyRemain").value.toString()
        ? this.form
            .get("moneyRemain")
            .value.toString()
            .replace(/\./g, "")
            .replace(/\,/g, ".")
        : "",

      page: this.page - 1,
      size: this.itemsPerPage
    };

    this.liabilitiesOutPartnerService.search(data).subscribe(res => {
      this.spinner.hide();
      this.listLiabilities = res.body.content;

      this.second = res.body.totalPages;
      this.totalItems = res.body.totalElements;
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

  getOutOrgList(key: String) {
    this.commonApiService.getListOutsourceOrg(key).subscribe(res => {
      this.listOutOrg$ = of(res.body);
      this.wrapListOutOrg = res.body;
      if (res.body.length === 0) {
        this.notFoundText = "common.select.notFoundText";
        $(".ng-option").css("display", "block");
      }
    });
  }

  get formControl() {
    return this.form.controls;
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  setDecimal() {
    this.currencyMask = createNumberMask({ ...this.currencyMask });
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

    const partnerCode = item.out_ORG_CODE.toLocaleLowerCase();
    // let partnerName = item.out_ORG_NAME.toLocaleLowerCase();
    const partnerShortName = item.out_ORG_NAME.toLocaleLowerCase();

    // partnerName = partnerName.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    // partnerName = partnerName.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    // partnerName = partnerName.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    // partnerName = partnerName.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    // partnerName = partnerName.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    // partnerName = partnerName.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    // partnerName = partnerName.replace(/đ/g, 'd');
    // // Some system encode vietnamese combining accent as individual utf-8 characters
    // partnerName = partnerName.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
    // partnerName = partnerName.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
    return (
      partnerCode.indexOf(term) > -1 ||
      // partnerName.indexOf(term) > -1 ||
      partnerShortName.indexOf(term) > -1 ||
      (partnerCode + " - " + partnerShortName).includes(term)
    );
  }

  checkValidate(controlName: string, value: string) {
    // check validate
    if (value === "0" || value === "0,") {
      this.form.get(controlName).setValue("");
      return;
    }
  }

  /**
   * HungND 22/08/2020
   */
  ignoreRezo(controlName: string) {
    if (this.form.get(controlName).value == 0)
      this.form.get(controlName).setValue("");
  }
}
