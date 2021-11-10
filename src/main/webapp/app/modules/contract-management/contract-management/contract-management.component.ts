import { ImportExcelComponent } from "app/modules/contract-management/import-excel/import-excel.component";
import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { ContractManagerService } from "app/core/services/contract-management/contract-manager.service.ts";
import { ContractManagerModel } from "app/core/models/contract-manager/contract-manager.model";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { HeightService } from "app/shared/services/height.service";
import { CommonApiService } from "app/core/services/common-api/common-api.service";
import { CustomValidationService } from "app/modules/system-categories/data-categories/services/custom-validation.service";
import { Observable, of, Subject, Subscription } from "rxjs";
import { JhiEventManager } from "ng-jhipster";
import * as moment from "moment";
import { createNumberMask } from "text-mask-addons/dist/textMaskAddons";

@Component({
  selector: "jhi-contract-management",
  templateUrl: "./contract-management.component.html",
  styleUrls: ["./contract-management.component.scss"]
})
export class ContractManagementComponent implements OnInit {
  form: FormGroup;
  totalItems: any;
  listId: any[];
  list: Object = null;
  contractOutsourceList: ContractManagerModel[];
  // check thoi gian bat dau < thoi gian ket thuc
  error;
  message;
  maskCurrentNumber = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  startTime: number;
  endTime: number;
  signatureStatus: string;
  contractStatu: string;
  partnerId: string;
  projectId: string;

  searchData: any;

  height: number;
  invoiceSerialList: ContractManagerModel[];
  type: string;
  selectedData;
  itemsPerPage: any;
  maxSizePage: any;
  routeData: any;
  page: any;
  second: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  statusList: any[] = [];
  invoiceTemplateList: any[] = [];
  newDate: any;
  buttonDisable;

  SigningStatus: any;
  contractStatus: any;
  appraisalStatus: any;
  private eventSubscriber: Subscription; // quanghn add
  //
  listJoinDT$ = new Observable<any[]>();
  debouncer: Subject<string> = new Subject<string>();
  joinUnitSearch1;

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;

  columns = [
    {
      key: 0,
      value: this.translateService.instant("contractManagement.numContract"),
      isShow: true
    },
    {
      key: 1,
      value: this.translateService.instant("contractManagement.idMaDoiTac"),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant("contractManagement.TTK"),
      isShow: true
    },
    {
      key: 3,
      value: this.translateService.instant("contractManagement.SHDTN"),
      isShow: false
    },
    {
      key: 4,
      value: this.translateService.instant("contractManagement.TTHD"),
      isShow: true
    },
    {
      key: 5,
      value: this.translateService.instant("contractManagement.TTTD"),
      isShow: true
    },
    {
      key: 6,
      value: this.translateService.instant("contractManagement.TMMTN"),
      isShow: true
    },
    {
      key: 7,
      value: this.translateService.instant("contractManagement.MMDTT"),
      isShow: true
    },
    {
      key: 8,
      value: this.translateService.instant("contractManagement.MMCN"),
      isShow: true
    },
    {
      key: 9,
      value: this.translateService.instant("contractManagement.DG"),
      isShow: true
    },
    {
      key: 10,
      value: this.translateService.instant("contractManagement.GTHD"),
      isShow: true
    },
    {
      key: 11,
      value: this.translateService.instant("contractManagement.STCN"),
      isShow: true
    },
    {
      key: 12,
      value: this.translateService.instant("contractManagement.TGBD"),
      isShow: true
    },
    {
      key: 13,
      value: this.translateService.instant("contractManagement.TGKT"),
      isShow: true
    },
    {
      key: 14,
      value: this.translateService.instant("contractManagement.TTCHD"),
      isShow: false
    },
    {
      key: 15,
      value: this.translateService.instant("contractManagement.VD"),
      isShow: false
    }
  ];

