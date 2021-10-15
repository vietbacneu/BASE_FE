import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HeightService } from "app/shared/services/height.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { Observable, of, Subject, Subscription } from "rxjs";
import { DataCategoryModel } from "app/modules/system-categories/data-categories/models/DataCategory.model";
import { PartnerContractService } from "app/modules/dashboard/partner-project/service/partner-contract-service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { REGEX_PATTERN } from "app/shared/constants/pattern.constants";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

@Component({
  selector: "jhi-partner-detail",
  templateUrl: "./partner-detail.component.html",
  styleUrls: ["./partner-detail.component.scss"]
})
export class PartnerDetailComponent implements OnInit {
  @Input() public selectedData: DataCategoryModel;
  @Input() type;

  height: number;
  form: FormGroup;
  itemsPerPage: any;
  maxSizePage: any;
  routeData: any;
  page: number;
  second: any;
  totalItems: any;
  data: any;
  dataTotal: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  userList: any;
  formValue;
  eventSubscriber: Subscription;
  listUnit$ = new Observable<any[]>();
  unitSearch;
  searchData: any;
  contractStatusList: any = [];
  debouncer: Subject<string> = new Subject<string>();
  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;
  columns = [
    { key: 0, value: "Tên viết tắt", isShow: true },
    { key: 1, value: "Sô hợp đồng", isShow: true },
    { key: 2, value: "MM còn nợ", isShow: true }
  ];

  mmowed = {
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
    public activeModal: NgbActiveModal,
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private partnerContractService: PartnerContractService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {
    this.itemsPerPage = 5;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.page = 1;
    // this.itemsPerPage = 5;
  }

  ngOnInit(): void {
    this.buildForm();
    this.onResize();
    this.setDecimal();
    this.getDataDropdown();
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
  }

  setDecimal() {
    this.mmowed = createNumberMask({ ...this.mmowed });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      contractNum: [""],
      partnerShortName: [""],
      startTime: [""],
      endTime: [""],
      mmowed: [""],
      contractStatus: [""]
    });
  }

  loadPage(page: any) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  getDataDropdown() {
    this.listUnit$ = of([]);
    this.partnerContractService.getContractStatus("TTK").subscribe(
      result => {
        this.contractStatusList = result;
        this.form.get("contractStatus").setValue(this.type);
        this.doSearch(true);
      },
      err => {
        this.contractStatusList = [];
      }
    );
  }

  customSearchFn(term: string, item: any) {
    const replacedKey = term.replace(REGEX_PATTERN.SEARCH_DROPDOWN_LIST, "");
    const newRegEx = new RegExp(replacedKey, "gi");
    const purgedPosition = item.groupName.replace(
      REGEX_PATTERN.SEARCH_DROPDOWN_LIST,
      ""
    );
    return newRegEx.test(purgedPosition);
  }

  onChangePosition(event) {
    if (event) {
      this.setValueToField("dataCategoryId", event.dataCategoryId);
      this.setValueToField("groupName", event.groupName);
    }
  }

  onClearPosition() {
    this.setValueToField("dataCategoryId", null);
    this.setValueToField("groupName", null);
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  transition() {
    const formValue = this.form.value;
    this.doSearch(false);
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.transition();
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  doSearch(isShowFirst: any) {
    if (isShowFirst) {
      this.previousPage = 1;
      this.page = 1;
    }
    const data = {
      contractNum: this.form.value.contractNum
        ? this.form.value.contractNum
        : "",
      partnerShortName: this.form.value.partnerShortName
        ? this.form.value.partnerShortName
        : "",
      startTime: this.form.value.startTime ? this.form.value.startTime : "",
      endTime: this.form.value.endTime ? this.form.value.endTime : "",
      mmOwedStr: this.form.value.mmowed ? this.form.value.mmowed : "",
      contractStatus: this.form.value.contractStatus
        ? this.form.value.contractStatus
        : "",
      page: this.page - 1,
      size: this.itemsPerPage
    };
    this.partnerContractService.search(data).subscribe(
      res => {
        this.data = res.body.content;
        this.totalItems = res.body.totalElements;
      },
      error => {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.load")
        );
      }
    );

    this.partnerContractService.getdataTotal(data).subscribe(
      res => {
        this.dataTotal = res.body;
      },
      error => {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.load")
        );
      }
    );
  }

  onCloseAddModal() {
    this.activeModal.dismiss();
    this.form.reset();
    this.activeModal.dismiss(true);
  }

  deleteZero(event) {
    const value = event.target.value;
    if (Number(value) === 0) {
      event.target.value = value.replace(value, "");
    }
  }
}
