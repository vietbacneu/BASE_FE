import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HeightService } from "app/shared/services/height.service";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { TranslateService } from "@ngx-translate/core";
import { PartnerOrganService } from "app/core/services/dashboard/partner-organ.service";
import { NgxSpinnerService } from "ngx-spinner";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { CommonService } from "app/shared/services/common.service";
import { JhiEventManager } from "ng-jhipster";
import { Observable, of, Subject, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { REGEX_PATTERN } from "app/shared/constants/pattern.constants";
import { createNumberMask } from "text-mask-addons/dist/textMaskAddons";

@Component({
  selector: "jhi-partner-organization-list",
  templateUrl: "./partner-organization-list.component.html",
  styleUrls: ["./partner-organization-list.component.scss"]
})
export class PartnerOrganizationListComponent implements OnInit {
  @Input() type;

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
  isModalConfirmShow = false;
  listPartnerOrgan: any;
  listRent = new Observable<any[]>();
  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;
  eventSubscriber: Subscription;
  debouncer: Subject<string> = new Subject<string>();
  termSearch;
  notFoundText;
  currencyMask = {
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

  columns = [
    {
      key: 0,
      value: this.translateService.instant("partnerOrgan.outsourcing"),
      isShow: true
    },
    {
      key: 1,
      value: this.translateService.instant("partnerOrgan.partnerShortName"),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant("partnerOrgan.mmUsing"),
      isShow: true
    },
    {
      key: 3,
      value: this.translateService.instant("partnerOrgan.mmPayed"),
      isShow: true
    },
    {
      key: 4,
      value: this.translateService.instant("partnerOrgan.mmOwed"),
      isShow: true
    }
  ];

  constructor(
    private heightService: HeightService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private partnerOrganService: PartnerOrganService,
    private spinner: NgxSpinnerService,
    public commonService: CommonService,
    private eventManager: JhiEventManager
  ) {
    this.itemsPerPage = 5;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.page = 1;
  }

  ngOnInit(): void {
    this.buildForm();
    this.onResize();
    this.debounceOnSearch();
    this.loadData();
    this.setDecimal();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      outOrganId: null,
      partnerShortName: ["", Validators.maxLength(255)],
      totalMmPayed: ["", Validators.maxLength(20)],
      totalMmOwed: ["", Validators.maxLength(20)]
    });
  }

  debounceOnSearch() {
    this.debouncer
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.loadRentList(value));
  }

  onResize() {
    this.height = this.heightService.onResizeHeight280Px();
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
  }

  onCloseAddModal() {
    this.isModalConfirmShow = true;
    this.activeModal.dismiss();
    this.activeModal.dismiss(true);
  }

  private paginateList(data) {
    if (data.content.length > 0) {
      data.content.push({
        outOrganName: "Tổng",
        partnerShortName: null,
        totalMmUsing: data.content[0]["sumData"]["totalMmUsing"],
        totalMmPayed: data.content[0]["sumData"]["totalMmPayed"],
        totalMmOwed: data.content[0]["sumData"]["totalMmOwed"]
      });
    }
    this.second = data.totalPages;
    this.totalItems = data.totalElements;
    this.listPartnerOrgan = data.content;
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.loadData();
    }
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.loadData();
  }

  loadData() {
    this.spinner.show();

    this.partnerOrganService
      .getAll({
        page: this.page - 1,
        size: this.itemsPerPage,
        outOrganId: this.form.get("outOrganId").value
          ? this.form.get("outOrganId").value
          : "",
        partnerShortName: this.form.get("partnerShortName")
          ? this.form.get("partnerShortName").value
          : "",
        totalMmPayed: this.form.get("totalMmPayed").value.toString()
          ? this.form
              .get("totalMmPayed")
              .value.toString()
              .replace(/\./g, "")
              .replace(/\,/g, ".")
          : "",
        totalMmOwed: this.form.get("totalMmOwed").value.toString()
          ? this.form
              .get("totalMmOwed")
              .value.toString()
              .replace(/\./g, "")
              .replace(/\,/g, ".")
          : ""
      })
      .subscribe(
        res => {
          this.spinner.hide();
          this.paginateList(res.body);
        },
        err => {
          this.spinner.hide();
          this.commonService.openToastMess(
            err.error.code,
            true,
            this.translateService.instant("common.action.search")
          );
        }
      );
  }

  searchData() {
    this.page = 1;
    this.loadData();
  }

  loadRentList(term) {
    this.partnerOrganService.getRentAll(term).subscribe(res => {
      if (res) {
        this.listRent = of(res.sort((a, b) => a.code.localeCompare(b.code)));
        if (res.length === 0) {
          this.notFoundText = "common.select.notFoundText";
          $(".ng-option").css("display", "block");
        }
      } else {
        this.listRent = of([]);
      }
    });
  }

  customSearchFn(event) {
    this.termSearch = event.term;
    const term = event.term;
    if (term !== "") {
      this.debouncer.next(term);
      this.notFoundText = "";
      $(".ng-option").css("display", "none");
    } else {
      this.listRent = of([]);
      this.notFoundText = "common.select.notFoundText";
    }
  }

  clearValueUnit() {
    this.listRent = of([]);
    this.termSearch = "";
  }

  onSearchUnitClose() {
    if (!this.form.value.unitID) {
      this.listRent = of([]);
      this.termSearch = "";
    }
  }

  onChangePartnerName(ind, event) {
    if (event) {
      this.listRent[ind].id = event.id;
      this.listRent[ind].partnerName = event.partnerName;
    } else {
      this.listRent[ind].id = "";
      this.listRent[ind].partnerName = "";
    }
  }

  setDecimal() {
    this.currencyMask = createNumberMask({ ...this.currencyMask });
  }

  onTrimZero(event) {
    const value = event.target.value;
    event.target.value = value.replace(/^0+/, "");
  }

  get formControl() {
    return this.form.controls;
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  customSearchFnDVTN(term: string, item: any) {
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

    const code = item.code.toLocaleLowerCase();
    let name = item.name.toLocaleLowerCase();
    // const partnerShortName = item.partnerShortName.toLocaleLowerCase();

    name = name.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    name = name.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    name = name.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    name = name.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    name = name.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    name = name.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    name = name.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    name = name.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    name = name.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return (
      code.indexOf(term) > -1 ||
      name.indexOf(term) > -1 ||
      (code + " - " + name).includes(term)
    );
  }

  deleteZero(event) {
    const value = event.target.value;
    if (Number(value) === 0) {
      event.target.value = value.replace(value, "");
    }
  }

  format(dataSearch: any) {
    for (let index = 0; index < dataSearch.length; index++) {
      if (
        dataSearch[index].totalMmOwed !== null &&
        dataSearch[index].totalMmOwed !== undefined
      ) {
        dataSearch[index].totalMmOwed = dataSearch[index].totalMmOwed
          .toString()
          .replace(/\./g, ",");
      }
      if (
        dataSearch[index].totalMmPayed !== null &&
        dataSearch[index].totalMmPayed !== undefined
      ) {
        dataSearch[index].totalMmPayed = dataSearch[index].totalMmPayed
          .toString()
          .replace(/\./g, ",");
      }
      if (
        dataSearch[index].totalMmUsing !== null &&
        dataSearch[index].totalMmUsing !== undefined
      ) {
        dataSearch[index].totalMmUsing = dataSearch[index].totalMmUsing
          .toString()
          .replace(/\./g, ",");
      }
    }
    return dataSearch;
  }
}