  constructor(
    private modalService: NgbModal,
    private contractManagerService: ContractManagerService,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private heightService: HeightService,
    private toastService: ToastService,
    private customValidationService: CustomValidationService,
    private commonApiService: CommonApiService,
    private router: Router,
    private eventManager: JhiEventManager
  ) {
    // this.totalItems =;
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {

    });
  }

  ngOnInit() {
    this.searchData = {};
    this.startTime = new Date().setDate(1);
    this.endTime = new Date().setDate(1);
    this.buidForm();
    this.getSignStatus();
    this.getContractStatus();
    this.getAppraisalStatus();
    this.onResize();
    this.fetchData();
    this.registerChange();
    this.setDecimal();
  }

  setDecimal() {
    this.maskCurrentNumber = createNumberMask({ ...this.maskCurrentNumber });
  }

  // get trạng thái ký
  getSignStatus() {
    this.contractManagerService
      .getSignStatusOrContractStatus("TTK")
      .subscribe(res => (this.SigningStatus = res));
  }

  // get trạng thái hợp đồng
  getContractStatus() {
    this.contractManagerService
      .getSignStatusOrContractStatus("TTHD")
      .subscribe(res => (this.contractStatus = res));
  }

  // get trạng thái thẩm định ULNL
  getAppraisalStatus() {
    this.contractManagerService
      .getSignStatusOrContractStatus("ULNL")
      .subscribe(res => (this.appraisalStatus = res));
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      numContract: "", // số hợp đồng
      createdDate: "", // new Date().setDate(1),
      endDate: "", // new Date().setDate(1),
      signatureStatu: [""], // trạng thái ký
      contractStatu: [""], // trạng thái hợp đồng
      projectCode: [""], // mã dự án
      parterCode: null, // mã đối tác
      appraisalStatus: [""], // Trạng thái thẩm định ULNL
      totalMMPayed: [""], // tổng MM đã thanh toán
      totalOwnedMM: [""], // MM còn nợ
      totalMM: [""], // Tổng MM thuê ngoài
      price: [""], // giá
      contractValue: [""], // giá trị hợp đồng
      amountOwed: [""] // Số tiền còn nợ
    });
  }

  sort() {
    const result = [this.predicate + "," + (this.reverse ? "desc" : "asc")];
    if (this.predicate !== "id") {
      result.push("id");
    }
    return result;
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  loadAll() {}

  fetchData() {
    this.spinner.show();
    this.searchData.page = this.page - 1;
    this.contractManagerService.fetchAll(this.searchData).subscribe(
      result => {
        this.contractOutsourceList = result.content;
        this.second = result.totalPages;
        this.totalItems = result.totalElements;
        this.spinner.hide();
      },
      error1 => {
        this.toastService.openErrorToast("Lỗi không load được dữ liệu");
        this.spinner.hide();
      }
    );
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
  }

  onDelete(data) {
    this.checkValidateSignContract(data);
  }

  // check validate trạng thái hợp đồng trước khi xóa
  checkValidateSignContract(data: any) {
    const signContract = Number(data.contractStatus);
    this.contractManagerService.dogetEntitById(signContract).subscribe(res => {
      if (res.paramCode === "DRAFT") {
        const modalRef = this.modalService.open(ConfirmModalComponent, {
          centered: true,
          backdrop: "static"
        });
        modalRef.componentInstance.type = "delete";
        modalRef.componentInstance.param = "hợp đồng thuê ngoài";
        modalRef.componentInstance.onCloseModal.subscribe(value => {
          if (value === true) {
            // xóa dữ liệu bảng đối tác tham gia
            this.onDeleteJoinPartner(data.id);
            // xóa dữ liệu bảng thông tin nỗ lực thực tế
            this.onDeleteActual(data.id);
            //
            this.onSubmitDelete(data.id);
          }
        });
      } else {
        this.toastService.openErrorToast(
          " Trạng thái hợp đồng khác dự thảo không được phép xóa"
        );
      }
    });
  }

  onSubmitDelete(id?: any) {
    this.spinner.show();
    this.contractManagerService.deleteById(id).subscribe(
      res => {
        this.spinner.hide();
        if (res) {
          this.toastService.openSuccessToast(
            this.translateService.instant(
              "common.toastr.messages.success.delete",
              {
                paramName: "hợp đồng thuê ngoài"
              }
            )
          );
          this.page = 1;
          this.transition();
        } else {
          this.toastService.openErrorToast(
            this.translateService.instant("common.toastr.messages.error.delete")
          );
        }
      },
      () => {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.delete")
        );
      }
    );
  }

  onDeleteActual(id?: any) {
    this.spinner.show();
    this.contractManagerService.deleteByActual(id).subscribe(
      res => {},
      () => {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.delete")
        );
      }
    );
  }

  onDeleteJoinPartner(id?: any) {
    this.spinner.show();
    this.contractManagerService.deleteByJoinPartner(id).subscribe(
      res => {},
      () => {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.delete")
        );
      }
    );
  }

  onSearchContract() {
    this.page = 1;
    this.transition();
  }

  transition() {
    const formValue = this.form.value;
    this.searchData.startTime =
      formValue.createdDate === ""
        ? ""
        : this.convertDate2(formValue.createdDate); // thời gian bắt đầu
    this.searchData.endTime =
      formValue.endDate === "" ? "" : this.convertDate2(formValue.endDate); // thời gian kết thúc
    this.searchData.signatureStatus = formValue.signatureStatu; // trạng thái ký
    this.searchData.contractStatus = formValue.contractStatu; // trạng thái hợp đồng
    this.searchData.projectCode = formValue.projectCode; // mã dự án
    this.searchData.partnerCode = formValue.parterCode; // mã đối tác

    (this.searchData.appraisalStatus = formValue.appraisalStatus), // Trạng thái thẩm định ULNL
      (this.searchData.totalOwnedMM = formValue.totalOwnedMM.toString()
        ? formValue.totalOwnedMM
            .toString()
            .replace(/\./g, "")
            .replace(/\,/g, ".")
        : ""); // MM còn nợ
    this.searchData.totalMM = formValue.totalMM.toString()
      ? formValue.totalOwnedMM
          .toString()
          .replace(/\./g, "")
          .replace(/\,/g, ".")
      : ""; // Tổng MM thuê ngoài
    this.searchData.totalMMPayed = formValue.totalMMPayed.toString()
      ? formValue.totalMMPayed
          .toString()
          .replace(/\./g, "")
          .replace(/\,/g, ".")
      : ""; // Tổng MM đã thanh toán
    this.searchData.price = formValue.price.toString()
      ? formValue.price
          .toString()
          .replace(/\./g, "")
          .replace(/\,/g, ".")
      : ""; // giá
    this.searchData.contractValue = formValue.contractValue.toString()
      ? formValue.contractValue
          .toString()
          .replace(/\./g, "")
          .replace(/\,/g, ".")
      : ""; // giá trị hợp đồng
    this.searchData.amountOwed = formValue.amountOwed.toString()
      ? formValue.amountOwed
          .toString()
          .replace(/\./g, "")
          .replace(/\,/g, ".")
      : ""; // Số tiền còn nợ
    this.searchData.numContract = formValue.numContract; // Số hợp đồng

    this.searchData.page = this.page;
    this.searchData.limit = this.itemsPerPage;
    this.fetchData();
  }

  // convert date format Mon May 18 2020 12:00:00 GMT+0700 (Indochina Time) ---> yyyy/MM/dd
  //
  convertDate2(str?: string) {
    let res = "";
    if (str.includes("-")) {
      const val = str.split("-");
      const s1 = (val[0] + "")
        .trim()
        .split("/")
        .reverse()
        .join("-");
      const s2 = (val[1] + "")
        .trim()
        .split("/")
        .reverse()
        .join("-");
      res = s1 + ";" + s2;
    } else {
      // res = this.convertDate(str)
      //   .split('-')
      //   .reverse()
      //   .join('-');
      res = this.convertDateStr(str);
    }
    return res;
  }

  convertDate(str) {
    const date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  // thanhnb
  convertDateStr(dateStr: string) {
    const dateArr = dateStr.split("/");
    const day = dateArr[0];
    const month = dateArr[1];
    const year = dateArr[2];
    return year + "-" + month + "-" + day;
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

  // import
  openImportModal() {
    const modalRef = this.modalService.open("", {
      size: "lg",
      windowClass: "modal-import"
    });
    modalRef.componentInstance.isClose = false;
    modalRef.result.then(result => {}).catch(() => {});
  }

  // trangnc view hiển thị xem
  onViewOrUpdateData(item: any, action: any) {
    if (item === null) {
      item = {};
    }
    item.type = action;
    if (action === "view") {
      this.contractManagerService.changeInvoice(item);
      this.router.navigate(["/contract-management/view"]);
    } else if (action === "update") {
      if (item.contractStatus === null) {
        this.contractManagerService.changeInvoice(item);
        this.router.navigate(["/contract-management/update"]);
      } else {
        const signContract = Number(item.contractStatus);
        this.contractManagerService
          .dogetEntitById(signContract)
          .subscribe(res => {
            if (res.paramCode === "DONE") {
              this.toastService.openWarningToast(
                "Hợp đồng đã hoàn thành không được phép sửa "
              );
            } else {
              this.contractManagerService.changeInvoice(item);
              this.router.navigate(["/contract-management/update"]);
            }
          });
      }
    } else {
      this.contractManagerService.changeInvoice(item);
      this.router.navigate(["/contract-management/create"]);
    }
  }

  // trangnc
  onChangeDate(flag: any) {
    // this.setDefaultValue();
    // this.message = '';
    const value = this.form.value;
    const endDate = value.endDate;
    const createdDate = value.createdDate;
    if (endDate !== "" && createdDate !== "") {
      if (this.getDate(value.createdDate) - this.getDate(value.endDate) > 0) {
        if (flag === 1) {
          this.error = "createdDate";
          this.message = "Thời gian bắt đầu đang lớn hơn thời gian kết thúc";
        } else if (flag === 2) {
          this.error = "endDate";
          this.message = "Thời gian kết thúc đang nhỏ hơn thời gian bắt đầu";
        }
        this.buttonDisable = true;
      } else {
        this.message = "";
        this.buttonDisable = false;
      }
    }
  }

  checkDate() {
    this.message = "";
    const value = this.form.value;
    const endDate = value.endDate;
    const createdDate = value.createdDate;
    if (endDate !== "" && createdDate !== "") {
      if (this.getDate(value.createdDate) - this.getDate(value.endDate) > 0) {
        this.message = "Thời gian bắt đầu đang lớn hơn thời gian kết thúc";
        this.buttonDisable = true;
        return 1;
      } else {
        this.message = "";
        this.buttonDisable = false;
      }
    }
  }

  // trangnc
  getDate(value) {
    return new Date(value).getTime();
  }

  // QuangHN Start 16/06/2020
  openModal(type?: string, selectedData?: any) {
    if (type === "import") {
      const modalRef = this.modalService.open(ImportExcelComponent, {
        size: "lg",
        windowClass: "modal-import",
        backdrop: "static",
        keyboard: false
      });
      modalRef.componentInstance.type = type;
      modalRef.componentInstance.selectedData = selectedData;
      modalRef.result.then(result => {}).catch(() => {});
    }
  }

  registerChange() {
    this.eventSubscriber = this.eventManager.subscribe(
      "dataConstractList",
      response => this.onSearchContract()
    );
  }

  // QuangHN End 16/06/2020

  // trangnc search mã đối tác
  onSearchJoinUnit(event) {
    this.joinUnitSearch1 = event.term;
    if (this.joinUnitSearch1 !== "") {
      this.contractManagerService
        .doSearchByCodeorNameorShortName(this.joinUnitSearch1)
        .subscribe(res => {
          if (res["data"].length > 0) {
            this.listJoinDT$ = of(res["data"]);
          } else {
            this.listJoinDT$ = of([]);
          }
        });
    } else {
      this.listJoinDT$ = of([]);
    }
  }

  /**
   * HungND
   * format date from 'yyyy-MM-dd' to 'dd-MM-yyyy'
   */
  formatDate(date: string) {
    if ([null, undefined, ""].indexOf(date) >= 0) {
      return "";
    }
    return moment.utc(new Date(date)).format("DD/MM/YYYY");
  }

  checkMaxLenght(event, length) {
    const size = event.target.value.toString().length;
    if (size <= Number(length - 1)) {
      return true;
    } else {
      return false;
    }
  }

  onPaste(event: ClipboardEvent, nameField?: string, size?: number) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData("text");
    if (pastedText.length <= size) {
      this.form.get(nameField).setValue(pastedText);
      return false;
    } else if (pastedText.length > size) {
      const res = pastedText.substring(0, size);
      this.form.get(nameField).setValue(res);
      return false;
    }
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
    const partnerShortName = item.partnerShortName.toLocaleLowerCase();

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
      partnerShortName.indexOf(term) > -1 ||
      (partnerCode + " - " + partnerName + " - " + partnerShortName).includes(
        term
      )
    );
  }
  deleteZero(event) {
    const value = event.target.value;
    if (Number(value) === 0) {
      event.target.value = value.replace(value, "");
    }
  }
}
