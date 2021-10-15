import {
  Component,
  Input,
  OnInit,
  NgZone,
  Renderer,
  Directive,
  OnDestroy
} from "@angular/core";
import { ContractManagerService } from "app/core/services/contract-management/contract-manager.service.ts";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { map, debounceTime, catchError } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "app/shared/services/toast.service";
import { HeightService } from "app/shared/services/height.service";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";
import { ContractManagementService } from "app/core/services/system-management/contract-management.service";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import { Observable, of, Subject, Subscription } from "rxjs";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { HttpResponse } from "@angular/common/http";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { REGEX_PATTERN } from "app/shared/constants/pattern.constants";

//  IIST - trangnc - CREATED 200521
// Màn hình thêm, sửa hợp đồng thuê ngoàilll
@Component({
  selector: "jhi-component-management-form",
  templateUrl: "./contract-management-form.component.html",
  styleUrls: ["./contract-management-form.component.scss"]
})
export class ContractManagementFormComponent implements OnInit, OnDestroy {
  height: number;
  form: FormGroup;
  //
  currentPage = 1;
  numberPerPage = 5;
  pageList: any[] = [];
  numberOfPages = 0;
  numRecord = 0;
  arrNumberOfPages;
  // paging đối tác tham gia start
  currentPage2 = 1;
  numberPerPage2 = 5;
  pageList2: any[] = [];
  numRecord2 = 0;
  numberOfPages2 = 0;
  arrNumberOfPages2;
  // paging đối tác tham gia end

  //trangnc validate tổng MM start
  type: any;
  lst: any = [];
  regexReplaceSeparate;
  regexReplacePoint;
  // class Error Partner Code
  clErrPaC: string;
  // class Error Project Code
  clErrPC: string;
  // class Error tổng MM đã thẩm định
  clErrorMM: string;
  // class Error ULNL
  clErrULNL: string;
  // class Error Năm hợp tác
  clErrYear: string;
  // class Error Tổng MM thuê ngoài
  clErrorTtal: string;
  // class Error mã đối tác
  clErrorPartner: string;
  // danh sách những bản ghi bị xóa trong bảng ttnltt
  lstdataDelete: any = [];
  // object delete
  objDelete;
  // object delete DB
  objDeleteDB;
  // number LK
  numberLK = 0;
  // messg thông báo lỗi số hợp đồng bị trùng
  errorMsgNumberContract = "";
  // message thông báo lỗi Sum MM Payed > Sum MM outSourcing
  errorMsgMMPayed = "";
  //
  objCloneAlert: any = {};
  //
  objCloneForm: any = {};

  arrObjCloneAlert: any[] = [];

  // code đối tác tham gia start
  // danh sách những bản ghi bị xóa trong bảng đối tác tham gia
  lstdataDeleteJoin: any = [];
  // object delete
  objDeleteJoin;
  // object delete DB
  objDeleteDBJoin;
  joinUnitSearch1;
  joinUnitSearch2;
  notFoundText;
  // class Error Mã đối tác
  clJoinPartnerId: string;
  // ẩn hiển nút thêm, sửa, xóa
  btnDisabled = false;
  btnDisabled1 = false;
  // clone obj khi update
  objCloneJoin: any = {};
  // class error số hợp đồng
  clErrNumContract = "";
  // class error Tổng MM thuê ngoài
  clErrorMMOutSourcing;
  // class error MM sử dụng lũy kế
  clErrorMMUsing;
  // class error MM đã thanh toán
  clErrorPayed;
  clErrorPayed1;
  // class error tong mm thanh toan
  totalClErrorPayed = "";
  // class error Số tiền còn nợ
  clErrorMoneyOwed;
  // list chứa danh sách đối tác tham gia theo id
  listPartJoinById: any = [];
  // code đối tác tham gia end
  // list object actual effort sort
  actualEffortListSort: any[] = [];
  // button Disable Message Error For Date.
  btnDisMesDate: boolean;

  plandMMOSBlank = "";
  // trangnc validate tổng MM end (thông tin chung)
  totalMM = {
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

  // trangnc validate tổng MM end (đối tác tham gia)
  totalMMJoin = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate MM còn nợ (đối tác tham gia)
  mmOwedJoin = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: true,
    allowLeadingZeroes: true,
    integerLimit: 20,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // MM còn nợ (thông tin chung)
  totalOwnedMM2 = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: true,
    allowLeadingZeroes: false,
    integerLimit: 15,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate tổng MM đã thanh toán
  totalMMPayed = {
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

  // trangnc validate tổng MM đã thẩm định
  totalAppraisedMM = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate tháng 1 MM
  monthValue1 = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate tháng 2 MM
  monthValue2 = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: false,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate tháng 3 MM
  monthValue3 = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: false,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate tháng 4 MM
  monthValue4 = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: false,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate tháng 5 MM
  monthValue5 = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: false,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate tháng 6 MM
  monthValue6 = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: false,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate tháng 7 MM
  monthValue7 = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: false,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate tháng 8 MM
  monthValue8 = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: false,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate tháng 9 MM
  monthValue9 = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: false,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate tháng 10 MM
  monthValue10 = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: false,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate tháng 11 MM
  monthValue11 = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: false,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc validate tháng 12 MM
  monthValue12 = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: false,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 10,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // trangnc Tổng MM sử dụng luỹ kế
  totalAccumulatedMM = {
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

  //   trangnc Đơn giá (thông tin chung)
  price = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: false,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 15,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  // giá trị hợp đồng (thông tin chung)
  contractVal = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 15,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };

  //  trangnc
  objClone: any = [];
  unitSearch;
  unitSearch1;
  unitSearch2;
  unitSearch3;

  // search đầu mối kinh doanh
  unitSearchDMKD;
  // search đầu mối kỹ thuật
  unitSearchDMKT;

  //  objPartner
  objPartner;
  //
  debouncer: Subject<string> = new Subject<string>();
  // ẩn edit
  buttonDisabled = false;
  //  danh sách mã đối tác khi search.
  listUnit$ = new Observable<any[]>();
  // ẩn column hành động khi thực hiện view
  hiddenView = false;
  // trangnc list doi tác
  listDT$ = new Observable<any[]>();
  // trangnc list đầu mối đề nghị hợp tác
  listDMDVHT$ = new Observable<any[]>();
  // trangnc list Đầu mối kinh doanh
  listDMKD$ = new Observable<any[]>();
  // trangnc list Đầu mối kỹ thuật
  listDMKT$ = new Observable<any[]>();
  //trangnc list đơn vị sản xuất
  listDVSX$ = new Observable<any[]>();
  //trangnc list đơn vị kinh doanh
  listDVKD$ = new Observable<any[]>();

  // trangnc
  partnerId;
  // trangnc obj chứa data xem - sửa
  objViewOrUpdate: any = {
    partnerId: "", // mã dự án
    signatureStatus: "", //  trạng thái ký
    ttrpakdNumber: "", //  số TTrParkd
    contractStatus: "", //  trạng thái hợp đồng
    contractType: "", //  loại hợp đồng
    signDate: "", //  ngày ký hợp đồng
    startTime: "", //  thời gian bắt đầu
    endTime: "", //  thời gian kết thúc
    totalOwnedMM: "", //  tổng MM thuê ngoài
    contractValue: "", //  giá trị hợp đồng
    //  objView.ownedAmount = res.ownedAmount, //   Số tiền còn nợ (tự tính)

    contractDescription: "", //  thông tin chung hợp đồng
    note: "", //  ghi chú
    price: "", //  đơn giá
    //  objView.totalAccumulatedMM = res.totalAccumulatedMM, //  Tổng MM sử dụng luỹ kế
    totalMMPayed: "", //  Tổng MM đã thanh toán
    totalMM: "" //  Tổng MM thuê ngoài
  };

  // trangnc DropList Trạng thái ký
  signatureStatusList: any = [];
  // trangnc DropList Trạng thái hợp đồng
  contractStatusList: any = [];
  // trangnc DropList Loại hợp đồng
  contractTypeList: any = [];
  // trangnc biến Form
  signatureStatus: any;
  // trangnc TTr PAKD
  ttrpakdNumber: any;
  // trangnc Trạng thái hợp đồng
  contractStatus: any;
  // trangnc Loại hợp đồng
  contractType: any;
  // trangnc ngày ký hợp đồng
  signDate: any;
  //  trangnc thời gian bắt đầu
  startTime;
  // trangnc thời gian kết thúc
  endTime;
  // trangnc MM còn nợ
  totalOwnedMM; // (this.totalMM == null ? 0 : Number(this.totalMM)) - (this.totalMMPayed == null ? 0 : Number(this.totalMMPayed));
  // trangnc Giá trị hợp đồng
  contractValue: any = "";
  //  trangnc Số tiền còn nợ
  ownedAmount;
  //  trangnc ẩn-hiện
  hidden = false;
  // trangnc ẩn 2 trường TTrPark và ngày ký hợp đồng
  updateHidden = false;

  //  Biến Thông tin nỗ lực sử dụng thực tế
  //  trangnc Tổng MD sử dụng thực tế
  totalRealityMD = 0;

  isDisabledContractValue = false;
  error = null;
  errorMMTN = null;
  errorPartner = null;
  errortotalMM = null;

  message = null;
  messagetotalMM = null;
  messageDate = null;
  messageErrorPartner = null;
  tempDropdownDataList: any = [];
  dropdownDataList: any = [];
  dropdownDataMap: any = {};
  activeEffort = true;
  decimalPointSpace;
  decimalPointSignSeparate;
  //  disable MM còn nợ
  disabledMMConNo = true;
  ablecontractValue;

  years: number[] = [];
  yy: number;

  params: any = {
    // id: null,
    // partnerId: null,
    // partnerName: null,
    // signatureStatus: 'Chưa Ký',
    // ttrpakdNumber: null,
    // contractStatus: null,
    // contractType: null,
    // startTime: null,
    // endTime: null,
    // signDate: null,
    // // totalMMPayed: null,
    // totalOwnedMM: null,
    // contractValue: null,
    // ownedAmount: null,
    actualEffortList: [], // list thông tin nỗ lực thực tế
    actualEffortList2: [], // list phân trang thông tin nỗ lực thực tế
    partnerJoinList: [], // list đối tác tham gia
    partnerJoinList2: [] // list phân trang đối tác tham gia
  };

  //  object cho insert Data
  objectInsert: any = {};

  /* ------ FAKE DATA--------------------------------------------- */
  //  trangnc Kế hoạch thuê ngoài
  outsourcePlans: any = [];
  //  trangnc trạng thái thẩm định
  effortStatusList: any = [];
  // trangnc năm hơp tác
  cooperationYearList: any = [];
  //  check title 0: add - 1: xem - 2: sửa
  checkTile;
  //   Đơn vị thuê ngoài - Đơn vị kinh doanh - Đơn vị sản xuất
  organizationList;
  //  Đối tác
  //   Mã dự án
  tempSoftwareDevelopmentProjects: any = [];
  //  Đầu mối
  tempClueList: any = [];
  sysUserService: any;

  listProject: any[] = [];
  planOutsourcingApprove: any[] = [];
  listPlancode: any[] = [];
  storage: Storage;
  isShowToast: boolean;
  totalMMOSContact: any = "";
  isCheckMMLK = false; // check luy ke
  priceClError = "";
  private subscription: Subscription;

  /* ------END FAKE DATA--------------------------------------------- */

  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private contractManagerService: ContractManagerService,
    private service: ContractManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private translateService: TranslateService,
    private heightService: HeightService,
    private datePipe: DatePipe,
    private ngZone: NgZone,
    private renderer: Renderer
  ) {
    this.storage = window.localStorage;
  }

  ngOnInit(): void {
    /* trangnc check sự kiện thêm - sửa - xem */
    /* this.createMask(); */
    this.buidForm();
    this.type = "";
    this.buttonDisabled = false;
    this.btnDisabled = false;
    this.listDT$ = of([]);
    this.setDecimal();
    if (this.getStorage("QLDT_SEND_DATA")) {
      this.updateHidden = false;
      this.form.get("type").setValue("create");
      this.onResize();
      this.getContractStatus();
      this.getTypeContracts();
      this.getSignStatus();
      this.debounceOnSearch();
      this.getAllPlan();
      this.getULNL();
      this.getAllProjectCreate();
    } else {
      this.subscription = this.contractManagerService.currentInvoice.subscribe(
        res => {
          if (res === null) {
            this.router.navigate(["/contract-management"]);
          } else {
            this.type = res.type;
            if (res.type === "view") {
              //  hiển thị xem
              //  hiển thị 2 trường TTr PAKD - Ngày ký hợp đồng
              this.updateHidden = false;
              this.hiddenView = true;
              this.onResize();
              this.getSignStatus();
              this.getTypeContracts();
              this.getContractStatus();
              this.getAllPlan();
              this.getULNL();
              // this.getAllYear(); quanghn cmt
              this.getYear();
              this.pushDataToForm(res, "view");
              this.getDataToPartnerJoinList(res.id);
              this.getDataToactualEffortList(res.id);
              this.checkTile = 1;
            } else if (res.type === "update") {
              //  thực hiện sửa
              //  ẩn 2 trường TTr PAKD - Ngày ký hợp đồng
              this.checkTile = 2;
              this.updateHidden = true;
              this.hiddenView = false;
              this.onResize();
              this.getSignStatus();
              this.getTypeContracts();
              this.getContractStatus();
              this.getAllPlan();
              this.getULNL();
              // this.getAllYear(); quanghn cmt
              this.getYear();
              this.pushDataToForm(res, "update");
              this.getDataToPartnerJoinList(res.id); // get Data to Partner Join
              this.getDataToactualEffortList(res.id); // get Data To ActualEffort List
              // this.cloneObject(res);
            } else if (res.type === "add") {
              //  thực hiện thêm mới
              //  hiển thị 2 trường TTr PAKD - Ngày ký hợp đồng
              this.updateHidden = false;
              this.form.get("type").setValue("add");
              this.onResize();
              this.getContractStatus();
              this.getTypeContracts();
              this.getSignStatus();
              this.debounceOnSearch();
              this.checkTile = 0;
            } else if (res.type === "create") {
              //  thực hiện tạo hợp đồng từ kế hoạch thuê ngoài
              this.updateHidden = false;
              this.form.get("type").setValue("create");
              this.onResize();
              this.getContractStatus();
              this.getTypeContracts();
              this.getSignStatus();
              this.debounceOnSearch();
              this.getAllPlan();
              this.getULNL();
              // this.getAllYear(); quanghn cmt
              this.getYear();
              this.checkTile = 0;
              this.lst = res.data;
              this.pushDataToList();
              //
            }
          }
        }
      );
    }
  }

  pushDataToList() {
    if (
      this.lst[0].outsourcingContractId === undefined ||
      this.lst[0].outsourcingContractId === "undefined"
    ) {
      this.form.value.outsourcingContractId = "";
    } else {
      this.form.value.outsourcingContractId = this.lst[0].outsourcingContractId;
    }
    for (let i = 0; i < this.lst.length; i++) {
      const obj: any = {};
      (obj.totalRealityMD = ""),
        (obj.monthValue1 = ""),
        (obj.monthValue2 = ""),
        (obj.monthValue3 = ""),
        (obj.monthValue4 = ""),
        (obj.monthValue5 = ""),
        (obj.monthValue6 = ""),
        (obj.monthValue7 = ""),
        (obj.monthValue8 = ""),
        (obj.monthValue9 = ""),
        (obj.monthValue10 = ""),
        (obj.monthValue11 = ""),
        (obj.monthValue12 = "");

      let projectFlag = true;
      let totalMMOS: any = "";
      const lstOutsourcePlanId: any = [];

      obj.status = false;
      obj.flagMMOS = true;
      obj.flagOutSourcingPlan = true;

      obj.id = ""; // id bản ghi
      obj.partnerId = ""; // id đối tác
      obj.partnerCode = ""; // mã đối tác
      obj.partnerShortName = ""; // tên viết tắt đối tác
      obj.partnerName = ""; // tên đối tác

      obj.numberTTrPAKD = ""; //  Số TTr PAKD
      obj.estimateEffortStatus = ""; //  Trạng thái ULNL
      obj.cooperationYear = ""; //  năm hợp tác

      let lstbusinessOrgName = "";
      let lstbusinessOrgId = "";
      let lstamId = "";
      let lstamName = "";
      let lstproductionOrgName = "";
      let lstproductionOrgId = "";
      let lstpmName = "";
      let lstpmId = "";
      let lstPlanCode = "";
      const lstO = [];
      this.splitPlancode(this.lst[i].planId);

      for (let index1 = 0; index1 < this.listPlancode.length; index1++) {
        this.planOutsourcingApprove.forEach(item => {
          if (this.listPlancode[index1] === item.id.toString()) {
            // don vi kinh doanh va don vi san xuat
            lstPlanCode = this.concatStr(lstPlanCode, item.planCode);
            if (item.idBusinessUnit !== "" && item.idBusinessUnit != null) {
              lstbusinessOrgName = this.concatStr(
                lstbusinessOrgName,
                item.businessUnit
              );
              lstbusinessOrgId = this.concatStr(
                lstbusinessOrgId,
                item.idBusinessUnit
              );
            }

            if (item.idProductionUnit !== "" && item.idProductionUnit != null) {
              lstproductionOrgId = this.concatStr(
                lstproductionOrgId,
                item.idProductionUnit
              );
              lstproductionOrgName = this.concatStr(
                lstproductionOrgName,
                item.productUnit
              );
            }

            const objj = {
              softwareDevelopmentID: item.id,
              planCode: item.planCode
            };
            lstOutsourcePlanId.push(item.id);
            lstO.push(objj);

            if (item.mmos !== null) {
              totalMMOS = Number(totalMMOS) + item.mmos;
            }
            // dau moi kinh doanh dau moi san xuat
            this.listProject.forEach(itemproject => {
              if (itemproject.projectCode === this.lst[i].idProject) {
                if (itemproject.am !== "" && itemproject.am !== null) {
                  lstamId = this.concatStr(lstamId, itemproject.am);
                  lstamName = this.concatStr(lstamName, itemproject.amName);
                }

                if (itemproject.pm !== "" && itemproject.pm != null) {
                  lstpmId = this.concatStr(lstpmId, itemproject.pm);
                  lstpmName = this.concatStr(lstpmName, itemproject.pmName);
                }

                if (projectFlag) {
                  const dataDefaultProject = {
                    id: itemproject.id,
                    projectCode: itemproject.projectCode,
                    projectName: itemproject.projectName
                  };
                  obj.projectId = itemproject.id;
                  obj.listUnit$ = of([dataDefaultProject]);
                  projectFlag = false;
                }
              }
            });
          }
        });
        obj.outsourcePlans = lstO;
      }
      // this.plandMMOSBlank = lstPlanCode;
      // if (this.plandMMOSBlank !== '') {
      //   this.plandMMOSBlank = this.plandMMOSBlank.substring(0, this.plandMMOSBlank.length - 1);
      // }
      obj.outsourcePlanId = lstOutsourcePlanId;
      lstPlanCode = this.check2(lstPlanCode);
      obj.lstOutsourcePlanId = "," + this.lst[i].planId + ","; // danh sách id kế hoạch thuê ngoài
      obj.lstPlanCode = lstPlanCode; // danh sách code kế hoạch thuê ngoài

      lstbusinessOrgName = this.check2(lstbusinessOrgName);
      lstbusinessOrgId = this.check2(lstbusinessOrgId);

      lstproductionOrgName = this.check2(lstproductionOrgName);
      lstproductionOrgId = this.check2(lstproductionOrgId);

      lstamId = this.check2(lstamId);
      lstamName = this.check2(lstamName);

      lstpmName = this.check2(lstpmName);
      lstpmId = this.check2(lstpmId);

      obj.businessOrgName = this.check3(lstbusinessOrgName);
      obj.lstbusinessOrgId = this.check3(lstbusinessOrgId);
      obj.lstbusinessOrgName = this.check3(lstbusinessOrgName);

      obj.lstamId = this.check3(lstamId);
      obj.amName = this.check3(lstamName);
      obj.lstamName = this.check3(lstamName);

      obj.lstproductionOrgId = this.check3(lstproductionOrgId);
      obj.productionOrgName = this.check3(lstproductionOrgName);
      obj.lstproductionOrgName = this.check3(lstproductionOrgName);

      obj.lstpmId = this.check3(lstpmId);
      obj.pmName = this.check3(lstpmName);
      obj.lstpmName = this.check3(lstpmName);

      // tong mm tham dinh
      if (totalMMOS !== "") {
        obj.totalAppraisedMM = this.check4(totalMMOS);
        this.totalMMOSContact =
          Number(this.totalMMOSContact) + Number(totalMMOS);
      } else {
        obj.totalAppraisedMM = "0";
      }

      obj.totalSaveMM = this.check4(totalMMOS); //  MM còn lại

      this.params.actualEffortList.push(obj);
      this.numRecord = this.params.actualEffortList.length;
      if (this.totalMMOSContact !== "") {
        this.form.get("totalMM").setValue(this.check4(this.totalMMOSContact));
      } else {
        this.form.get("totalMM").setValue(0);
      }

      /*
      obj.status = false;
      obj.flagMMOS = true;
      obj.flagOutSourcingPlan = true;

      obj.id = ''; // id bản ghi
      obj.partnerId = ''; // id đối tác
      obj.partnerCode = ''; // mã đối tác
      obj.partnerShortName = ''; // tên viết tắt đối tác
      obj.partnerName = ''; // tên đối tác
      obj.projectId = this.lst[i].idProject; // mã dự án
      const dataDefaultProject = {
        id: this.lst[i].idProject,
        projectCode: this.lst[i].projectCode,
        projectName: this.lst[i].projectName
      };
      obj.listUnit$ = of([dataDefaultProject]); //  mã dự án
      this.contractManagerService.getAllPlanFollowApprove(this.lst[i].idProject).then(res => {
        this.params.actualEffortList[i].outsourcePlans = res['data'];
      });
      if (lstPlanId !== null) {
        const lsttplanId = this.check3(this.lst[i].planId);
        const lsttplanCode = this.check3(this.lst[i].planCode);
        let lstO = [];
        const arrLsttplanId = lsttplanId.split(',');
        const arrlsttplanCode = lsttplanCode.split(',');
        for (let index = 0; index < arrLsttplanId.length; index++) {
          const objj = {
            softwareDevelopmentID: arrLsttplanId[index].id,
            planCode: arrlsttplanCode[index].planCode
          };
          lstO.push(objj);
        }
        obj.outsourcePlanId = JSON.parse('[' + lsttplanId + ']');
        obj.outsourcePlans = lstO;
        obj.numberTTrPAKD = ''; //  Số TTr PAKD
        obj.estimateEffortStatus = ''; //  Trạng thái ULNL
        obj.cooperationYear = ''; //  năm hợp tác
        obj.totalAppraisedMM = this.check4(this.lst[i].totalAppraisedMM); //  Tổng MM đã thẩm định
        const numTotalAppraisedMM = this.checkValue(this.lst[i].totalAppraisedMM);
        const numTotalUsedMM = this.checkValue(this.lst[i].totalUsedMM);
        obj.totalSaveMM = this.check4(Number(numTotalAppraisedMM) - Number(numTotalUsedMM)); //  MM còn lại
        obj.totalRealityMM = this.lst[i].totalUsedMM === undefined ? 0 : this.check4(this.lst[i].totalUsedMM); //  MM sử dụng thực tế

        obj.lstOutsourcePlanId = this.lst[i].planId; // danh sách id kế hoạch thuê ngoài
        obj.lstPlanCode = this.lst[i].planCode; // danh sách code kế hoạch thuê ngoài

        obj.businessOrgName = this.check3(this.lst[i].lstbusinessOrgName);
        obj.lstbusinessOrgName = this.check3(this.lst[i].lstbusinessOrgName);
        obj.lstbusinessOrgId = this.check3(this.lst[i].lstbusinessOrgId);

        obj.lstamId = this.check3(this.lst[i].lstamId);
        obj.amName = this.check3(this.lst[i].lstamName);
        obj.lstamName = this.check3(this.lst[i].lstamName);

        obj.lstproductionOrgId = this.check3(this.lst[i].lstproductionOrgId);
        obj.productionOrgName = this.check3(this.lst[i].lstproductionOrgName);
        obj.lstproductionOrgName = this.check3(this.lst[i].lstproductionOrgName);

        obj.lstpmId = this.check3(this.lst[i].lstpmId);
        obj.pmName = this.check3(this.lst[i].lstpmName);
        obj.lstpmName = this.check3(this.lst[i].lstpmName);

        this.params.actualEffortList.push(obj);
        this.numRecord = this.params.actualEffortList.length;
        this.arrPage();
        this.loadList();

      }
      */
    }
    this.totalMMOSContact = "";
    this.arrPage();
    this.loadList();
  }

  concatStr(strOld: string, strSub: string): any {
    if (strOld !== "") {
      return strOld + strSub + ",";
    } else {
      return strOld + strSub + ",";
    }
  }

  // trangnc lấy danh sách trạng thái ký
  getSignStatus() {
    this.contractManagerService
      .getSignStatusOrContractStatus("TTK")
      .subscribe(res => (this.signatureStatusList = res));
  }

  // trangnc lấy danh sách loại hợp đồng
  getTypeContracts() {
    this.contractManagerService
      .getSignStatusOrContractStatus("LHD")
      .subscribe(res => (this.contractTypeList = res));
  }

  // trangnc lấy danh sách trạng thái hợp đồng
  getContractStatus() {
    this.contractManagerService
      .getSignStatusOrContractStatus("TTHD")
      .subscribe(res => (this.contractStatusList = res));
  }

  //  trangnc lấy danh sách	Trạng thái thẩm định ULNL
  getULNL() {
    this.contractManagerService
      .getSignStatusOrContractStatus("ULNL")
      .subscribe(res => (this.effortStatusList = res));
  }

  onchangePartner(event) {}

  //  trangnc
  private buidForm() {
    this.form = this.formBuilder.group({
      id: "", //  id bản ghi
      numContract: "", // Số hợp đồng
      signatureStatus: 18, //  trạng thái ký
      ttrpakdNumber: "", //  số TTrParkd
      contractStatus: 23, //  trạng thái hợp đồng
      contractType: "", //  loại hợp đồng
      startTime: "", //  thời gian bắt đầu
      endTime: "", //  thời gian kết thúc
      signDate: "", //  ngày ký hợp đồng
      // totalMMPayed: null,
      totalOwnedMM: 0, //  tổng MM thuê ngoài
      contractValue: "", //  giá trị hợp đồng
      ownedAmount: "", //  Số tiền còn nợ
      contractDescription: "", //  thông tin chung hợp đồng
      note: "", //  ghi chú
      price: "", //  đơn giá
      totalAccumulatedMM: "", //  Tổng MM sử dụng luỹ kế
      totalMMPayed: "", //  Tổng MM đã thanh toán
      totalMM: 0, //  tổng MM thuê ngoài
      type: "", //  kiểu
      outsourcingContractId: "", //  id hợp đồng
      actualEffortList: [], //  thông tin năng lực đối tác
      partnerJoinList: [] //  đối tác tham gia
    });
  }

  cloneObject(res: any) {
    this.objCloneAlert.id = res.id;
    this.objCloneAlert.partnerId = res.partnerId;
    this.objCloneAlert.partnerCode = res.partnerCode;
    this.objCloneAlert.signatureStatus = res.signatureStatus;
    this.objCloneAlert.ttrpakdNumber = res.ttrpakdNumber;
    this.objCloneAlert.contractStatus = res.contractStatus;
    this.objCloneAlert.contractType = res.contractType;
    //this.objCloneAlert.createDate = res.createDate;
    this.objCloneAlert.startTime = res.startTime;
    this.objCloneAlert.endTime = res.endTime;
    this.objCloneAlert.totalMM = res.totalMM;
    this.objCloneAlert.totalMMPayed = res.totalMMPayed;
    //this.objCloneAlert.totalOwnedMM = Number(res.totalMM) - Number(res.totalMMPayed);
    this.objCloneAlert.mmSumLK = res.mmSumLK;
    this.objCloneAlert.price = res.price;
    this.objCloneAlert.contractValue = res.contractValue;
    this.objCloneAlert.getContractDescription = res.getContractDescription;
    this.objCloneAlert.getContractDescription = res.note;
    this.arrObjCloneAlert = this.params.actualEffortList;
  }

  objForm() {
    const val = this.form.value;
    this.objCloneForm.id = val.id;
    this.objCloneForm.partnerId = val.partnerId;
    this.objCloneForm.partnerCode = val.partnerCode;
    this.objCloneForm.signatureStatus = val.signatureStatus;
    this.objCloneForm.ttrpakdNumber = val.ttrpakdNumber;
    this.objCloneForm.contractStatus = val.contractStatus;
    this.objCloneForm.contractType = val.contractType;
    // this.objCloneForm.createDate = val.createDate;
    this.objCloneForm.startTime = val.startTime;
    this.objCloneForm.endTime = val.endTime;
    this.objCloneForm.totalMM = val.totalMM;
    this.objCloneForm.totalMMPayed = val.totalMMPayed;
    // this.objCloneForm.totalOwnedMM = Number(val.totalMM) - Number(val.totalMMPayed);
    this.objCloneForm.mmSumLK = val.totalAccumulatedMM;
    this.objCloneForm.price = val.price;
    this.objCloneForm.contractValue = val.contractValue;
    this.objCloneForm.getContractDescription = val.getContractDescription;
    this.objCloneForm.getContractDescription = val.note;
  }

  onCkeck() {
    this.objForm();
    if (
      JSON.stringify(this.objCloneAlert) === JSON.stringify(this.objCloneForm)
    ) {
      if (
        this.arrObjCloneAlert.length === this.params.actualEffortList.length
      ) {
        const size = this.arrObjCloneAlert.length;
        for (let i = 0; i < size; i++) {
          if (
            JSON.stringify(this.arrObjCloneAlert[i]) !==
            JSON.stringify(this.params.actualEffortList[i])
          ) {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  //  trangnc thực hiện đổ data tới actualEffortList
  getDataToactualEffortList(id: any) {
    this.contractManagerService.getListBycontractID(id).subscribe(res => {
      this.lst = res.data;
      this.convertDataLstToactualEffortList();
    });
  }

  async convertDataLstToactualEffortList() {
    if (
      this.lst[0].outsourcingContractId === undefined ||
      this.lst[0].outsourcingContractId === "undefined"
    ) {
      this.form.value.outsourcingContractId = "";
    } else {
      this.form.value.outsourcingContractId = this.lst[0].outsourcingContractId;
    }
    for (let i = 0; i < this.lst.length; i++) {
      const obj: any = {};
      if (
        this.lst[i].monthValues !== null &&
        this.lst[i].monthValues !== undefined
      ) {
        const res = this.lst[i].monthValues.split(";");
        let sum = 0;
        for (let index = 0; index < res.length; index++) {
          sum += Number(res[index]);
        }
        (obj.totalRealityMD = sum > 0 ? this.check4(sum) : ""),
          (obj.monthValue1 = this.check4(res[0])),
          (obj.monthValue2 = this.check4(res[1])),
          (obj.monthValue3 = this.check4(res[2])),
          (obj.monthValue4 = this.check4(res[3])),
          (obj.monthValue5 = this.check4(res[4])),
          (obj.monthValue6 = this.check4(res[5])),
          (obj.monthValue7 = this.check4(res[6])),
          (obj.monthValue8 = this.check4(res[7])),
          (obj.monthValue9 = this.check4(res[8])),
          (obj.monthValue10 = this.check4(res[9])),
          (obj.monthValue11 = this.check4(res[10])),
          (obj.monthValue12 = this.check4(res[11]));
      }
      let lstPlanId = this.lst[i].lstOutsourcePlanId;
      const projectid = this.lst[i].projectId;

      if (this.form.value.type === "create") {
        obj.status = false;
      } else {
        obj.status = true;
        obj.flagOutSourcingPlan = true;
        obj.flagMMOS = true;
      }
      obj.id = this.lst[i].id; // id bản ghi
      obj.partnerId = this.lst[i].partnerId; // id đối tác
      obj.partnerCode = this.lst[i].partnerCode; // mã đối tác
      obj.partnerShortName = this.lst[i].partnerShortName; // tên viết tắt đối tác
      obj.partnerName = this.lst[i].partnerName; // tên đối tác
      obj.projectCode = this.lst[i].projectCode;
      obj.projectId = this.lst[i].projectId; // mã dự án
      obj.projectName = this.lst[i].projectName;
      const dataDefaultProject = {
        id: this.lst[i].projectId,
        projectCode: this.lst[i].projectCode,
        projectName: this.lst[i].projectName
      };
      obj.listUnit$ = of([dataDefaultProject]); //  mã dự án
      // this.getPlanByProjectId(this.lst[i].projectId); //
      // obj.outsourcePlans = this.outsourcePlans;
      if (lstPlanId !== null) {
        this.contractManagerService
          .doInfoByLstPlanId(lstPlanId, projectid)
          .subscribe(res => {
            let lstO: any = [];
            let lstOutsourcePlanId: any = [];
            let lstbusinessOrgName = "";
            let lstbusinessOrgId = "";
            let lstamId = "";
            let lstamName = "";
            let lstproductionOrgName = "";
            let lstproductionOrgId = "";
            let lstpmName = "";
            let lstpmId = "";
            res["data"].forEach(element => {
              const objj = {
                softwareDevelopmentID: element.id,
                planCode: element.planCode
              };
              lstOutsourcePlanId.push(element.id);
              lstO.push(objj);
              lstbusinessOrgName += this.doListData(element.businessUnit);
              lstbusinessOrgId += this.doListData(element.idBusinessUnit);
              lstamId += this.doListData(element.amId);
              lstamName += this.doListData(element.am);
              lstproductionOrgName += this.doListData(element.productUnit);
              lstproductionOrgId += this.doListData(element.idProductionUnit);
              lstpmName += this.doListData(element.pm);
              lstpmId += this.doListData(element.pmId);
            });
            lstbusinessOrgName = this.check2(lstbusinessOrgName);
            lstbusinessOrgId = this.check2(lstbusinessOrgId);
            lstamId = this.check2(lstamId);
            lstamName = this.check2(lstamName);
            lstproductionOrgName = this.check2(lstproductionOrgName);
            lstproductionOrgId = this.check2(lstproductionOrgId);
            lstpmName = this.check2(lstpmName);
            lstpmId = this.check2(lstpmId);
            obj.outsourcePlanId = lstOutsourcePlanId;
            obj.outsourcePlans = lstO;
            obj.numberTTrPAKD =
              this.lst[i].numTTrPakd === undefined
                ? ""
                : this.lst[i].numTTrPakd; //  Số TTr PAKD
            obj.estimateEffortStatus =
              this.lst[i].estimateEffortStatus === undefined
                ? ""
                : this.lst[i].estimateEffortStatus; //  Trạng thái ULNL
            obj.cooperationYear =
              this.lst[i].cooperationYear === undefined
                ? 0
                : this.lst[i].cooperationYear; //  năm hợp tác
            obj.totalAppraisedMM =
              this.lst[i].totalAppraisedMM === undefined
                ? ""
                : this.check4(this.lst[i].totalAppraisedMM); //  Tổng MM đã thẩm định
            const numTotalAppraisedMM = this.checkValue(
              this.lst[i].totalAppraisedMM
            );
            const numTotalUsedMM = this.checkValue(this.lst[i].totalUsedMM);
            obj.totalSaveMM = this.check4(
              Number(numTotalAppraisedMM) - Number(numTotalUsedMM)
            ); //  MM còn lại

            obj.totalRealityMM =
              this.lst[i].totalUsedMM === undefined
                ? 0
                : this.check4(this.lst[i].totalUsedMM); //  MM sử dụng thực tế

            obj.businessOrgName = this.check3(lstbusinessOrgName);
            obj.lstbusinessOrgId = this.check3(lstbusinessOrgId);
            obj.lstamId = this.check3(lstamId);
            obj.amName = this.check3(lstamName);
            obj.lstproductionOrgId = this.check3(lstproductionOrgId);
            obj.productionOrgName = this.check3(lstproductionOrgName);
            obj.lstpmId = this.check3(lstpmId);
            obj.pmName = this.check3(lstpmName);

            this.params.actualEffortList.push(obj);
            this.numRecord = this.params.actualEffortList.length;
            this.arrPage();
            this.loadList();
          });
      } else {
        // lấy theo mã dự án
        this.contractManagerService
          .getbusinessByProjectId(projectid)
          .subscribe(res => {
            if (res["data"].length > 0) {
              obj.outsourcePlanId = "";
              obj.outsourcePlans = "";
              obj.numberTTrPAKD =
                this.lst[i].numTTrPakd === undefined
                  ? ""
                  : this.lst[i].numTTrPakd; //  Số TTr PAKD
              obj.estimateEffortStatus =
                this.lst[i].estimateEffortStatus === undefined
                  ? ""
                  : this.lst[i].estimateEffortStatus; //  Trạng thái ULNL
              obj.cooperationYear =
                this.lst[i].cooperationYear === undefined
                  ? 0
                  : this.lst[i].cooperationYear; //  năm hợp tác
              obj.totalAppraisedMM =
                this.lst[i].totalAppraisedMM === undefined
                  ? ""
                  : this.check4(this.lst[i].totalAppraisedMM); //  Tổng MM đã thẩm định
              const numTotalAppraisedMM = this.checkValue(
                this.lst[i].totalAppraisedMM
              );
              const numTotalUsedMM = this.checkValue(this.lst[i].totalUsedMM);
              obj.totalSaveMM = this.check4(
                Number(numTotalAppraisedMM) - Number(numTotalUsedMM)
              ); //  MM còn lại
              obj.totalRealityMM =
                this.lst[i].totalUsedMM === undefined
                  ? 0
                  : this.check4(this.lst[i].totalUsedMM); //  MM sử dụng thực tế

              obj.businessOrgName = res["data"][0].businessOrgName;
              obj.lstbusinessOrgId = res["data"][0].businessOrg;
              obj.lstamId = res["data"][0].am;
              obj.amName = res["data"][0].amName;
              obj.lstproductionOrgId = res["data"][0].productionOrg;
              obj.productionOrgName = res["data"][0].productionOrgName;
              obj.lstpmId = res["data"][0].pm;
              obj.pmName = res["data"][0].pmName;

              // this.funcToList(i, res);
              this.params.actualEffortList.push(obj);
              this.numRecord = this.params.actualEffortList.length;
              this.arrPage();
              this.loadList();
            }
          });
      }
    }
  }

  check3(data: any) {
    data = data + "";
    if (data === "") {
      return "";
    } else {
      return data.substring(1, data.length - 1);
    }
  }

  check2(data: any) {
    let data2 = data + "";
    if (data2.trim() === "") {
      return data2;
    } else {
      return "," + data2;
    }
  }

  doListData(data) {
    if (data === null) {
      return "";
    } else {
      return data + ",";
    }
  }

  //  trangnc thực hiện đổ data tới đối tác tham gia
  getDataToPartnerJoinList(id: any) {
    this.contractManagerService
      .getListPartJoinBycontractID(id)
      .subscribe(res => {
        this.listPartJoinById = res.data;
        this.convertDataToJoinPartner(id);
      });
  }

  // convert data tới danh sách đối tác tham gia
  convertDataToJoinPartner(idContract) {
    const lengthJoin = this.listPartJoinById.length;
    if (lengthJoin > 0) {
      this.listPartJoinById.forEach(element => {
        const obj: any = {};
        (obj.id = element.id), // id bản ghi
          (obj.idContract = idContract), // id Contract
          (obj.partnerId = element.partnerId), // id đối tác
          (obj.partnerCode = element.partnerCode), // mã đối tác
          (obj.partnerName = element.partnerName), // tên đối tác
          (obj.partnerShortName = element.partnerShortName),
          (obj.outsourcingOrganizationId = element.outsourcingOrganizationId), // đơn vị thuê ngoài id
          (obj.outsourcingOrganizationName =
            element.outsourcingOrganizationCode), // đơn vị thuê ngoài name
          (obj.nameClue = element.nameClue), // đầu mối đề nghị hợp tác
          (obj.outsourcingMMTotal = this.check4(element.outsourcingMMTotal)), // tổng MM thuê ngoài
          (obj.mmUsing = this.check4(element.mmUsing)), // MM sử dụng lũy kế
          (obj.mmPayed = this.check4(element.mmPayed)), // MM đã thanh toán
          (obj.mmOwed = this.check4(element.mmOwed)), // MM còn nợ
          (obj.moneyOwed =
            element.moneyOwed === null ||
            element.moneyOwed === "null" ||
            element.moneyOwed === ""
              ? ""
              : this.check4(element.moneyOwed)); // Số tiền còn nợ

        if (this.form.value.type === "create") {
          obj.status = false;
        } else {
          obj.status = true;
        }

        // Mã đối tác
        const listJoinDT = {
          id: element.partnerId,
          partnerCode: element.partnerCode,
          partnerName: element.partnerName,
          partnerShortName: element.partnerShortName
        };
        // Đơn vị thuê ngoài
        const listJoinDVTN = {
          id: element.outsourcingOrganizationId,
          code: element.outsourcingOrganizationCode,
          name: element.outsourcingOrganizationName
        };

        //  call MÃ ĐỐI TÁC
        obj.listJoinDT$ = of([listJoinDT]);
        //  call ĐƠN VỊ THUÊ NGOÀI
        if (element.outsourcingOrganizationId !== null) {
          obj.listJoinDVTN$ = of([listJoinDVTN]);
        }
        //
        this.params.partnerJoinList.push(obj);

        this.numRecord2 = this.params.partnerJoinList.length;
        this.arrPage(1);
        this.loadList(1);
      });
    }

    this.actualEffortListSort = JSON.parse(
      JSON.stringify(this.params.partnerJoinList)
    );
    this.actualEffortListSort = this.actualEffortListSort.sort((a, b) =>
      a.partnerCode.toLowerCase() > b.partnerCode.toLowerCase() ? 1 : -1
    );
  }

  loadDataOnSearchUnit2(term) {
    const words = term.split(";");
    const wordSearch = words[0];
    const index = words[1];
    this.contractManagerService
      .doSearchEmailOrName(wordSearch)
      .subscribe((res: HttpResponse<any[]>) => {
        if (res["data"].length > 0) {
          this.params.actualEffortList[index].listDMDVHT$ = of(res["data"]);
          this.params.actualEffortList2[index].listDMDVHT$ = of(res["data"]);
        } else {
          this.params.actualEffortList[index].listDMDVHT$ = of([]);
          this.params.actualEffortList2[index].listDMDVHT$ = of([]);
        }
      });
  }

  loadDataOnSearchUnit1(term) {
    const words = term.split(";");
    const wordSearch = words[0];
    const index = words[1];
    //  search cho mã dự án
    this.contractManagerService
      .getAllProjectCode(wordSearch)
      .subscribe((res: HttpResponse<any[]>) => {
        if (res["data"].length > 0) {
          this.params.actualEffortList[index].listUnit$ = of(res["data"]);
          this.params.actualEffortList2[index].listUnit$ = of(res["data"]);
        } else {
          this.params.actualEffortList[index].listUnit$ = of([]);
          this.params.actualEffortList2[index].listUnit$ = of([]);
        }
      });
  }

  // trangnc
  replaceSeparate(value) {
    const temp = String(value).replace(this.regexReplaceSeparate, "");
    return Number(temp.replace(this.regexReplacePoint, ".").trim());
  }

  //  trangnc thực hiện đổ data tới form (khi người dùng click xem)
  private pushDataToForm(res: any, action: String) {
    this.form.get("id").setValue(res.id); //  id bản ghi (hợp đồng)
    this.form.get("numContract").setValue(res.numContract); // số hợp đồng
    // this.form.get('partnerId').setValue(res.partnerId); //  id đối tác
    // this.form.get('partnerCode').setValue(res.partnerCode); //  mã đối tác

    this.form.get("signatureStatus").setValue(res.signatureStatus); //  trạng thái ký
    // this.form.get('ttrpakdNumber').setValue(res.ttrpakdNumber); //  số TTrParkd
    let contractStatus = res.contractStatus;
    if (res.contractStatus === null) {
      contractStatus = 23;
    }
    this.form.get("contractStatus").setValue(contractStatus); //  trạng thái hợp đồng
    let contractType = res.contractType;
    if (res.contractType === null) {
      contractType = "";
    }
    this.form.get("contractType").setValue(contractType); //  loại hợp đồng
    // this.form.get('signDate').setValue(res.createDate); //  ngày ký hợp đồng
    this.form.get("startTime").setValue(res.startTime); //  thời gian bắt đầu
    this.form.get("endTime").setValue(res.endTime); //  thời gian kết thúc

    //let totalMM = this.validateNumberChange(res.totalMM); // quanghn comment code
    this.form.get("totalMM").setValue(this.check4(res.totalMM)); //  tổng MM thuê ngoài

    // let totalMMPayed = this.validateNumberChange(res.totalMMPayed);
    this.form.get("totalMMPayed").setValue(this.check4(res.totalMMPayed)); //  Tổng MM đã thanh toán

    //  objView.ownedAmount = res.ownedAmount, //   Số tiền còn nợ (tự tính) totalOwnedMM
    const totalOwnedMM2 = Number(res.totalMM) - Number(res.totalMMPayed);

    // if (res.totalMMPayed !== null && res.totalMMPayed !== '') {
    this.totalOwnedMM = this.validateNumberChange(totalOwnedMM2); //  MM còn nợ (MM thuê ngoài - MM đã thanh toán)
    this.form.get("totalOwnedMM").setValue(this.check4(totalOwnedMM2)); //  MM còn nợ (MM thuê ngoài - MM đã thanh toán)
    this.totalOwnedMM = this.check4(totalOwnedMM2);
    // }
    // this.price = res.price;
    // let mmSumLK = this.validateNumberChange(res.mmSumLK);
    if (Number(res.mmSumLK) > 0) {
      this.isCheckMMLK = true;
      this.form.get("totalAccumulatedMM").setValue(this.check4(res.mmSumLK)); //  Tổng MM sử dụng luỹ kế
    } else {
      this.isCheckMMLK = false;
      this.form.get("totalAccumulatedMM").setValue("");
    }

    let price = this.validateNumberChange(res.price);
    this.form.get("price").setValue(res.price); //  đơn giá

    if (res.amountOwed === null) {
      this.form.get("ownedAmount").setValue("");
      this.ownedAmount = "";
    } else {
      let amountOwed = this.validateNumberChange(res.amountOwed);
      this.form.get("ownedAmount").setValue(this.check4(res.amountOwed)); //  Số tiền còn nợ (MM còn nợ * đơn giá)
      // this.ownedAmount = this.validateNumberChange(res.amountOwed); // Số tiền còn nợ
      this.ownedAmount = this.check4(res.amountOwed); // Số tiền còn nợ
    }
    this.form.get("contractValue").setValue(this.check4(res.contractValue)); //  giá trị hợp đồng
    this.contractValue = this.check4(res.contractValue); //  giá trị hợp đồng

    this.form.get("contractDescription").setValue(res.getContractDescription); //  thông tin chung hợp đồng
    this.form.get("note").setValue(res.note); //  ghi chú
    this.form.get("type").setValue("update");
    //  partnerName
    const dataDefault = {
      id: res.partnerId, //  id đối tác
      partnerCode: res.partnerCode, //  mã đối tác
      partnerName: res.partnerName //  tên đối tác
    };
    this.listDT$ = of([dataDefault]);
    // ẩn các trường nếu là view
    if (action === "view") {
      this.form.get("numContract").disable(); // số hợp đồng
      this.form.get("signatureStatus").disable(); //  trạng thái
      this.form.get("ttrpakdNumber").disable(); //  số TTrParkd
      this.form.get("contractStatus").disable(); //  trạng thái hợp đồng
      this.form.get("contractType").disable(); //  loại hợp đồng
      this.hidden = true;
      this.form.get("totalMM").disable();
      this.form.get("totalMMPayed").disable();
      this.form.get("totalOwnedMM").disable(); //  MM còn nợ
      this.form.get("price").disable(); //  đơn giá
      this.form.get("ownedAmount").disable(); //  Số tiền còn nợ
      this.form.get("contractValue").disable(); //  giá trị hợp đồng
      this.form.get("contractDescription").disable(); //  thông tin chung hợp đồng
      this.form.get("note").disable(); //  ghi chú
      this.form.get("totalAccumulatedMM").disable();
    } else {
      //  cho phép sửa nếu là update
      this.form.get("numContract").enable(); // số hợp đồng
      this.form.get("signatureStatus").enable(); //  trạng thái
      this.form.get("ttrpakdNumber").enable(); //  số TTrParkd
      this.form.get("contractStatus").enable(); //  trạng thái hợp đồng
      this.form.get("contractType").enable(); //  loại hợp đồng
      this.hidden = false;
      this.form.get("totalMM").enable();
      this.form.get("totalMMPayed").enable();
      this.form.get("totalOwnedMM").enable(); //  MM còn nợ
      this.form.get("price").enable(); //  đơn giá
      if (totalOwnedMM2 > 0 && Number(res.price) > 0) {
        this.form.get("ownedAmount").disable(); //  Số tiền còn nợ
      } else {
        this.form.get("ownedAmount").enable(); //  Số tiền còn nợ
      }
      if (Number(res.price) > 0) {
        this.form.get("contractValue").disable(); //  giá trị hợp đồng
      } else {
        this.form.get("contractValue").enable(); //  giá trị hợp đồng
      }
      this.form.get("contractDescription").enable(); //  thông tin chung hợp đồng
      this.form.get("note").enable(); //  ghi chú
      this.form.get("totalAccumulatedMM").enable();
    }
  }

  //  trangnc
  getDate(value) {
    return new Date(value).getTime();
  }

  //  trangnc
  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  isNotEmpty(value) {
    return value !== undefined && value !== null && value !== "";
  }

  onSum(effort) {
    effort.totalMD = 0;
    effort.monthValues = "";
    effort.monthList.forEach((mo: any) => {
      effort.totalMD += this.isNotEmpty(mo.m) ? mo.m : 0;
      effort.monthValues += mo.m + ";";
    });
    effort.monthValues = effort.monthValues.substr(
      0,
      effort.monthValues.length - 1
    );
    effort.totalUsedMM =
      Math.round((effort.totalMD ? effort.totalMD / 22 : 0) * 100) / 100;
  }

  checkDate() {
    this.messageDate = "";
    const value = this.form.value;
    const endTime = value.endTime;
    const startTime = value.startTime;
    if (
      endTime !== "" &&
      startTime !== "" &&
      endTime !== undefined &&
      startTime !== undefined &&
      endTime !== null &&
      startTime !== null
    ) {
      if (this.getDate(value.startTime) - this.getDate(value.endTime) > 0) {
        this.messageDate =
          "Thời gian kết thúc phải lớn hơn hoặc bằng Thời gian bắt đầu";
        //this.buttonDisable = true;
        return 1;
      } else {
        this.messageDate = "";
        //this.buttonDisable = false;
      }
    }
  }

  // check MaxLength
  checkMaxLenght(event, length) {
    const size = event.target.value.toString().length;
    if (size <= Number(length - 1)) {
      return true;
    } else {
      return false;
    }
  }

  //  trangnc code
  onInputChange(event) {
    // update start 16/06/2020
    this.clErrorTtal = "";
    this.error = "";
    this.message = "";

    // update end 16/06/2020
    //  kiểm tra chuoi có dau ','
    const value = event.target.value;
    if (value === "0,_") {
      event.target.value = value.replace("_", "");
    }
    const string = String(value).split("");
    if (value.length > 1 && Number(string[0]) === 0 && string[1] !== ",") {
      event.target.value = String(value).replace("0", "");
    }

    if (value.toString().includes(",") && event.key === ",") {
      //  không cho phép nhập 2 dấu phẩy ','
      return false;
    } else if (value === "" && event.key === ",") {
      //  không cho phép nhập ',' khi bắt đầu
      return false;
    } else {
      //  không cho phép chữ
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode === 44) {
        return true;
      } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      } else {
        return true;
      }
    }
  }

  onInputChangeMM(event) {
    const value = event.target.value;
    // không cho nhập số 0 đầu tiên
    if (value === "" && event.key === "0") {
      return false;
    }
    if (value.toString().includes(".") && event.key === ".") {
      //  không cho phép nhập 2 dấu chấm
      return false;
    } else if (value === "" && event.key === ".") {
      //  không cho phép nhập '.' khi bắt đầu
      return false;
    } else {
      //  không cho phép chữ
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode === 46) {
        return true;
      } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      } else return true;
    }
  }

  onInputChangeMM2(event, length) {
    const value = event.target.value;
    // không cho nhập số 0 đầu tiên
    if (value === "" && event.key === "0") {
      return false;
    }
    if (value.toString().includes(".") && event.key === ".") {
      //  không cho phép nhập 2 dấu chấm
      return false;
    } else if (value === "" && event.key === ".") {
      //  không cho phép nhập '.' khi bắt đầu
      return false;
    } else {
      //  không cho phép chữ
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode === 46) {
        return true;
      } else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      } else return true;
    }
  }

  //
  validateTotal() {
    const sizeTotal = this.form.value.totalMM.length;
    if (sizeTotal <= 0) {
      this.clErrorTtal = "has-error";
      this.errorMMTN = "totalMM";
      this.message = "Tổng MM thuê ngoài là bắt buộc";
    } else {
      this.clErrorTtal = "";
      this.errorMMTN = "";
      this.message = "";
    }
  }

  // trangnc
  onChangeTotalMD(index2: any) {
    //  tổng MD
    //  get value months
    let index = (this.currentPage - 1) * this.numberPerPage + index2;

    let valM1 = this.checkValue(
      this.params.actualEffortList[index].monthValue1
    );
    valM1 = this.validateNumberChange(valM1);
    // valM1 = this.validateNumber(valM1);
    let valM2 = this.checkValue(
      this.params.actualEffortList[index].monthValue2
    );
    valM2 = this.validateNumberChange(valM2);
    let valM3 = this.checkValue(
      this.params.actualEffortList[index].monthValue3
    );
    valM3 = this.validateNumberChange(valM3);
    // valM3 = this.validateNumber(valM3);
    let valM4 = this.checkValue(
      this.params.actualEffortList[index].monthValue4
    );
    valM4 = this.validateNumberChange(valM4);
    //valM4 = this.validateNumber(valM4);
    let valM5 = this.checkValue(
      this.params.actualEffortList[index].monthValue5
    );
    valM5 = this.validateNumberChange(valM5);
    // valM5 = this.validateNumber(valM5);
    let valM6 = this.checkValue(
      this.params.actualEffortList[index].monthValue6
    );
    valM6 = this.validateNumberChange(valM6);
    // valM6 = this.validateNumber(valM6);
    let valM7 = this.checkValue(
      this.params.actualEffortList[index].monthValue7
    );
    valM7 = this.validateNumberChange(valM7);
    // valM7 = this.validateNumber(valM7);
    let valM8 = this.checkValue(
      this.params.actualEffortList[index].monthValue8
    );
    valM8 = this.validateNumberChange(valM8);
    // valM8 = this.validateNumber(valM8);
    let valM9 = this.checkValue(
      this.params.actualEffortList[index].monthValue9
    );
    valM9 = this.validateNumberChange(valM9);
    // valM9 = this.validateNumber(valM9);
    let valM10 = this.checkValue(
      this.params.actualEffortList[index].monthValue10
    );
    valM10 = this.validateNumberChange(valM10);
    // valM10 = this.validateNumber(valM10);
    let valM11 = this.checkValue(
      this.params.actualEffortList[index].monthValue11
    );
    valM11 = this.validateNumberChange(valM11);
    // valM11 = this.validateNumber(valM11);
    let valM12 = this.checkValue(
      this.params.actualEffortList[index].monthValue12
    );
    valM12 = this.validateNumberChange(valM12);
    // valM12 = this.validateNumber(valM12);
    const sumMD =
      Number(valM1) +
      Number(valM2) +
      Number(valM3) +
      Number(valM4) +
      Number(valM5) +
      Number(valM6) +
      Number(valM7) +
      Number(valM8) +
      Number(valM9) +
      Number(valM10) +
      Number(valM11) +
      Number(valM12);
    let valtotalAppraisedMM = this.checkValue(
      this.params.actualEffortList[index].totalAppraisedMM
    );
    valtotalAppraisedMM = this.validateNumberChange(valtotalAppraisedMM);
    const valTotalRealityMD = this.formatAgain(sumMD);
    const valRealityMM = this.formatAgain(
      Number(Number(sumMD / 22).toFixed(2))
    );
    const valTotalSaveMM = this.formatAgain(
      Number(Number(valtotalAppraisedMM) - sumMD / 22).toFixed(2)
    );

    if (Number(sumMD) > 0) {
      this.params.actualEffortList[index].totalRealityMD = valTotalRealityMD; // tong md sd thuc te
    } else {
      this.params.actualEffortList[index].totalRealityMD = ""; // tong md sd thuc te
    }
    if (Number(sumMD / 22) > 0) {
      this.params.actualEffortList[index].totalRealityMM = valRealityMM; // tong mm su dung thuc te
    } else {
      this.params.actualEffortList[index].totalRealityMM = ""; // tong mm su dung thuc te
    }

    const valValTotalSaveMM = this.check4(valTotalSaveMM);
    const totalMMappraisedValue = this.params.actualEffortList[index]
      .totalAppraisedMM;
    if (totalMMappraisedValue !== "" && Number(sumMD) > 0) {
      this.params.actualEffortList[index].totalSaveMM = this.formatAgain(
        Number(valValTotalSaveMM)
      ); // tổng MM còn lại
    } else {
      this.params.actualEffortList[index].totalSaveMM = "";
    }
    //
    const length = this.params.actualEffortList.length;
    let total = 0;
    let totalLK = 0;
    for (let i = 0; i < length; i++) {
      const val = this.validateNumberChange(
        this.params.actualEffortList[i].totalAppraisedMM
      );
      total += Number(val);
      const val2 = this.validateNumberChange(
        this.params.actualEffortList[i].totalRealityMM
      );
      totalLK += Number(val2);
    }
    const valTotal = this.formatAgain(total);
    this.form.get("totalMM").setValue(valTotal); // tổng MM thuê ngoài
    const valTotalLK = this.formatAgain(parseFloat(totalLK.toFixed(2)));
    if (!this.isCheckMMLK && Number(sumMD) > 0) {
      this.form.get("totalAccumulatedMM").setValue(valTotalLK); //
    } else if (!this.isCheckMMLK && Number(sumMD) === 0) {
      this.form.get("totalAccumulatedMM").setValue(""); //
    }
    this.onChangeTotal();
  }

  //  trangnc
  setDecimal() {
    // // MM còn nợ đối tác tham gia
    // this.mmOwedJoin.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.mmOwedJoin.decimalSymbol = this.decimalPointSpace;
    // // MM còn nợ thông tin chung
    // this.totalOwnedMM2.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.totalOwnedMM2.decimalSymbol = this.decimalPointSpace;
    // // Tổng MM  thuê ngoài đối tác tham gia
    // this.totalMMJoin.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.totalMMJoin.decimalSymbol = this.decimalPointSpace;
    // //
    // this.totalMM.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.totalMM.decimalSymbol = this.decimalPointSpace;

    // //  this.price.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.price.decimalSymbol = this.decimalPointSpace;
    // //
    // this.contractVal.decimalSymbol = this.decimalPointSpace;
    // this.totalAppraisedMM.thousandsSeparatorSymbol = this.decimalPointSignSeparate;

    // this.totalAccumulatedMM.decimalSymbol = this.decimalPointSpace;

    // this.totalMMPayed.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.totalMMPayed.decimalSymbol = this.decimalPointSpace;

    // this.totalAppraisedMM.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.totalAppraisedMM.decimalSymbol = this.decimalPointSpace;
    // //  tháng 1 MM
    // this.monthValue1.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.monthValue1.decimalSymbol = this.decimalPointSpace;
    // //  tháng 2 MM
    // this.monthValue2.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.monthValue2.decimalSymbol = this.decimalPointSpace;
    // //  tháng 3 MM
    // this.monthValue3.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.monthValue3.decimalSymbol = this.decimalPointSpace;
    // //  tháng 4 MM
    // this.monthValue4.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.monthValue4.decimalSymbol = this.decimalPointSpace;
    // //  tháng 5 MM
    // this.monthValue5.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.monthValue5.decimalSymbol = this.decimalPointSpace;
    // //  tháng 6 MM
    // this.monthValue6.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.monthValue6.decimalSymbol = this.decimalPointSpace;
    // //  tháng 7 MM
    // this.monthValue7.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.monthValue7.decimalSymbol = this.decimalPointSpace;
    // //  tháng 8 MM
    // this.monthValue8.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.monthValue8.decimalSymbol = this.decimalPointSpace;
    // //  tháng 9 MM
    // this.monthValue9.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.monthValue9.decimalSymbol = this.decimalPointSpace;
    // //  tháng 10 MM
    // this.monthValue10.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.monthValue10.decimalSymbol = this.decimalPointSpace;
    // //  tháng 11 MM
    // this.monthValue11.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.monthValue11.decimalSymbol = this.decimalPointSpace;
    // //  tháng 12 MM
    // this.monthValue12.thousandsSeparatorSymbol = this.decimalPointSignSeparate;
    // this.monthValue12.decimalSymbol = this.decimalPointSpace;

    // this.regexReplaceSeparate = new RegExp('[' + this.decimalPointSignSeparate + ']*', 'g'); //  phan nghin
    // this.regexReplacePoint = new RegExp('[' + this.decimalPointSpace + ']', 'g'); //  thap phan
    this.createMask();
  }

  createMask() {
    // MM còn nợ đối tác tham gia
    this.mmOwedJoin = createNumberMask({ ...this.mmOwedJoin });
    // MM còn nợ (thông tin chung)
    this.totalOwnedMM2 = createNumberMask({ ...this.totalOwnedMM2 });
    // Tổng MM thuê ngoài (đối tác tham gia)
    this.totalMMJoin = createNumberMask({ ...this.totalMMJoin });
    //
    this.totalMM = createNumberMask({ ...this.totalMM });
    this.price = createNumberMask({ ...this.price });
    //
    this.contractVal = createNumberMask({ ...this.contractVal });

    this.totalAccumulatedMM = createNumberMask({ ...this.totalAccumulatedMM });
    this.totalMMPayed = createNumberMask({ ...this.totalMMPayed });
    this.totalAppraisedMM = createNumberMask({ ...this.totalAppraisedMM });
    //  tháng 1 MM
    this.monthValue1 = createNumberMask({ ...this.monthValue1 });
    //  tháng 2 MM
    this.monthValue2 = createNumberMask({ ...this.monthValue2 });
    //  tháng 3 MM
    this.monthValue3 = createNumberMask({ ...this.monthValue3 });
    //  tháng 4 MM
    this.monthValue4 = createNumberMask({ ...this.monthValue4 });
    //  tháng 5 MM
    this.monthValue5 = createNumberMask({ ...this.monthValue5 });
    //  tháng 6 MM
    this.monthValue6 = createNumberMask({ ...this.monthValue6 });
    //  tháng 7 MM
    this.monthValue7 = createNumberMask({ ...this.monthValue7 });
    //  tháng 8 MM
    this.monthValue8 = createNumberMask({ ...this.monthValue8 });
    //  tháng 9 MM
    this.monthValue9 = createNumberMask({ ...this.monthValue9 });
    //  tháng 10 MM
    this.monthValue10 = createNumberMask({ ...this.monthValue10 });
    //  tháng 11 MM
    this.monthValue11 = createNumberMask({ ...this.monthValue11 });
    //  tháng 12 MM
    this.monthValue12 = createNumberMask({ ...this.monthValue12 });
  }

  getValueOfField(item) {
    if (
      this.form.get(item).value === "" ||
      this.form.get(item).value === null ||
      this.form.get(item).value === "undefined" ||
      this.form.get(item).value === undefined
    ) {
      return 0;
    } else {
      const value = this.form.get(item).value;
      if (value === 0) {
        return value;
      }
      return this.validateNumberChange(value);
    }
  }

  // format New -> format Old
  formatNewToOld(item) {
    if (
      this.form.get(item).value === "" ||
      this.form.get(item).value === null ||
      this.form.get(item).value === "null" ||
      this.form.get(item).value === "undefined" ||
      this.form.get(item).value === undefined
    ) {
      return 0;
    } else {
      // 100,000,00.55
      let value = this.form.get(item).value;
      value = value + "";
      if (value === 0) {
        return value;
      }
      if (value.includes(".")) {
        while (value.toString().includes(".")) {
          value = value.replace(".", ";"); // . -> ;
        }
      }

      if (value.includes(",")) {
        while (value.toString().includes(",")) {
          value = value.replace(",", ".");
        }
      }

      if (value.includes(";")) {
        while (value.toString().includes(";")) {
          value = value.replace(";", ",");
        }
      }
      return this.validateNumber(value);
    }
  }

  formatAgain(value) {
    return new String(value).replace(".", ",");
  }

  //  trangnc
  onChangeTotal() {
    // update CR 31/07/2020 - start
    // thông tin chung : Sum MM thanh toán <= Sum MM thuê ngoài
    try {
      const sumMMPayed = this.formatNewToOld("totalMMPayed");
      const sumMMOutSource = this.formatNewToOld("totalMM");
      if (sumMMPayed > sumMMOutSource) {
        this.totalClErrorPayed = "has-error";
        this.errorMsgMMPayed =
          "Tổng MM đã thanh toán phải nhỏ hơn hoặc bằng Tổng MM thuê ngoài";
      } else {
        this.totalClErrorPayed = "";
        this.errorMsgMMPayed = "";
      }
    } catch (e) {
      this.toastService.openErrorToast(e.message);
    }
    // update CR 31/07/2020 - end

    const resTotalOwnedMM =
      this.formatNewToOld("totalMM") - this.formatNewToOld("totalMMPayed"); // MM còn nợ = Tổng MM thuê ngoài - Tổng MM đã thanh toán
    // if (Number(this.formatNewToOld('totalMMPayed')) > 0) {
    //   this.totalOwnedMM = this.formatAgain(resTotalOwnedMM);
    // } else {
    //   this.totalOwnedMM = '';
    // }
    this.totalOwnedMM = this.formatAgain(resTotalOwnedMM);
    this.form.get("totalOwnedMM").setValue(this.totalOwnedMM);
    this.totalOwnedMM = this.check4(resTotalOwnedMM);

    //  validate Giá trị hợp đồng (ẩn/hiện giá trị hợp đồng)
    if (this.form.get("price").value === "") {
      this.form.controls["contractValue"].enable();
    } else if (this.form.get("price").value !== "") {
      this.form.controls["contractValue"].disable();
    }

    // tính trường giá trị hợp đồng trên form
    if (true) {
      if (
        this.form.get("price").value === "" ||
        this.form.get("price").value === null
      ) {
        this.contractValue = "";
      } else {
        const price = this.formatNewToOld("price");
        const valTotalMM = this.formatNewToOld("totalMM");
        const val = Number(price) * Number(valTotalMM); // giá trị hợp đồng
        // eslint-disable-next-line radix
        const lengthValueContract = parseInt(val.toString());
        if (lengthValueContract > 999999999999999) {
          this.toastService.openWarningToast(
            "Giá trị hợp đồng lớn hơn giá trị cho phép (999.999.999.999.999)"
          );
          // this.contractValue = 0;
          this.priceClError = "has-error";
        } else {
          this.priceClError = "";
        }

        this.contractValue = this.formatAgain(parseFloat(val.toFixed(2)));
      }
    }

    // ẩn hiện số tiền còn nợ trong form
    if (
      this.getValueOfField("price") !== 0 &&
      this.getValueOfField("totalOwnedMM") !== 0
    ) {
      this.form.controls["ownedAmount"].disable();
    } else {
      this.form.controls["ownedAmount"].enable();
    }

    // tính số tiền còn nợ trên form
    if (true) {
      if (
        this.form.get("price").value === "" ||
        this.form.get("price").value === null
      ) {
        this.ownedAmount = "";
      } else {
        const price = this.formatNewToOld("price");
        const valTotalOwnedMM = this.validateNumberChange(this.totalOwnedMM);
        const val = Number(price) * Number(valTotalOwnedMM);
        //
        // if (new String(val.toFixed(1)).length > 16) {
        //   this.toastService.openWarningToast('Số tiền còn nợ lớn hơn giá trị cho phép (999.999.999.999.999)');
        //   this.ownedAmount = 0;
        // } else
        if (parseFloat(val.toFixed(2)) === 0 && resTotalOwnedMM !== 0) {
          this.ownedAmount = "";
          this.form.controls["ownedAmount"].enable();
        } else {
          this.form.controls["ownedAmount"].disable();
          this.ownedAmount = this.formatAgain(parseFloat(val.toFixed(2)));
        }
      }
    }

    // tính lại Số tiền còn nợ trong bảng đối tác tham gia
    let price = this.checkValue(this.form.value.price); // kiểm tra price khác ''
    price = this.validateNumberChange(price); // xóa dấu , trong price nếu có
    let check: boolean = false;
    this.params.partnerJoinList.forEach(element => {
      const val = price * this.validateNumberChange(element.mmOwed);
      if (new String(val).length > 23) {
        element.clErrorMoneyOwed = "has-error";
        element.moneyOwed = 0;
        check = true;
      } else {
        element.clErrorMoneyOwed = "";
        let res = price * this.validateNumberChange(element.mmOwed);
        // format lại
        element.moneyOwed = price > 0 ? this.formatAgain(res) : "";
      }
    });
    if (check) {
      this.toastService.openWarningToast(
        "Số tiền còn nợ trong đối tác tham gia đang lớn hơn giá trị cho phép (9.999.999.999)"
      );
    }
  }

  //  trangnc xóa dấu phẩy
  validateNumber(data) {
    if (data.toString().includes(",")) {
      while (data.toString().includes(",")) {
        data = data.toString().replace(",", "");
      }
      return Number(data.replace(",", ""));
    } else {
      return Number(data);
    }
  }

  checkMMOwned() {
    if (
      this.form.get("totalOwnedMM").value === 0 ||
      this.form.get("totalOwnedMM").value === ""
    ) {
      this.form.get("ownedAmount").setValue("");
    }
    if (
      this.form.get("totalOwnedMM").value > 0 &&
      this.form.get("price").value > 0
    ) {
      this.form.controls["ownedAmount"].disable();
    }
  }

  // change dấu chấm <-> dấu phẩy (format data new to data old)
  validateNumberChange(data) {
    if (data === 0) {
      return Number(data);
    }
    if (data === "") {
      return data;
    }
    data = data + "";
    if (data.includes(".")) {
      while (data.toString().includes(".")) {
        data = data.replace(".", ";"); // . -> ;
      }
    }

    if (data.includes(",")) {
      while (data.toString().includes(",")) {
        data = data.replace(",", ".");
      }
    }

    if (data.includes(";")) {
      while (data.toString().includes(";")) {
        data = data.replace(";", ",");
      }
    }

    return this.validateNumber(data);
  }

  //  validate Tổng MM thuê ngoài - end

  onChangeDatalist(item, effortIndex, value) {
    this.params.actualEffortList[effortIndex][item] = this.dropdownDataMap[
      value
    ]
      ? this.dropdownDataMap[value]
      : null;
    //  this.setDefaultValue();
  }

  onClickAddEffort() {
    // this.params.partnerJoinList = this.params.partnerJoinList.sort((a, b) => (a.partnerCode > b.partnerCode ? 1 : -1));
    // start chuyển về page đầu tiên
    this.currentPage = 1;
    this.loadList();
    // end chuyển về page đầu tiên
    const obj: any = {
      id: "", // id bản ghi
      partnerId: "", // mã đối tác
      softwareDevelopmentProjectId: "", //  Mã dự án
      projectId: null, //  id dự án
      outsourcePlanId: "", //  kế hoạch thuê ngoài
      lstOutsourcePlanId: "", // danh sách id kế hoạch thuê ngoài

      lstPlanCode: "", // danh sách mã (code) kế hoạch thuê ngoài
      // numberContract: '', //  Số HD
      // outsourcingOrganizationId: '', //   Đơn vị thuê ngoài
      // outsourcingOrganizationName: '', //   Đơn vị thuê ngoài
      // proposedCooperationClueUserId: '', //  đầu mối đề nghị hợp tác
      numberTTrPAKD: "", //  Số TTr PAKD
      estimateEffortStatus: "", //  Trạng thái ULNL

      businessOrganizationId: "", //  Đơn vị kinh doanh
      lstbusinessOrgId: "", // danh sách id đơn vị kinh doanh
      lstbusinessOrgName: "", // danh sách name đơn vị kinh doanh

      businessClueUserId: "", //  Đầu mối kinh doanh
      lstamId: "", // danh sách id Đầu mối kinh doanh
      lstamName: "", // danh sách name Đầu mối kinh doanh

      manufacturingOrganizationId: "", //  Đơn vị sản xuất
      lstproductionOrgId: "", // danh sách id Đơn vị sản xuất
      lstproductionOrgName: "", // danh sách name Đơn vị sản xuất

      technicalClueUserId: "", //  đầu mối kỹ thuật
      lstpmId: "", // danh sách id đầu mối kỹ thuật
      lstpmName: "", // danh sách name đầu mối kỹ thuật

      cooperationYear: "", //  năm hợp tác
      totalAppraisedMM: "", //  Tổng MM đã thẩm định
      totalSaveMM: "", //  MM còn lại
      totalRealityMM: "", //  MM sử dụng thực tế
      totalRealityMD: "", //  MD sử dụng thực tế
      monthValue1: "",
      monthValue2: "",
      monthValue3: "",
      monthValue4: "",
      monthValue5: "",
      monthValue6: "",
      monthValue7: "",
      monthValue8: "",
      monthValue9: "",
      monthValue10: "",
      monthValue11: "",
      monthValue12: "",
      status: false,
      flagOutSourcingPlan: true
    };
    // this.params.actualEffortList.push(obj);
    this.params.actualEffortList.unshift(obj);
    this.params.actualEffortList2.unshift(obj);

    this.activeEffort = true;
    this.buttonDisabled = true;
    this.getAllPlan();
    this.getULNL();
    // this.getAllYear(); quanghn cmt
    this.getYear();
    this.getListDVSXDVKD(this.params.actualEffortList.length - 1);
  }

  onDeleteEffort(index) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: "static"
    });
    const idDelete = this.params.actualEffortList[index].id;
    modalRef.componentInstance.type = "delete";
    modalRef.componentInstance.param = this.translateService.instant(
      "actualEffort.title-delete"
    );
    modalRef.componentInstance.onCloseModal.subscribe(value => {
      if (value === true) {
        if (idDelete !== "undefined" || idDelete !== undefined) {
          this.objDelete = JSON.parse(
            JSON.stringify(this.params.actualEffortList[index])
          );
          this.objDeleteDB = this.converObj();
          this.lstdataDelete.push(this.objDeleteDB);
          this.objDelete = {};
          this.objDeleteDB = {};
        }
        this.params.actualEffortList.splice(index, 1);
        this.loadList();
        this.arrPage();

        const length = this.params.actualEffortList.length;
        let total = 0;
        let totalLK = 0;
        for (let i = 0; i < length; i++) {
          const val = this.validateNumberChange(
            this.params.actualEffortList[i].totalAppraisedMM
          );
          total += Number(val);
          const val2 = this.validateNumberChange(
            this.params.actualEffortList[i].totalRealityMM
          );
          totalLK += Number(val2);
        }
        const valTotal = this.formatAgain(total);
        this.form.get("totalMM").setValue(valTotal); // tổng MM thuê ngoài
        const valTotalLK = this.formatAgain(totalLK.toFixed(2));
        if (!this.isCheckMMLK) {
          this.form.get("totalAccumulatedMM").setValue(valTotalLK); //
        }
        this.onChangeTotal();

        this.toastService.openSuccessToast(
          this.translateService.instant(
            "common.toastr.messages.success.delete",
            {
              paramName: this.translateService.instant("actualEffort.title")
            }
          )
        );
      }
    });
  }

  converJoinObj() {
    const objDeleteDB: any = {};
    objDeleteDB.contractCode = this.objDeleteJoin.idContract; // id hợp đồng
    objDeleteDB.id = this.objDeleteJoin.id; // id bản ghi
    (objDeleteDB.partnerId = this.objDeleteJoin.partnerId), // id đối tác
      (objDeleteDB.partnerCode = this.objDeleteJoin.partnerCode), // mã đối tác
      (objDeleteDB.partnerName = this.objDeleteJoin.partnerName), // tên đối tác
      (objDeleteDB.outsourcingOrganizationId = this.objDeleteJoin.outsourcingOrganizationId), // đơn vị thuê ngoài id
      (objDeleteDB.outsourcingOrganizationName = this.objDeleteJoin.outsourcingOrganizationName), // đơn vị thuê ngoài name
      (objDeleteDB.nameClue = this.objDeleteJoin.nameClue), // đầu mối đề nghị hợp tác
      (objDeleteDB.outsourcingMMTotal = this.check4(
        this.objDeleteJoin.outsourcingMMTotal
      )), // tổng MM thuê ngoài
      (objDeleteDB.mmUsing = this.check4(this.objDeleteJoin.mmUsing)), // MM sử dụng lũy kế
      (objDeleteDB.mmPayed = this.check4(this.objDeleteJoin.mmPayed)), // MM đã thanh toán
      (objDeleteDB.mmOwed = this.check4(this.objDeleteJoin.mmOwed)), // MM còn nợ
      (objDeleteDB.moneyOwed = this.check4(this.objDeleteJoin.moneyOwed)); // Số tiền còn nợ
    objDeleteDB.isActive = 0;

    objDeleteDB.status = true;
    return objDeleteDB;
  }

  converObj() {
    const objDeleteDB: any = {};
    objDeleteDB.id = this.objDelete.id; //  id bản ghi
    objDeleteDB.partnerId = this.objDelete.id; // mã đối tác
    objDeleteDB.outsourcingContractId = this.form.get("id").value; // (id hợp đồng)
    objDeleteDB.projectId = this.objDelete.projectId; //  id dự án
    objDeleteDB.partnerId = this.objDelete.partnerId; // id đối tác

    objDeleteDB.lstOutsourcePlanId = this.objDelete.outsourcePlanId.toString(); // danh sách id kế hoạch thuê ngoài (1) outsourcePlanId
    let lstPlanCode = "";
    if ([null, undefined, ""].indexOf(this.objDelete.outsourcePlans) < 0) {
      this.objDelete.outsourcePlans.forEach(element => {
        lstPlanCode += element.planCode + ",";
      });
    }

    objDeleteDB.lstPlanCode = lstPlanCode; // danh sách code kế hoạch thuê ngoài (2)  outsourcePlans.planCode

    objDeleteDB.estimateEffortStatus = this.objDelete.estimateEffortStatus; //  Trạng thái ULNL

    objDeleteDB.lstbusinessOrgName = this.objDelete.businessOrgName; // (3) businessOrgName
    objDeleteDB.lstbusinessOrgId = this.objDelete.lstbusinessOrgId;

    objDeleteDB.lstamId = this.objDelete.lstamId;
    objDeleteDB.lstamName = this.objDelete.amName; // (4) amName

    objDeleteDB.lstproductionOrgName = this.objDelete.productionOrgName; // (5) productionOrgName
    objDeleteDB.lstproductionOrgId = this.objDelete.lstproductionOrgId;

    objDeleteDB.lstpmId = this.objDelete.lstpmId;
    objDeleteDB.lstpmName = this.objDelete.pmName; //(5) pmName

    objDeleteDB.cooperationYear = this.objDelete.cooperationYear; //  năm hợp tác
    objDeleteDB.totalAppraisedMM = this.replaceFormatNumber(
      this.objDelete.totalAppraisedMM
    ); //   Tổng MM đã thẩm định
    objDeleteDB.totalUsedMM = this.replaceFormatNumber(
      this.objDelete.totalRealityMM
    ); //  MM sử dụng thực tế

    objDeleteDB.isActive = 0;
    //  month value
    let totalMD = "";
    totalMD += ";" + this.objDelete.monthValue1;
    totalMD += ";" + this.objDelete.monthValue2;
    totalMD += ";" + this.objDelete.monthValue3;
    totalMD += ";" + this.objDelete.monthValue4;
    totalMD += ";" + this.objDelete.monthValue5;
    totalMD += ";" + this.objDelete.monthValue6;
    totalMD += ";" + this.objDelete.monthValue7;
    totalMD += ";" + this.objDelete.monthValue8;
    totalMD += ";" + this.objDelete.monthValue9;
    totalMD += ";" + this.objDelete.monthValue10;
    totalMD += ";" + this.objDelete.monthValue11;
    totalMD += ";" + this.objDelete.monthValue12;
    objDeleteDB.monthValues = totalMD;
    objDeleteDB.numTTrPakd = this.objDelete.numberTTrPAKD; //  TTrPard
    // objDeleteDB.listDMDVHT$ = this.objDelete.listDMDVHT$;
    objDeleteDB.listUnit$ = this.objDelete.listUnit$;

    objDeleteDB.status = true;
    return objDeleteDB;
  }

  onSubmitDelete(id?: any) {
    this.spinner.show();
    this.contractManagerService.doDeleteDataTNLTT(id).subscribe(
      res => {
        this.spinner.hide();
        if (res.id > 0) {
          this.toastService.openSuccessToast(
            this.translateService.instant(
              "common.toastr.messages.success.delete",
              {
                paramName: this.translateService.instant("actualEffort.title")
              }
            )
          );
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

  //  trangnc
  onClickEditEffort(index) {
    let effortIndex = (this.currentPage - 1) * this.numberPerPage + index;
    this.params.actualEffortList[effortIndex].status = false;
    this.params.actualEffortList2[effortIndex].status = false;
    // check kê hoạch
    const valOutsourcePlanId = this.params.actualEffortList[effortIndex]
      .outsourcePlanId;
    if (valOutsourcePlanId === "") {
      this.params.actualEffortList[effortIndex].flagMMOS = false; // enable Tổng MM đã thẩm định
    } else {
      this.params.actualEffortList[effortIndex].flagMMOS = true; // disable Tổng MM đã thẩm định
    }
    this.buttonDisabled = true;
    this.objClone = JSON.parse(
      JSON.stringify(this.params.actualEffortList[effortIndex])
    );
    const projectId = this.params.actualEffortList[effortIndex].projectId;
    this.contractManagerService
      .getAllPlanFollowApprove(projectId)
      .then(
        res =>
          (this.params.actualEffortList[effortIndex].outsourcePlans =
            res["data"])
      );
  }

  doNotUpdateEffort(effortIndex?: number) {
    if (this.objClone.id === undefined) {
      this.params.actualEffortList.splice(effortIndex, 1);
      this.params.actualEffortList2.splice(effortIndex, 1);
      this.buttonDisabled = false;
    } else {
      // // khi có dữ liệu
      // this.params.actualEffortList[effortIndex].id = this.objClone.id; //  id bản ghi
      // this.params.actualEffortList[effortIndex].partnerId = this.objClone.partnerId; // id đối tác
      // // id dự án
      // this.params.actualEffortList[effortIndex].projectId = this.objClone.projectId; //  id dự án
      // this.params.actualEffortList[effortIndex].outsourcingContractId = this.form.get('outsourcingContractId').value; // (id hợp đồng)

      // this.params.actualEffortList[effortIndex].lstOutsourcePlanId = this.objClone.lstOutsourcePlanId; // danh sách id kế hoạch thuê ngoài
      // this.params.actualEffortList[effortIndex].lstPlanCode = this.objClone.lstPlanCode; // danh sách code kế hoạch thuê ngoài

      // this.params.actualEffortList[effortIndex].estimateEffortStatus = this.objClone.estimateEffortStatus; //  Trạng thái ULNL

      // this.params.actualEffortList[effortIndex].lstbusinessOrgName = this.objClone.lstbusinessOrgName;
      // this.params.actualEffortList[effortIndex].lstbusinessOrgId = this.objClone.lstbusinessOrgId;

      // this.params.actualEffortList[effortIndex].lstamId = this.objClone.lstamId;
      // this.params.actualEffortList[effortIndex].lstamName = this.objClone.lstamName;

      // this.params.actualEffortList[effortIndex].lstproductionOrgName = this.objClone.lstproductionOrgName;
      // this.params.actualEffortList[effortIndex].lstproductionOrgId = this.objClone.lstproductionOrgId;

      // this.params.actualEffortList[effortIndex].lstpmId = this.objClone.lstpmId;
      // this.params.actualEffortList[effortIndex].lstpmName = this.objClone.lstpmName;

      // this.params.actualEffortList[effortIndex].cooperationYear = this.objClone.cooperationYear; //  năm hợp tác
      // this.params.actualEffortList[effortIndex].totalAppraisedMM = this.objClone.totalAppraisedMM; //   Tổng MM đã thẩm định
      // this.params.actualEffortList[effortIndex].totalUsedMM = this.objClone.totalRealityMM; //  MM sử dụng thực tế

      // // this.params.actualEffortList[effortIndex].numberTTrPAKD = this.objClone.numberTTrPAKD; //  Số TTr PAKD
      // // this.params.actualEffortList[effortIndex].estimateEffortStatus = this.objClone.estimateEffortStatus; //  Trạng thái ULNL
      // // this.params.actualEffortList[effortIndex].businessOrganizationId = this.objClone.businessOrganizationId; //  Đơn vị kinh doanh
      // // this.params.actualEffortList[effortIndex].businessClueUserId = this.objClone.businessClueUserId; //  Đầu mối kinh doanh
      // // this.params.actualEffortList[effortIndex].manufacturingOrganizationId = this.objClone.manufacturingOrganizationId; //  Đơn vị sản xuất
      // // this.params.actualEffortList[effortIndex].technicalClueUserId = this.objClone.technicalClueUserId; //  đầu mối kỹ thuật
      // // this.params.actualEffortList[effortIndex].cooperationYear = this.objClone.cooperationYear; //  năm hợp tác
      // // this.params.actualEffortList[effortIndex].totalAppraisedMM = this.objClone.totalAppraisedMM; //   Tổng MM đã thẩm định
      // // this.params.actualEffortList[effortIndex].totalSaveMM = this.objClone.totalSaveMM; //  MM còn lại
      // // this.params.actualEffortList[effortIndex].totalRealityMM = this.objClone.totalRealityMM; //  MM sử dụng thực tế
      // // this.params.actualEffortList[effortIndex].projectCode = this.objClone.projectCode; // mã dự án
      // // this.params.actualEffortList[effortIndex].projectName = this.objClone.projectName; // tên dự án
      // // this.params.actualEffortList[effortIndex].nameUser = this.objClone.nameUser;
      // // this.params.actualEffortList[effortIndex].mailUser = this.objClone.mailUser;
      // // this.params.actualEffortList[effortIndex].codeUser = this.objClone.codeUser;
      // // this.params.actualEffortList[effortIndex].planCode = this.objClone.planCode;
      // //  month value
      // this.params.actualEffortList[effortIndex].monthValue1 = this.objClone.monthValue1;
      // this.params.actualEffortList[effortIndex].monthValue2 = this.objClone.monthValue2;
      // this.params.actualEffortList[effortIndex].monthValue3 = this.objClone.monthValue3;
      // this.params.actualEffortList[effortIndex].monthValue4 = this.objClone.monthValue4;
      // this.params.actualEffortList[effortIndex].monthValue5 = this.objClone.monthValue5;
      // this.params.actualEffortList[effortIndex].monthValue6 = this.objClone.monthValue6;
      // this.params.actualEffortList[effortIndex].monthValue7 = this.objClone.monthValue7;
      // this.params.actualEffortList[effortIndex].monthValue8 = this.objClone.monthValue8;
      // this.params.actualEffortList[effortIndex].monthValue9 = this.objClone.monthValue9;
      // this.params.actualEffortList[effortIndex].monthValue10 = this.objClone.monthValue10;
      // this.params.actualEffortList[effortIndex].monthValue11 = this.objClone.monthValue11;
      // this.params.actualEffortList[effortIndex].monthValue12 = this.objClone.monthValue12;
      // this.params.actualEffortList[effortIndex].listUnit$ = this.objClone.listUnit$;

      this.params.actualEffortList2[effortIndex] = JSON.parse(
        JSON.stringify(this.objClone)
      );
      this.params.actualEffortList[effortIndex] = JSON.parse(
        JSON.stringify(this.objClone)
      );

      this.params.actualEffortList2[effortIndex].projectId = Number(
        this.params.actualEffortList2[effortIndex].projectId
      );
      this.params.actualEffortList[effortIndex].projectId = Number(
        this.params.actualEffortList[effortIndex].projectId
      );
      this.params.actualEffortList2[effortIndex].status = true;
      this.params.actualEffortList[effortIndex].status = true;

      const dataDefaultProject = {
        id: this.params.actualEffortList[effortIndex].projectId,
        projectCode: this.params.actualEffortList[effortIndex].projectCode,
        projectName: this.params.actualEffortList[effortIndex].projectName
      };
      this.params.actualEffortList[effortIndex].listUnit$ = of([
        dataDefaultProject
      ]);
      this.params.actualEffortList2[effortIndex].listUnit$ = of([
        dataDefaultProject
      ]);

      this.buttonDisabled = false;
      this.objClone = {};
    }
  }

  //  trangnc
  onNotUpdateEffort(effortIndex) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: "static"
    });
    modalRef.componentInstance.type = "confirm";
    modalRef.componentInstance.param = this.translateService.instant(
      "contractManagement.contractManagement"
    );

    modalRef.componentInstance.onCloseModal.subscribe(value => {
      this.spinner.show();
      if (value === true) {
        this.doNotUpdateEffort(effortIndex);
      }
      this.spinner.hide();
    });
  }

  //  trangnc có sửa (nỗ lực thực tế)
  onUpdateEffort(index) {
    //  validate các trường
    let effortIndex = (this.currentPage - 1) * this.numberPerPage + index;

    const codePartner = this.params.actualEffortList[effortIndex].partnerId; // mã đối tác
    const codeProject = this.params.actualEffortList[effortIndex].projectId; // mã dự án
    const totalMM = this.params.actualEffortList[effortIndex].totalAppraisedMM; // tổng MM
    const ulnl = this.params.actualEffortList[
      effortIndex
    ].estimateEffortStatus.toString(); // ULNL
    const coorYear = this.params.actualEffortList[
      effortIndex
    ].cooperationYear.toString(); // Năm hợp tác
    // let numberProjectCode = 0; // số lượng mã dự án

    // quanghn start add
    const outsourcePlanId = this.params.actualEffortList[effortIndex]
      .outsourcePlanId;

    const outsourcePlanCode = this.params.actualEffortList[effortIndex]
      .lstPlanCode;

    if (
      outsourcePlanId === "" ||
      outsourcePlanId === null ||
      outsourcePlanId === undefined
    ) {
      this.plandMMOSBlank = "";
    }

    if (outsourcePlanCode) {
      this.plandMMOSBlank = outsourcePlanCode;
      this.plandMMOSBlank = this.plandMMOSBlank.substring(
        1,
        this.plandMMOSBlank.length - 1
      );
    }

    if (Number(totalMM) !== 0) {
      this.plandMMOSBlank = "";
    }

    const dataULNL: any[] = this.effortStatusList.filter(x =>
      ulnl.includes(x.id)
    );
    const dataCoorYear: any[] = this.years.filter(x => coorYear.includes(x));

    //quanghn end

    this.params.actualEffortList[effortIndex].clErrPaC = "";
    this.params.actualEffortList[effortIndex].clErrPC = "";
    this.params.actualEffortList[effortIndex].clErrorMM = "";
    this.params.actualEffortList[effortIndex].clErrULNL = "";
    this.params.actualEffortList[effortIndex].clErrYear = "";

    if (
      codePartner === "" ||
      codePartner === null ||
      codeProject === "" ||
      totalMM === "" ||
      ulnl === "" ||
      coorYear === "" ||
      coorYear === 0 ||
      codeProject === null ||
      totalMM === "0" ||
      dataCoorYear.length === 0 ||
      dataULNL.length === 0
    ) {
      let nameM = "";
      let checkRequiredFlag = false;

      if (totalMM === "" || totalMM === "0" || totalMM === null) {
        if (this.plandMMOSBlank !== "") {
          this.params.actualEffortList[effortIndex].clErrorMM = "has-error";
        } else {
          this.params.actualEffortList[effortIndex].clErrorMM = "has-error";
          nameM = "Tổng MM đã thẩm định";
          checkRequiredFlag = true;
        }
      }

      if (coorYear === "" || coorYear === 0) {
        this.params.actualEffortList[effortIndex].clErrYear = "has-error";
        nameM = "Năm hợp tác";
        checkRequiredFlag = false;
      }

      if (ulnl === "") {
        this.params.actualEffortList[effortIndex].clErrULNL = "has-error";
        nameM = "Trạng thái thẩm định ULNL";
        checkRequiredFlag = false;
      }

      if (codeProject === "" || codeProject === null) {
        this.params.actualEffortList[effortIndex].clErrPC = "has-error";
        nameM = "Mã dự án";
        checkRequiredFlag = false;
      }

      if (codePartner === "" || codePartner === null) {
        this.params.actualEffortList[effortIndex].clErrPaC = "has-error";
        nameM = "Mã đối tác";
        checkRequiredFlag = false;
      }
      if (nameM !== "") {
        checkRequiredFlag
          ? this.toastService.openErrorToast(nameM + " bắt buộc nhập")
          : this.toastService.openErrorToast(nameM + " bắt buộc chọn");
      } else if (this.plandMMOSBlank !== "") {
        this.toastService.openErrorToast(
          "Kế hoạch " +
            this.plandMMOSBlank +
            " chưa có MM OS, yêu cầu cập nhật MM OS"
        );
      } else if (dataULNL.length === 0) {
        this.params.actualEffortList[effortIndex].clErrULNL = "has-error";
        this.toastService.openErrorToast(
          "Trạng thái thẩm định ULNL không tồn tại"
        );
      } else if (dataCoorYear.length === 0) {
        this.params.actualEffortList[effortIndex].clErrYear = "has-error";
        this.toastService.openErrorToast("Năm hợp tác không tồn tại");
      }
    } else if (
      codePartner !== "" &&
      codePartner !== null &&
      codeProject !== "" &&
      totalMM !== "" &&
      ulnl !== "" &&
      coorYear !== "" &&
      totalMM !== "0" &&
      coorYear !== 0
    ) {
      this.params.actualEffortList[effortIndex].status = true;
      this.params.actualEffortList[effortIndex].flagMMOS = true; // ẩn Tổng MM đã thẩm định

      this.buttonDisabled = false;

      const projectId = this.params.actualEffortList[effortIndex].projectId;
      this.contractManagerService.doGetPMById(projectId).subscribe(res => {
        if (res) {
          const dataDefaultProject = {
            id: res.id,
            projectCode: res.projectCode,
            projectName: res.projectName
          };
          this.params.actualEffortList[effortIndex].listUnit$ = of([
            dataDefaultProject
          ]);
          this.arrPage();
          this.loadList();
        }
      });
    }
  }

  //  trangnc
  onSave() {
    // check số lượng bản ghi trong table đối tác tham gia - start
    const sizeTblJoin = this.params.partnerJoinList.length;
    if (sizeTblJoin < 1 || this.btnDisabled === true) {
      if (sizeTblJoin < 1) {
        this.toastService.openErrorToast(
          "Vui lòng nhập ít nhất một đối tác tham gia"
        );
      } else if (this.btnDisabled === true) {
        this.toastService.openWarningToast(
          "Bản ghi đối tác tham gia chưa xác nhận"
        );
      }
      return;
    }
    // check số lượng bản ghi trong table đối tác tham gia - end
    const val = this.form.value;
    const type = val.type;
    // check validate Tổng MM thuê ngoài && validate mã đối tác start
    const totalMM = val.totalMM;
    // const partnerCode = val.partnerId; // id đối tác
    const errDate = this.messageDate;
    // check Số hợp đồng là duy nhất , check thời gian bắt đầu nhỏ hơn thời gian kết thúc
    // validate table đối tác tham gia
    let totalMMOutSourcing = 0; // tổng MM thuê ngoài
    let totalUsing = 0; // tổng MM sử dụng lũy kế
    let totalMMPayed = 0; // MM đã thanh toán
    this.params.partnerJoinList.forEach(element => {
      // format new to format old
      const val1 = this.validateNumberChange(
        this.checkValue(element.outsourcingMMTotal)
      );
      const val2 = this.validateNumberChange(this.checkValue(element.mmUsing));
      const val3 = this.validateNumberChange(this.checkValue(element.mmPayed));
      totalMMOutSourcing += val1;
      totalUsing += val2;
      totalMMPayed += val3;
    });
    if (
      this.checkJoinWithForm(totalMMOutSourcing, 1) ||
      this.checkJoinWithForm(totalUsing, 2) ||
      this.checkJoinWithForm(totalMMPayed, 3)
    ) {
      let title = "";
      if (this.checkJoinWithForm(totalMMPayed, 3)) {
        this.clErrorPayed = "has-error";
        title = "Tổng MM đã thanh toán";
      }

      if (this.checkJoinWithForm(totalUsing, 2)) {
        this.clErrorMMUsing = "has-error";
        title = "MM sử dụng lũy kế";
      }

      if (this.checkJoinWithForm(totalMMOutSourcing, 1)) {
        this.clErrorMMOutSourcing = "has-error";
        title = "Tổng MM thuê ngoài";
      }
      this.toastService.openErrorToast(
        "SUM (" +
          title +
          ") " +
          "của Đối tác tham gia phải nhỏ hơn hoặc bằng " +
          title +
          " của hợp đồng"
      );
      return;
    }
    if (totalMM === "" || errDate !== "") {
      if (totalMM === "") {
        this.clErrorTtal = "has-error";
        this.errortotalMM = "totalMM";
        this.messagetotalMM = "Tổng MM thuê ngoài là bắt buộc";
      }
      return;
    } else {
      // record chưa xác thực update
      for (
        let index = 0;
        index < this.params.actualEffortList.length;
        index++
      ) {
        const element = this.params.actualEffortList[index];
        if (element.status === false) {
          this.toastService.openWarningToast(
            "Vui lòng xác thực bản ghi nỗ lực thực tế"
          );
          return;
        }
        // check mã đối tác null
        if (element.partnerId === "") {
          this.toastService.openWarningToast("Mã đối tác đang trống ");
          element.clErrPaC = "has-error";
          this.arrPage();
          this.loadList();
          return;
        } else {
          element.clErrPaC = "";
        }
      }
      // check thông tin chung
      // check Lỗi ATTT các trường combobox
      if (
        Number(val.signatureStatus) !== 18 &&
        Number(val.signatureStatus) !== 19
      ) {
        // this.toastService.openErrorToast('Có lỗi xảy ra');
        return;
      }
      // check ANTT loại hợp đồng
      if (
        Number(val.contractType) !== 20 &&
        Number(val.contractType) !== 21 &&
        Number(val.contractType) !== 22 &&
        val.contractType !== ""
      ) {
        return;
      }

      // check ANTT trạng thái hợp đồng
      if (
        Number(val.contractStatus) !== 23 &&
        Number(val.contractStatus) !== 24 &&
        Number(val.contractStatus) !== 25 &&
        Number(val.contractStatus) !== 26 &&
        Number(val.contractStatus) !== 27 &&
        val.contractStatus !== ""
      ) {
        return;
      }

      // check số hợp đồng
      // QuangHN start comment fix bug 32574
      if (this.clErrNumContract !== "") {
        //this.toastService.openErrorToast('Số hợp đồng đã tồn tại');
        return;
      }
      if (this.totalClErrorPayed !== "") {
        return;
      }
      if (this.priceClError !== "") {
        this.toastService.openWarningToast(
          "Giá trị hợp đồng lớn hơn giá trị cho phép (999.999.999.999.999)"
        );
        return;
      }
      // check SumMM Payed > SumMM outSourcing
      // if (this.clErrNumContract !== '') {
      //   this.toastService.openErrorToast('Tổng MM đã thanh toán phải nhỏ hơn hoặc bằng Tổng MM thuê ngoài');
      //   return;
      // }
      // QuangHN end comment fix bug 32574
      this.params.actualEffortList.forEach(element => {
        try {
          if (
            !(
              (Number(element.estimateEffortStatus) >= 35 &&
                Number(element.estimateEffortStatus) <= 38) ||
              element.estimateEffortStatus === ""
            )
          ) {
            return;
          }
          /*
          // QuangHN cmt fix nam hop tac
          if (
            !(Number(element.cooperationYear) >= 62 && Number(element.cooperationYear) <= 107) ||
            element.cooperationYear !== '' ||
            !(Number(element.cooperationYear) >= 39 && Number(element.cooperationYear) <= 43)
          ) {
            return;
          }
          */
        } catch (err) {
          this.toastService.openInfoToast(err.message);
          return;
        }
      });

      // validate success -> start save
      this.buttonDisabled = true;
      this.clErrorPartner = "";
      this.clErrorTtal = "";
      this.errortotalMM = "";
      this.errorPartner = "";
      this.messagetotalMM = "";
      this.messageErrorPartner = "";
      if (type === "add" || type === "create") {
        this.doAdd(val);
      } else if (type === "update") {
        this.doUpdateForm(val);
      }
    }
  }

  doAdd(val?: any, action?: String) {
    //  thực hiện add
    this.objectInsert.id = val.id;
    this.objectInsert.createDate = new Date();
    this.objectInsert.updateDate = new Date();
    this.objectInsert.createUser = 1;
    this.objectInsert.userModifyId = 1;
    this.objectInsert.isActive = 1;
    this.objectInsert.numContract = val.numContract; // Số hợp đồng
    // this.objectInsert.partnerId = val.partnerId;                 //  id đối tác
    this.objectInsert.signatureStatus = val.signatureStatus; //  trạng thái ký
    this.objectInsert.contractStatus = val.contractStatus; //  trạng thái hợp đồng
    this.objectInsert.contractType = val.contractType; //  loại hợp đồng
    this.objectInsert.startTime =
      val.startTime === "" ? "" : this.convertDate(val.startTime); //  thời gian bắt đầu
    this.objectInsert.endTime =
      val.startTime === "" ? "" : this.convertDate(val.endTime); //  thời gian kết thúc
    this.objectInsert.totalMM = this.validateNumberChange(val.totalMM); //  tổng MM
    if (val.totalMMPayed === "") {
      this.objectInsert.totalMMPayed = val.totalMMPayed;
    } else {
      this.objectInsert.totalMMPayed = this.validateNumberChange(
        val.totalMMPayed
      ); //  tổng MM đã thanh toán
    }

    if (val.price === "") {
      this.objectInsert.price = "";
    } else {
      const price2Num = this.validateNumberChange(val.price);
      this.objectInsert.price = price2Num; //  giá
    }

    if (this.contractValue === "") {
      this.objectInsert.contractValue = "";
    } else {
      const contractVNumber = this.validateNumberChange(this.contractValue);
      this.objectInsert.contractValue = contractVNumber; //  giá trị hợp đồng
    }

    if (this.ownedAmount === "") {
      this.objectInsert.amountOwed = "";
    } else {
      this.objectInsert.amountOwed = this.validateNumberChange(
        this.ownedAmount
      ); // Số tiền còn nợ
    }

    this.objectInsert.getContractDescription = val.contractDescription; //  thông tin chung
    this.objectInsert.note = val.note; //  miêu tả
    const paramsActualEffortListLength = this.params.actualEffortList.length;

    if (val.totalAccumulatedMM === undefined || val.totalAccumulatedMM === "") {
      if (paramsActualEffortListLength > 0) {
        for (let i = 0; i < paramsActualEffortListLength; i++) {
          let val = this.checkValue(
            this.params.actualEffortList[i].totalRealityMM
          );
          this.numberLK += this.validateNumberChange(val);
        }
        this.objectInsert.mmSumLK = this.numberLK; // tổng MM lũy kế
      } else {
        this.objectInsert.mmSumLK = "";
      }
    } else {
      if (val.totalAccumulatedMM === "") {
        this.objectInsert.mmSumLK = "";
      } else {
        let value = this.checkValue(val.totalAccumulatedMM);
        value = this.validateNumberChange(value);
        this.objectInsert.mmSumLK = value; // tổng MM lũy kế
      }
    }

    // check validate
    // lấy danh sách mã đối tác start
    let lstPartnerCode = "";
    this.params.partnerJoinList.forEach(element => {
      lstPartnerCode += element.partnerCode + "-";
    });
    lstPartnerCode = lstPartnerCode.substring(0, lstPartnerCode.length - 1);
    this.objectInsert.lstPartnerCode = lstPartnerCode;
    // lấy danh sách mã đối tác end

    this.isShowToast = true;
    //  start call api insert thong tin chung
    this.contractManagerService
      .doInsertData(this.objectInsert)
      .subscribe(res => {
        if (res) {
          // insert dữ liệu tới đối tác tham gia
          this.insertDataToPartnerJoin(res.id, "add");
          //  insert data thong tin no luc thuc te
          this.insertDataTTNLTT(res.id, "add");
        } else {
          this.toastService.openErrorToast(
            this.translateService.instant("common.toastr.messages.error.save")
          );
        }
      });
  }

  doUpdateForm(val?: any) {
    //  thực hiện add
    this.objectInsert.id = val.id;
    this.objectInsert.createDate = new Date();
    this.objectInsert.updateDate = new Date();
    this.objectInsert.createUser = 1;
    this.objectInsert.userModifyId = 1;
    this.objectInsert.isActive = 1;
    this.objectInsert.numContract = val.numContract; // Số hợp đồng
    this.objectInsert.signatureStatus = val.signatureStatus; //  trạng thái ký
    this.objectInsert.contractStatus = val.contractStatus; //  trạng thái hợp đồng
    this.objectInsert.contractType = val.contractType; //  loại hợp đồng
    this.objectInsert.startTime =
      val.startTime === "" || val.startTime === null
        ? ""
        : this.convertDate(val.startTime); //  thời gian bắt đầu
    this.objectInsert.endTime =
      val.endTime === "" || val.endTime === null
        ? ""
        : this.convertDate(val.endTime); //  thời gian kết thúc
    this.objectInsert.totalMM = this.checkNullorSpace(val.totalMM); //  tổng MM

    this.objectInsert.totalMMPayed =
      val.totalMMPayed === "" ||
      val.totalMMPayed === null ||
      val.totalMMPayed === "null"
        ? ""
        : this.checkNullorSpace(val.totalMMPayed); //  tổng MM đã thanh toán
    const price2Num = this.checkNullorSpace(val.price);
    this.objectInsert.price = price2Num > 0 ? price2Num : ""; //  giá
    const contractVNumber = this.checkNullorSpace(this.contractValue);
    this.objectInsert.contractValue =
      contractVNumber > 0 ? contractVNumber : ""; //  giá trị hợp đồng

    this.objectInsert.getContractDescription = val.contractDescription; //  thông tin chung
    this.objectInsert.note = val.note; //  miêu tả
    // lấy danh sách mã đối tác start
    let lstPartnerCode = "";
    this.params.partnerJoinList.forEach(element => {
      lstPartnerCode += element.partnerCode + "-";
    });
    lstPartnerCode = lstPartnerCode.substring(0, lstPartnerCode.length - 1);
    this.objectInsert.lstPartnerCode = lstPartnerCode;
    // lấy danh sách mã đối tác end
    const paramsActualEffortListLength = this.params.actualEffortList.length;
    this.objectInsert.amountOwed = this.checkNullorSpace(this.ownedAmount); // Số tiền còn nợ
    // tính MM sử dụng lũy kế bằng tổng MM sử dụng thực tế nếu MM sử dụng lũy kế không có value
    if (val.totalAccumulatedMM === undefined || val.totalAccumulatedMM === "") {
      for (let i = 0; i < paramsActualEffortListLength; i++) {
        this.numberLK += Number(
          this.checkNullorSpace(this.params.actualEffortList[i].totalRealityMM)
        );
      }
      this.objectInsert.mmSumLK = this.checkNullorSpace(this.numberLK); // tổng MM lũy kế
    } else {
      this.objectInsert.mmSumLK = this.checkNullorSpace(val.totalAccumulatedMM); // tổng MM lũy kế
    }

    //  start call api insert thong tin chung
    this.contractManagerService
      .doInsertData(this.objectInsert)
      .subscribe(res => {
        if (res) {
          // update dữ liệu tới đối tác tham gia
          this.doUpdateJoin();
          //  update data thong tin no luc thuc te
          this.doUpdate();
          // this.toastService.openSuccessToast('Cập nhật dữ liệu thành công');
          // this.onCancel(1);
        } else {
          this.toastService.openErrorToast(
            this.translateService.instant("common.toastr.messages.error.save")
          );
        }
      });
  }

  // update data đối tác tham gia
  doUpdateJoin() {
    // update những dữ liệu đã bị xóa

    const sizeLstDD = this.lstdataDeleteJoin.length;
    if (sizeLstDD > 0) {
      for (let i = 0; i < sizeLstDD; i++) {
        const element = this.lstdataDeleteJoin[i];
        this.insertDataForTableJoin(element, -1);
      }
    }

    // update data tới đối tác tham gia
    const paramsPartnerJoinListListLength = this.params.partnerJoinList.length;
    if (paramsPartnerJoinListListLength !== 0) {
      let index = 0;
      this.params.partnerJoinList.forEach(element => {
        const objectInsert2: any = {};
        index++;
        objectInsert2.id = element.id; // id
        objectInsert2.createDate = ""; //  CreateDate
        objectInsert2.createUser = ""; //  UserCreateId
        objectInsert2.updateDate = ""; //  updateDate
        objectInsert2.UserModifyId = ""; //  UserModifyId
        objectInsert2.isActive = 1;
        objectInsert2.contractCode = this.form.value.id; // id hợp đồng

        objectInsert2.nameClue = element.nameClue; // đầu mối đề nghị hợp tác
        objectInsert2.partnerId = element.partnerId; // id đối tác
        objectInsert2.outsourcingOrganizationId =
          element.outsourcingOrganizationId; // id đơn vị thuê ngoài
        objectInsert2.outsourcingMMTotal = element.outsourcingMMTotal
          .replace(/\./g, "")
          .replace(/\,/g, "."); // tổng MM thuê ngoài
        objectInsert2.mmUsing = element.mmUsing
          .replace(/\./g, "")
          .replace(/\,/g, "."); // MM sử dụng lũy kế
        objectInsert2.mmPayed = element.mmPayed
          .replace(/\./g, "")
          .replace(/\,/g, "."); // MM đã thanh toán
        //quanghn  start cmt
        /*
        if(element.mmOwed > 0) {
          objectInsert2.mmOwed = this.check4(element.mmOwed.replace('.', '')); // MM còn nợ
        }
        if(element.moneyOwed > 0) {
          objectInsert2.moneyOwed = this.check4(element.moneyOwed.replace('.', '')); // Số tiền còn nợ
        }
        */
        objectInsert2.mmOwed = element.mmOwed
          .replace(/\./g, "")
          .replace(/\,/g, "."); // MM còn nợ
        objectInsert2.moneyOwed = element.moneyOwed
          .replace(/\./g, "")
          .replace(/\,/g, ".");
        //quanghn  end cmt
        // objectInsert2.outsourcingMMTotal = element.outsourcingMMTotal; // tổng MM thuê ngoài
        // objectInsert2.mmUsing = element.mmUsing; // MM sử dụng lũy kế
        // objectInsert2.mmPayed = element.mmPayed; // MM đã thanh toán
        // objectInsert2.mmOwed = element.mmOwed; // MM còn nợ
        // objectInsert2.moneyOwed = element.moneyOwed; // Số tiền còn nợ
        // call api insert dữ liệu
        this.insertDataForTableJoin(objectInsert2, index);
      });
      // this.onCancel(1);
    }
  }

  doUpdate() {
    // update những dữ liệu đã bị xóa
    const sizeLstDD = this.lstdataDelete.length;
    this.isShowToast = true;
    if (sizeLstDD > 0) {
      this.insertDataTTNLSDTT(this.lstdataDelete);
    }
    // update data tới thông tin nỗ lực thực tế
    const paramsActualEffortListLength = this.params.actualEffortList.length;
    if (paramsActualEffortListLength !== 0) {
      const lstObject: any = [];
      for (let index = 0; index < paramsActualEffortListLength; index++) {
        const objectInsert2: any = {};
        objectInsert2.id = this.params.actualEffortList[index].id; // id
        objectInsert2.createDate = ""; //  CreateDate
        objectInsert2.createUser = ""; //  UserCreateId
        objectInsert2.updateDate = new Date(); //  updateDate
        objectInsert2.UserModifyId = ""; //  UserModifyId
        objectInsert2.isActive = 1;
        objectInsert2.outsourcingContractId = this.form.value.id; //  ID Hợp đồng thuê ngoài
        objectInsert2.partnerId = this.params.actualEffortList[index].partnerId; // id đối tác
        objectInsert2.projectId = this.params.actualEffortList[index].projectId; //  id dự án
        objectInsert2.lstOutsourcePlanId = this.check5(
          this.params.actualEffortList[index].outsourcePlanId
        ); // danh sách id kế hoạch thuê ngoài
        if (this.params.actualEffortList[index].lstPlanCode === undefined) {
          let lstPlanCode = "";
          if (this.params.actualEffortList[index].outsourcePlans !== "") {
            this.params.actualEffortList[index].outsourcePlans.forEach(
              element => {
                lstPlanCode += element.planCode + ",";
              }
            );
            objectInsert2.lstPlanCode = "," + lstPlanCode;
          } else {
            objectInsert2.lstPlanCode = lstPlanCode;
          }
          // danh sách code kế hoạch thuê ngoài
          // objectInsert2.lstOutsourcePlanId  = ',' + this.params.actualEffortList[index].outsourcePlanId.toString() + ','; // danh sách id kế hoạch thuê ngoài
        } else {
          objectInsert2.lstPlanCode = this.params.actualEffortList[
            index
          ].lstPlanCode;
          // objectInsert2.lstOutsourcePlanId  =  this.params.actualEffortList[index].outsourcePlanId.toString();
        }
        objectInsert2.estimateEffortStatus = this.params.actualEffortList[
          index
        ].estimateEffortStatus; //  ULNL

        objectInsert2.lstbusinessOrgName = this.check5(
          this.params.actualEffortList[index].businessOrgName
        );
        objectInsert2.lstbusinessOrgId = this.check5(
          this.params.actualEffortList[index].lstbusinessOrgId
        );

        objectInsert2.lstamId = this.check5(
          this.params.actualEffortList[index].lstamId
        );
        objectInsert2.lstamName = this.check5(
          this.params.actualEffortList[index].amName
        );

        objectInsert2.lstproductionOrgName = this.check5(
          this.params.actualEffortList[index].productionOrgName
        );
        objectInsert2.lstproductionOrgId = this.check5(
          this.params.actualEffortList[index].lstproductionOrgId
        );

        objectInsert2.lstpmId = this.check5(
          this.params.actualEffortList[index].lstpmId
        );
        objectInsert2.lstpmName = this.check5(
          this.params.actualEffortList[index].pmName
        );

        objectInsert2.cooperationYear = this.params.actualEffortList[
          index
        ].cooperationYear; //  Năm hợp tác
        objectInsert2.totalAppraisedMM = this.check6(
          this.check4(this.params.actualEffortList[index].totalAppraisedMM)
        ); //  Tổng MM đã thẩm định

        // let valTotalRealityMM = this.validateNumberChange(this.params.actualEffortList[index].totalRealityMM);
        objectInsert2.totalUsedMM = this.check4(
          this.params.actualEffortList[index].totalRealityMM
        ); //  Tổng MM sử dụng thực tế

        let totalMD = "";
        totalMD += this.checkNullorSpace(
          this.params.actualEffortList[index].monthValue1
        ); //  Tháng 1 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue2
          ); //  Tháng 2 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue3
          ); //  Tháng 3 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue4
          ); //  Tháng 4 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue5
          ); //  Tháng 5 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue6
          ); //  Tháng 6 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue7
          ); //  Tháng 7 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue8
          ); //  Tháng 8 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue9
          ); //  Tháng 9 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue10
          ); //  Tháng 10 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue11
          ); //  Tháng 11 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue12
          ); //  Tháng 12 (MD)
        objectInsert2.monthValues = totalMD; //  Tổng MD sử dụng thực tế
        objectInsert2.numTTrPakd = this.params.actualEffortList[
          index
        ].numberTTrPAKD; //  TTrPard
        //  call api insert thông tin nỗ lực sử dụng thực tế
        lstObject.push(objectInsert2);
      }
      this.insertDataTTNLSDTT(lstObject, 2);
    } else {
      this.toastService.openSuccessToast("Cập nhật thành công");
      this.onCancel(1);
    }
  }

  // insert data tới thông tin nỗ lực thực tế
  insertDataTTNLTT(outsourcingContractId: any, type: string) {
    const paramsActualEffortListLength = this.params.actualEffortList.length;
    if (paramsActualEffortListLength !== 0) {
      let lstObject: any = [];
      for (let index = 0; index < paramsActualEffortListLength; index++) {
        const objectInsert2: any = {};
        objectInsert2.id = this.params.actualEffortList[index].id; // id
        objectInsert2.createDate = ""; //  CreateDate
        objectInsert2.createUser = ""; //  UserCreateId
        objectInsert2.updateDate = ""; //  updateDate
        objectInsert2.UserModifyId = ""; //  UserModifyId
        if (type === "add") {
          objectInsert2.isActive = 1;
        }
        objectInsert2.outsourcingContractId = outsourcingContractId; //  ID Hợp đồng thuê ngoài
        objectInsert2.partnerId = this.params.actualEffortList[index].partnerId; // id đối tác
        objectInsert2.projectId = this.params.actualEffortList[index].projectId; //  id dự án
        objectInsert2.lstOutsourcePlanId = this.params.actualEffortList[
          index
        ].lstOutsourcePlanId; // danh sách id kế hoạch thuê ngoài

        objectInsert2.lstPlanCode = this.params.actualEffortList[
          index
        ].lstPlanCode; // danh sách code kế hoạch thuê ngoài

        objectInsert2.estimateEffortStatus = this.params.actualEffortList[
          index
        ].estimateEffortStatus; //  ULNL

        objectInsert2.lstbusinessOrgName = this.check5(
          this.params.actualEffortList[index].lstbusinessOrgName
        );
        objectInsert2.lstbusinessOrgId = this.check5(
          this.params.actualEffortList[index].lstbusinessOrgId
        );

        objectInsert2.lstamId = this.check5(
          this.params.actualEffortList[index].lstamId
        );
        objectInsert2.lstamName = this.check5(
          this.params.actualEffortList[index].lstamName
        );

        objectInsert2.lstproductionOrgName = this.check5(
          this.params.actualEffortList[index].lstproductionOrgName
        );
        objectInsert2.lstproductionOrgId = this.check5(
          this.params.actualEffortList[index].lstproductionOrgId
        );

        objectInsert2.lstpmId = this.check5(
          this.params.actualEffortList[index].lstpmId
        );
        objectInsert2.lstpmName = this.check5(
          this.params.actualEffortList[index].lstpmName
        );

        objectInsert2.cooperationYear = this.params.actualEffortList[
          index
        ].cooperationYear; //  Năm hợp tác
        objectInsert2.totalAppraisedMM = this.validateNumberChange(
          this.params.actualEffortList[index].totalAppraisedMM
        ); //  Tổng MM đã thẩm định

        const valTotalRealityMM = this.validateNumberChange(
          this.params.actualEffortList[index].totalRealityMM
        );
        objectInsert2.totalUsedMM = valTotalRealityMM; //  Tổng MM sử dụng thực tế
        let totalMD = "";
        totalMD += this.checkNullorSpace(
          this.params.actualEffortList[index].monthValue1
        ); //  Tháng 1 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue2
          ); //  Tháng 2 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue3
          ); //  Tháng 3 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue4
          ); //  Tháng 4 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue5
          ); //  Tháng 5 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue6
          ); //  Tháng 6 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue7
          ); //  Tháng 7 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue8
          ); //  Tháng 8 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue9
          ); //  Tháng 9 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue10
          ); //  Tháng 10 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue11
          ); //  Tháng 11 (MD)
        totalMD +=
          ";" +
          this.checkNullorSpace(
            this.params.actualEffortList[index].monthValue12
          ); //  Tháng 12 (MD)
        objectInsert2.monthValues = totalMD; //  Tổng MD sử dụng thực tế
        objectInsert2.numTTrPakd = this.params.actualEffortList[
          index
        ].numberTTrPAKD; //  TTrParkd
        lstObject.push(objectInsert2);
      }
      this.insertDataTTNLSDTT(lstObject);
    } else {
      this.onCancel(1);
    }
  }

  // check null or space
  checkNullorSpace(val: any) {
    if (val === "") {
      return "";
    } else {
      let res = this.checkValue(val);
      return this.validateNumberChange(res);
    }
  }

  //  get partnerCode by partnerId
  getPartnerCodeById(id: any) {
    this.contractManagerService
      .getPartnerCodeById(id)
      .subscribe(res => (this.objPartner = res["data"]));
  }

  //  validate data from undefine to ''
  validateDataUndefine(data: any) {
    if (data === "undefined" || data === undefined) {
      return "";
    } else {
      return data;
    }
  }

  //  insert thông tin nỗ lực sử dụng thực tế
  insertDataTTNLSDTT(lstObj: any, index?: number) {
    this.contractManagerService.doInsertDataTNLTT(lstObj).subscribe(
      res => {
        const title = this.form.value.type;
        if (this.isShowToast) {
          this.isShowToast = false;
          if (title === "update") {
            this.toastService.openSuccessToast("Cập nhật thành công");
          } else {
            this.toastService.openSuccessToast("Thêm mới thành công");
          }
        }
        this.onCancel(1);
      },
      error => {
        this.translateService.instant(error);
      }
    );
  }

  //  trangnc
  onCancel(number?: any) {
    if (number === 1) {
      this.router.navigate(["/contract-management"]);
    } else {
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: "static"
      });
      modalRef.componentInstance.type = "confirm";
      modalRef.componentInstance.param = this.translateService.instant(
        "contractManagement.contractManagement"
      );
      modalRef.componentInstance.onCloseModal.subscribe(value => {
        if (value === true) {
          this.router.navigate(["/contract-management"]);
        }
      });
    }
  }

  //  trangnc
  onSearchUnit(event, params) {
    if (this.form.value["type"] === "update") {
      //  search các autocomplete khi update
      const words = params.split(";");
      const type = words[0];

      if (type === "duan") {
        this.listUnit$ = of([]);
        this.unitSearch1 = event.term;
        const term = event.term;
        if (term !== "") {
          this.notFoundText = "";
          $(".ng-option").css("display", "none");
        }
        //  search cho mã dự án khi update
        const index = words[1];
        this.contractManagerService
          .getAllProjectCodeOrName(event.term)
          .subscribe(res => {
            if (res["data"].length > 0) {
              this.params.actualEffortList[index].listUnit$ = of(res["data"]);
            } else {
              this.notFoundText = "common.select.notFoundText";
              $(".ng-option").css("display", "block");
              this.params.actualEffortList[index].listUnit$ = of([]);
            }
          });
      } else if (type === "doitac") {
        this.unitSearch = event.term;
        const term = event.term;
        if (term !== "") {
          this.notFoundText = "";
          $(".ng-option").css("display", "none");
        }
        //  search cho mã đối tác khi update
        this.contractManagerService
          .getAllPartnerCode(event.term)
          .subscribe(res => {
            if (res["data"].length > 0) {
              this.listDT$ = of(res["data"]);
            } else {
              this.notFoundText = "common.select.notFoundText";
              $(".ng-option").css("display", "block");
              this.listDT$ = of([]);
            }
          });
      } else if (type === "dmdnht") {
        this.unitSearch2 = event.term;
        const term = event.term;
        if (term !== "") {
          this.notFoundText = "";
          $(".ng-option").css("display", "none");
        }
        //  search cho đầu mối đề nghị hợp tác khi update
        const index = words[1];
        this.contractManagerService
          .doSearchEmailOrName(event.term)
          .subscribe(res => {
            if (res["data"].length > 0) {
              this.params.actualEffortList[index].listDMDVHT$ = of(res["data"]);
            } else {
              this.params.actualEffortList[index].listDMDVHT$ = of([]);
              this.notFoundText = "common.select.notFoundText";
              $(".ng-option").css("display", "block");
            }
          });
      } else if (type === "dmkd") {
        this.unitSearchDMKD = event.term;
        const term = event.term;
        if (term !== "") {
          this.notFoundText = "";
          $(".ng-option").css("display", "none");
        }
        //  search cho đầu mối đề nghị hợp tác khi update
        const index = words[1];
        this.contractManagerService
          .doSearchEmailOrName(event.term)
          .subscribe(res => {
            if (res["data"].length > 0) {
              this.params.actualEffortList[index].listDMKD$ = of(res["data"]);
            } else {
              this.notFoundText = "common.select.notFoundText";
              $(".ng-option").css("display", "block");
              this.params.actualEffortList[index].listDMKD$ = of([]);
            }
          });
      } else if (type === "dmkt") {
        this.unitSearchDMKT = event.term;
        const term = event.term;
        if (term !== "") {
          this.notFoundText = "";
          $(".ng-option").css("display", "none");
        }
        //  search cho đầu mối đề nghị hợp tác khi update
        const index = words[1];
        this.contractManagerService
          .doSearchEmailOrName(event.term)
          .subscribe(res => {
            if (res["data"].length > 0) {
              this.params.actualEffortList[index].listDMKT$ = of(res["data"]);
            } else {
              this.params.actualEffortList[index].listDMKT$ = of([]);
              this.notFoundText = "common.select.notFoundText";
              $(".ng-option").css("display", "block");
            }
          });
      }
    } else if (
      this.form.value["type"] === "add" ||
      this.form.value["type"] === "create"
    ) {
      this.unitSearch = event.term;
      const words = params.split(";");
      const index = words[1];
      const term = event.term;
      const objParam = term + ";" + params;
      if (term !== "") {
        this.debouncer.next(objParam);
      } else {
        this.params.actualEffortList[index].listUnit$ = of([]);
        //this.listUnit$ = of([]);
        this.listDT$ = of([]);
        this.listDMDVHT$ = of([]);
        this.listDMKT$ = of([]);
        this.listDMKD$ = of([]);
      }
    }
  }

  // trangnc
  debounceOnSearch() {
    this.debouncer
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => {
        this.loadDataOnSearchUnit(value);
      });
  }

  // trangnc - thêm mới call data cho autocomplete
  loadDataOnSearchUnit(term) {
    this.params.actualEffortList;
    const words = term.split(";");
    const wordSearch = words[0];
    const typeSearch = words[1];

    if (typeSearch === "duan") {
      //  search cho mã dự án
      const index = words[2];
      this.unitSearch1 = wordSearch;
      const term1 = term.term;
      if (term1 !== "") {
        this.notFoundText = "";
        $(".ng-option").css("display", "none");
      }
      this.contractManagerService
        .getAllProjectCodeOrName(wordSearch)
        .subscribe(res => {
          if (res["data"].length > 0) {
            this.params.actualEffortList[index].listUnit$ = of(res["data"]);
          } else {
            this.notFoundText = "common.select.notFoundText";
            $(".ng-option").css("display", "block");
            this.params.actualEffortList[index].listUnit$ = of([]);
          }
        });
    } else if (typeSearch === "dmdnht") {
      //  search cho đầu mối đơn vị hợp tác
      const index = words[2];
      this.unitSearch2 = wordSearch;
      this.contractManagerService
        .doSearchEmailOrName(wordSearch)
        .subscribe(res => {
          if (res["data"].length > 0) {
            this.params.actualEffortList[index].listDMDVHT$ = of(res["data"]);
          } else {
            this.params.actualEffortList[index].listDMDVHT$ = of([]);
          }
        });
    } else if (typeSearch === "doitac") {
      //  search cho mã đối tác
      this.contractManagerService
        .getAllPartnerCode(wordSearch)
        .subscribe(res => {
          if (res["data"].length > 0) {
            this.listDT$ = of(res["data"]);
          } else {
            this.listDT$ = of([]);
          }
        });
    } else if (typeSearch === "dmkd") {
      //  search cho đầu mối kinh doanh
      const index = words[2];
      this.unitSearchDMKD = wordSearch;
      this.contractManagerService
        .doSearchEmailOrName(wordSearch)
        .subscribe(res => {
          if (res["data"].length > 0) {
            this.params.actualEffortList[index].listDMKD$ = of(res["data"]);
          } else {
            this.params.actualEffortList[index].listDMKD$ = of([]);
          }
        });
    } else if (typeSearch === "dmkt") {
      //  search cho  đầu mối kĩ thuật
      const index = words[2];
      this.unitSearchDMKT = wordSearch;
      this.contractManagerService
        .doSearchEmailOrName(wordSearch)
        .subscribe(res => {
          if (res["data"].length > 0) {
            this.params.actualEffortList[index].listDMKT$ = of(res["data"]);
          } else {
            this.params.actualEffortList[index].listDMKT$ = of([]);
          }
        });
    }
  }

  //  trangnc get all plan theo planstatus = 'phê duyệt'
  getAllPlan() {
    // this.contractManagerService.getAllPlanFollowApprove().subscribe(res => (this.outsourcePlans = res['data']));
  }

  //  trangnc get all năm hợp tác
  /*
  //QuangHN cmt do not get data from db
  getAllYear() {
    this.contractManagerService.getSignStatusOrContractStatus('NHT').subscribe(res => (this.cooperationYearList = res));
  }
  */

  // trangnc
  //  convert date format Mon May 18 2020 12:00:00 GMT+0700 (Indochina Time) ---> yyyy/MM/dd
  convertDate(str) {
    const date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  // trangnc chọn select trong khtn -> hiển thị column đơn vị kinh doanh, đầu mối kinh doanh, đơn vị sản xuất, đầu mối kĩ thuật
  callAll(index, value) {
    if (value !== "") {
      this.contractManagerService.getBusiness(value).subscribe(res => {
        this.funcToList(index, res);
      });
    } else {
      this.params.actualEffortList[index].flagOutSourcingPlan = false; // hiển thị cho phép nhâp
      this.params.actualEffortList[index].flagMMOS = false; //  cho phép nhập
      this.clearData(index);
    }
    this.onChangeTotalMD(index);
  }

  // trangnc don vi kinh doanh,dau moi kinh doanh, don vi san xuat, dau moi ky thuat, MMOS = ''
  clearData(effortIndex?: number) {
    let index = (this.currentPage - 1) * this.numberPerPage + effortIndex;
    this.params.actualEffortList[index].businessOrganizationId = ""; // id đơn vị kinh doanh
    this.params.actualEffortList[index].businessClueUserId = ""; // id đầu mối kinh doanh
    this.params.actualEffortList[index].manufacturingOrganizationId = ""; //id  đơn vị sản xuất
    this.params.actualEffortList[index].technicalClueUserId = ""; // id đầu mối kỹ thuật
    this.params.actualEffortList[index].businessOrgName = ""; // tên đơn vị kinh doanh
    this.params.actualEffortList[index].amName = ""; // tên đầu mối kinh doanh
    this.params.actualEffortList[index].productionOrgName = ""; // tên đơn vị sản xuất
    this.params.actualEffortList[index].pmName = ""; // tên đầu mối kỹ thuật
    this.params.actualEffortList[index].totalAppraisedMM = ""; // MMOS
    this.getListDVSXDVKD(index);
  }

  // trangnc get don vi kinh doanh,dau moi kinh doanh, don vi san xuat, dau moi ky thuat theo mã dự án
  funcToList(index, res) {
    this.params.actualEffortList[index].lstbusinessOrgId =
      res.data[0].businessOrg;
    this.params.actualEffortList[index].lstbusinessOrgName =
      res.data[0].businessOrgName;
    this.params.actualEffortList[index].businessOrganizationId =
      res.data[0].businessOrg; // id đơn vị kinh doanh
    this.params.actualEffortList[index].businessOrgName =
      res.data[0].businessOrgName; // tên đơn vị kinh doanh

    this.params.actualEffortList[index].lstamName = res.data[0].amName;
    this.params.actualEffortList[index].lstamId = res.data[0].am;
    this.params.actualEffortList[index].businessClueUserId = res.data[0].am; // id đầu mối kinh doanh
    this.params.actualEffortList[index].amName = res.data[0].amName; // đầu mối kinh doanh

    this.params.actualEffortList[index].lstproductionOrgId =
      res.data[0].productionOrg;
    this.params.actualEffortList[index].lstproductionOrgName =
      res.data[0].productionOrgName;
    this.params.actualEffortList[index].manufacturingOrganizationId =
      res.data[0].productionOrg; //id  đơn vị sản xuất
    this.params.actualEffortList[index].productionOrgName =
      res.data[0].productionOrgName; // đơn vị sản xuất

    this.params.actualEffortList[index].lstpmId = res.data[0].pm;
    this.params.actualEffortList[index].lstpmName = res.data[0].pmName;
    this.params.actualEffortList[index].technicalClueUserId = res.data[0].pm; // id đầu mối kỹ thuật
    this.params.actualEffortList[index].pmName = res.data[0].pmName; // đầu mối kỹ thuật
    //
    this.params.actualEffortList[index].flagOutSourcingPlan = true; // ẩn đi không cho phép nhập
    this.params.actualEffortList[index].lstPlanCode = ""; // danh sách mã kế hoạch
    this.params.actualEffortList[index].lstOutsourcePlanId = ""; // danh sách id kế hoạch
    this.params.actualEffortList[index].outsourcePlanId = ""; //

    // mmOS -> Tổng MM đã thẩm định
    const dataMMOS = res.data[0].mmOs;
    if (res.data[0].mmOs !== "null" && res.data[0].mmOs !== null) {
      this.params.actualEffortList[index].totalAppraisedMM = res.data[0].mmOs;
      this.params.actualEffortList[index].flagMMOS = true; // ẩn đi không cho phép nhập
    } else {
      this.params.actualEffortList[index].totalAppraisedMM = "";
      this.params.actualEffortList[index].flagMMOS = false; //  cho phép nhập
    }

    this.onChangeTotalMD(index);
  }

  // trangnc clear function autocomplete
  onClearUnit(type: any, index?: number) {
    if (type === "doitac") {
      this.listDT$ = of([]);
      this.unitSearch = "";
    } else if (type === "duan") {
      this.params.actualEffortList[index].listUnit$ = of([]);
      this.unitSearch1 = "";
      this.onChangeTotalMD(index);
      this.clearData(index);
    }
  }

  // trangnc onSearchUnitClose() cho autocomplete
  onSearchUnitClose(type: any, index?: number) {
    if (type === "doitac") {
      this.listDT$ = of([]);
      this.unitSearch = "";
    } else if (type === "duan") {
      this.params.actualEffortList[index].listUnit$ = of([]);
      this.unitSearch1 = "";
    }
  }

  // validate mã đối tác khi trống
  validateEmpty() {
    const val = this.form.value.partnerId;
    const size = val === null ? 0 : val.length;
    if (size <= 0) {
      this.clErrorPartner = "has-error";
      this.errorPartner = "paterCode";
      this.messageErrorPartner = "Mã đối tác bắt buộc chọn";
    } else {
      this.clErrorPartner = "";
      this.errorPartner = "";
      this.messageErrorPartner = "";
    }
  }

  // lấy danh sách đơn vị sản xuất và đơn vị kinh doanh
  getListDVSXDVKD(index?: any) {
    this.contractManagerService
      .doGetListDVKDAndDVSX("SX")
      .subscribe(
        res => (this.params.actualEffortList[index].listDVSX$ = res.data)
      );
    this.contractManagerService
      .doGetListDVKDAndDVSX("KD")
      .subscribe(
        res => (this.params.actualEffortList[index].listDVKD$ = res.data)
      );
  }

  //
  customSearchFn(term: string, item: any) {
    const replacedKey = term.replace(REGEX_PATTERN.SEARCH_DROPDOWN_LIST, "");
    const newRegEx = new RegExp(replacedKey, "gi");
    const purgedPosition = item.name.replace(
      REGEX_PATTERN.SEARCH_DROPDOWN_LIST,
      ""
    );
    return newRegEx.test(purgedPosition);
  }

  onChangePosition(event, index, flag) {
    if (event) {
      if (flag === "dvsx") {
        this.params.actualEffortList[index].manufacturingOrganizationId =
          event.id;
      } else if (flag === "dvkd") {
        this.params.actualEffortList[index].businessOrganizationId = event.id;
      }
    }
  }

  onClearPosition(index, flag) {
    if (flag === "dvsx") {
      this.params.actualEffortList[index].manufacturingOrganizationId = "";
    } else if (flag === "dvkd") {
      this.params.actualEffortList[index].businessOrganizationId = "";
    }
  }

  onPaste(event: ClipboardEvent, nameField?: string, size?: number) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData("text");
    /*    if (nameField === 'numContract') {*/
    if (pastedText.length <= size) {
      this.form.get(nameField).setValue(pastedText);
      return false;
    } else if (pastedText.length > size) {
      const res = pastedText.substring(0, size);
      this.form.get(nameField).setValue(res);
      return false;
    }
    /* } else {
       if (pastedText.length <= 1000) {
         this.form.get(nameField).setValue(pastedText);
         return false;
       } else if (pastedText.length > 1000) {
         const res = pastedText.substring(0, 1000);
         this.form.get(nameField).setValue(res);
         return false;
       }*/
  }

  onPasteL(
    event: ClipboardEvent,
    nameField?: string,
    index?: number,
    size?: number
  ) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData("text");
    let numberContract = "";
    if (pastedText.length < size) {
      numberContract = pastedText;
    } else if (pastedText.length >= size) {
      const res = pastedText.substring(0, size);
      numberContract = res;
    }
    if (nameField === "numberContract") {
      this.params.actualEffortList[index].numberContract = numberContract;
      return false;
    } else if (nameField === "outsourcingOrganizationName") {
      this.params.actualEffortList[
        index
      ].outsourcingOrganizationName = numberContract;
      return false;
    } else if (nameField === "numberTTrPAKD") {
      this.params.actualEffortList[index].numberTTrPAKD = numberContract;
      return false;
    } else if (nameField === "nameClue") {
      this.params.partnerJoinList[index].nameClue = numberContract;
      return false;
    }
  }

  // page
  previousPage(type?: number) {
    if (type === 1) {
      // list đối tác tham gia
      if (this.currentPage2 !== 1) {
        this.currentPage2 -= 1;
        this.loadList(1);
      }
    } else {
      // list nỗ lực thực tế
      if (this.currentPage !== 1) {
        this.currentPage -= 1;
        this.loadList();
      }
    }
  }

  nextPage(type?: number) {
    if (type === 1) {
      // list đối tác tham gia
      if (this.currentPage2 !== this.numberOfPages2) {
        this.currentPage2 += 1;
        this.loadList(1);
      }
    } else {
      // list nỗ lực thực tế
      if (this.currentPage !== this.numberOfPages) {
        this.currentPage += 1;
        this.loadList();
      }
    }
  }

  loadList(type?: number) {
    if (type === 1) {
      // đối tác tham gia
      const begin = (this.currentPage2 - 1) * this.numberPerPage2;
      const end = begin + Number(this.numberPerPage2);
      this.params.partnerJoinList2 = this.pageList2.slice(begin, end);
    } else {
      const begin = (this.currentPage - 1) * this.numberPerPage;
      const end = begin + Number(this.numberPerPage);
      // this.params.actualEffortList = this.pageList.slice(begin, end);
      this.params.actualEffortList2 = this.pageList.slice(begin, end);
    }
  }

  arrPage(type?: number) {
    if (type === 1) {
      // list đối tác tham gia
      this.pageList2 = this.params.partnerJoinList;
      this.numberOfPages2 = Math.ceil(
        this.pageList2.length / this.numberPerPage2
      );
      this.arrNumberOfPages2 = Array(this.numberOfPages2).fill(4);
      // cập nhật lại số bản ghi
      this.numRecord2 = this.params.partnerJoinList.length;
    } else {
      // list nỗ lực thực tế
      this.pageList = this.params.actualEffortList;
      this.numberOfPages = Math.ceil(this.pageList.length / this.numberPerPage);
      this.arrNumberOfPages = Array(this.numberOfPages).fill(4);
      // cập nhật lại số bản ghi
      this.numRecord = this.params.actualEffortList.length;
    }
  }

  firstPage(type?: number) {
    if (type === 1) {
      // đối tác
      this.currentPage2 = 1;
      this.loadList(1);
    } else {
      this.currentPage = 1;
      this.loadList();
    }
  }

  lastPage(type?: number) {
    if (type === 1) {
      // list đối tác tham gia
      this.currentPage2 = this.numberOfPages2;
      this.loadList(1);
    } else {
      // list nỗ lực thực tế
      this.currentPage = this.numberOfPages;
      this.loadList();
    }
  }

  checkFirstAndPrev(type?: number) {
    if (type === 1) {
      // list đối tác tham gia
      if (this.currentPage2 === 1) {
        return "disabled";
      } else {
        return "";
      }
    } else {
      // list nỗ lực thực tế
      if (this.currentPage === 1) {
        return "disabled";
      } else {
        return "";
      }
    }
  }

  checkNextAndLast(type?: number) {
    if (type === 1) {
      // list đối tác tham gia
      if (this.currentPage2 === this.numberOfPages2) {
        return "disabled";
      } else {
        return "";
      }
    } else {
      // list nỗ lực thực tế
      if (this.currentPage === this.numberOfPages) {
        return "disabled";
      } else {
        return "";
      }
    }
  }

  checkActive(k: number, type?: number) {
    if (type === 1) {
      // list đối tác tham gia
      if (this.currentPage2 === k + 1) {
        return "active";
      } else {
        return "";
      }
    } else {
      // list nỗ lực thực tế
      if (this.currentPage === k + 1) {
        return "active";
      } else {
        return "";
      }
    }
  }

  changePage(num: number, type?: number) {
    if (type === 1) {
      // list đối tác tham gia
      this.currentPage2 = num + 1;
      this.loadList(1);
    } else {
      // list nỗ lực thực tế
      this.currentPage = num + 1;
      this.loadList();
    }
  }

  onChangePage(value?: number, type?: number) {
    if (type === 1) {
      // list đối tác tham gia
      this.numberPerPage2 = value;
      this.numberOfPages2 = Math.ceil(
        this.pageList2.length / this.numberPerPage2
      );
      //nếu số trang hiên tại lớn tổng số page -> page cuối cùng
      if (this.numberOfPages2 < this.currentPage2) {
        this.currentPage2 = this.numberOfPages2;
      }
      this.arrNumberOfPages2 = Array(this.numberOfPages2).fill(4);
      // cập nhật lại số bản ghi
      this.numRecord2 = this.params.partnerJoinList.length;
      this.loadList(1);
    } else {
      // list thông tin nố lực thực tế
      this.numberPerPage = value;
      this.numberOfPages = Math.ceil(this.pageList.length / this.numberPerPage);
      //nếu số trang hiên tại lớn tổng số page -> page cuối cùng
      if (this.numberOfPages < this.currentPage) {
        this.currentPage = this.numberOfPages;
      }
      this.arrNumberOfPages = Array(this.numberOfPages).fill(4);
      // cập nhật lại số bản ghi
      this.numRecord = this.params.actualEffortList.length;
      this.loadList();
    }
  }

  // code chức năng đối tác tham gia  --- start
  onClickAddPartnerJoin() {
    this.currentPage2 = 1;
    this.loadList(1);
    const obj = {
      id: "", // id bản ghi
      idContract: "", // id hợp đồng
      partnerId: null, // id đối tác
      partnerCode: null, // mã đối tác
      partnerName: "", // tên đối tác
      outsourcingOrganizationId: null, // đơn vị thuê ngoài id
      outsourcingOrganizationName: "", // đơn vị thuê ngoài name
      nameClue: "", // đầu mối đề nghị hợp tác
      outsourcingMMTotal: "", // tổng MM thuê ngoài
      mmUsing: "", // MM sử dụng lũy kế
      mmPayed: "", // MM đã thanh toán
      mmOwed: "", // MM còn nợ
      moneyOwed: "", // Số tiền còn nợ
      status: false // trạng thái
    };
    this.params.partnerJoinList.unshift(obj);
    this.params.partnerJoinList2.unshift(obj);
    this.btnDisabled = true;
    this.buttonDisabled = true;
  }

  // btn Edit
  onClickEditPartnerJoin(JoinIndex?: number) {
    let index = (this.currentPage2 - 1) * this.numberPerPage2 + JoinIndex;
    this.params.partnerJoinList[index].status = false;
    this.btnDisabled = true;
    this.objCloneJoin = JSON.parse(
      JSON.stringify(this.params.partnerJoinList[index])
    );
    /* thanhnb */
    this.buttonDisabled = true;
    /* thanhnb */
  }

  //btn Delete
  onDeletePartnerJoin(JoinIndex?: number) {
    let index = (this.currentPage2 - 1) * this.numberPerPage2 + JoinIndex;
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: "static"
    });
    const idDelete = this.params.partnerJoinList[index].id;
    modalRef.componentInstance.type = "delete";
    modalRef.componentInstance.param = this.translateService.instant(
      "contractPartner.title-delete"
    );
    modalRef.componentInstance.onCloseModal.subscribe(value => {
      if (value === true) {
        if (
          idDelete !== "" ||
          idDelete !== "undefined" ||
          idDelete !== undefined
        ) {
          // dành cho update
          this.objDeleteJoin = JSON.parse(
            JSON.stringify(this.params.partnerJoinList[index])
          );
          this.objDeleteDBJoin = this.converJoinObj();
          this.lstdataDeleteJoin.push(this.objDeleteDBJoin);

          this.params.actualEffortList.forEach(element => {
            if (element.partnerId === this.objDeleteJoin.partnerId) {
              element.partnerId = "";
              element.partnerCode = "";
              element.partnerName = "";
            }
          });
          this.objDeleteJoin = {};
          this.objDeleteDBJoin = {};
        }
        this.params.partnerJoinList.splice(index, 1);
        this.actualEffortListSort = JSON.parse(
          JSON.stringify(this.params.partnerJoinList)
        );
        this.actualEffortListSort = this.actualEffortListSort.sort((a, b) =>
          a.partnerCode.toLowerCase() > b.partnerCode.toLowerCase() ? 1 : -1
        );
        this.arrPage(1);
        this.loadList(1);
        //
        this.toastService.openSuccessToast(
          this.translateService.instant(
            "common.toastr.messages.success.delete",
            {
              paramName: this.translateService.instant("contractPartner.title")
            }
          )
        );
      }
    });
  }

  // btn không sửa
  onNotUpdatePartnerJoin(JoinIndex?: number) {
    let index = (this.currentPage - 1) * this.numberPerPage + JoinIndex;
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: "static"
    });
    modalRef.componentInstance.type = "confirm";
    modalRef.componentInstance.param = this.translateService.instant(
      "contractManagement.partnerJoin.partnerJoin"
    );

    modalRef.componentInstance.onCloseModal.subscribe(value => {
      this.spinner.show();
      if (value === true) {
        this.doNotUpdatePartnerJoin(index);
      }
      this.spinner.hide();
    });
  }

  doNotUpdatePartnerJoin(index2?: number) {
    let index = (this.currentPage2 - 1) * this.numberPerPage2 + index2;
    if (this.objCloneJoin.partnerId === undefined) {
      // khi bản ghi không có dữ liệu
      this.params.partnerJoinList.splice(index, 1);
      this.params.partnerJoinList2.splice(index, 1);
      this.btnDisabled = false;
    } else {
      /*  // khi bản ghi có dữ liệu
      this.params.partnerJoinList[index].id = this.objCloneJoin.id; // id bản ghi
      (this.params.partnerJoinList[index].partnerId = this.objCloneJoin.partnerId), // id đối tác
        (this.params.partnerJoinList[index].partnerCode = this.objCloneJoin.partnerCode), // mã đối tác
        (this.params.partnerJoinList[index].partnerName = this.objCloneJoin.partnerName), // tên đối tác
        (this.params.partnerJoinList[index].outsourcingOrganizationId = this.objCloneJoin.outsourcingOrganizationId), // đơn vị thuê ngoài id
        (this.params.partnerJoinList[index].outsourcingOrganizationName = this.objCloneJoin.outsourcingOrganizationName), // đơn vị thuê ngoài name
        (this.params.partnerJoinList[index].nameClue = this.objCloneJoin.nameClue), // đầu mối đề nghị hợp tác
        (this.params.partnerJoinList[index].outsourcingMMTotal = this.objCloneJoin.outsourcingMMTotal), // tổng MM thuê ngoài
        (this.params.partnerJoinList[index].mmUsing = this.objCloneJoin.mmUsing), // MM sử dụng lũy kế
        (this.params.partnerJoinList[index].mmPayed = this.objCloneJoin.mmPayed), // MM đã thanh toán
        (this.params.partnerJoinList[index].mmOwed = this.objCloneJoin.mmOwed), // MM còn nợ
        (this.params.partnerJoinList[index].moneyOwed = this.objCloneJoin.moneyOwed); // Số tiền còn nợ*/

      this.params.partnerJoinList[index] = JSON.parse(
        JSON.stringify(this.objCloneJoin)
      );
      this.params.partnerJoinList2[index] = JSON.parse(
        JSON.stringify(this.objCloneJoin)
      );

      // this.params.partnerJoinList[index].partnerId = Number(this.params.partnerJoinList[index].partnerId);
      // this.params.partnerJoinList2[index].partnerId = Number(this.params.partnerJoinList2[index].partnerId);
      this.params.partnerJoinList[index].status = true;
      this.params.partnerJoinList2[index].status = true;

      const dataDefaultPartner = {
        id: this.params.partnerJoinList[index].partnerId,
        partnerCode: this.params.partnerJoinList[index].partnerCode,
        partnerName: this.params.partnerJoinList[index].partnerName,
        partnerShortName: this.params.partnerJoinList[index].partnerShortName
      };
      this.params.partnerJoinList[index].listJoinDT$ = of([dataDefaultPartner]);
      this.params.partnerJoinList2[index].listJoinDT$ = of([
        dataDefaultPartner
      ]);

      this.btnDisabled = false;
      this.objCloneJoin = {};
    }
    this.buttonDisabled = false;
    this.clErrorPayed = "";
  }

  // btn có sửa
  onUpdatePartnerJoin(index2?: number) {
    let index = (this.currentPage2 - 1) * this.numberPerPage2 + index2;
    const partnerId = this.params.partnerJoinList[index].partnerId; // mã đối tác
    this.params.partnerJoinList[index].clJoinPartnerId = "";
    if (partnerId === "" || partnerId === null) {
      this.params.partnerJoinList[index].clJoinPartnerId = "has-error";
      this.toastService.openErrorToast("Mã đối tác bắt buộc chọn");
    } else {
      // check mã đối tác là duy nhất
      if (this.params.partnerJoinList.length !== 1) {
        for (let i = 1; i < this.params.partnerJoinList.length; i++) {
          const element = this.params.partnerJoinList[i].partnerId;
          if (element === this.params.partnerJoinList[0].partnerId) {
            this.params.partnerJoinList[index].clJoinPartnerId = "has-error";
            this.toastService.openErrorToast("Mã đối tác bị trùng");
            return;
          }
        }
        this.params.partnerJoinList[index].status = true;
        this.btnDisabled = false;
        /* start thanhnb Update */
        this.buttonDisabled = false;
        /* end thanhnb Update */
      } else {
        this.params.partnerJoinList[index].status = true;
        this.btnDisabled = false;
        /* start thanhnb Update */
        this.buttonDisabled = false;
        /* end thanhnb Update */
      }
      this.arrPage(1);
      this.loadList(1);
    }

    this.actualEffortListSort = JSON.parse(
      JSON.stringify(this.params.partnerJoinList)
    );
    this.actualEffortListSort = this.actualEffortListSort.sort((a, b) =>
      a.partnerCode.toLowerCase() > b.partnerCode.toLowerCase() ? 1 : -1
    );
  }

  // search mã đối tác list tham gia
  onSearchJoinUnit(event, params?: string) {
    const words = params.split(";");
    const type = words[0];
    if (type === "doitac") {
      this.joinUnitSearch1 = event.term;
      const term = event.term;
      if (term !== "") {
        this.notFoundText = "";
        $(".ng-option").css("display", "none");
      }
      const index = words[1];
      this.contractManagerService
        .getAllPartnerCode(event.term)
        .subscribe(res => {
          // search theo mã
          if (res["data"].length > 0) {
            // check mã đối tác là duy nhất
            this.params.partnerJoinList[index].listJoinDT$ = of(res["data"]);
          } else {
            $(".ng-option").css("display", "block");
            this.notFoundText = "common.select.notFoundText";
            this.params.partnerJoinList[index].listJoinDT$ = of([]);
          }
        });
    } else if (type === "dvtn") {
      this.joinUnitSearch2 = event.term;
      const term = event.term;
      if (term !== "") {
        this.notFoundText = "";
        $(".ng-option").css("display", "none");
      }
      const index = words[1];
      this.contractManagerService.doGetDVTN(event.term).subscribe(res => {
        // search theo short name
        if (res) {
          this.params.partnerJoinList[index].listJoinDVTN$ = of(res);
        } else {
          this.notFoundText = "common.select.notFoundText";
          $(".ng-option").css("display", "block");
          this.params.partnerJoinList[index].listJoinDVTN$ = of([]);
        }
      });
    }
  }

  clearSpanceJoin(index2?: number, name?: string) {
    let index = (this.currentPage2 - 1) * this.numberPerPage2 + index2;
    let val = this.params.partnerJoinList[index][name];
    try {
      if (Number(val) === 0) {
        this.params.partnerJoinList[index][name] = "";
      }
    } catch (e) {
      this.toastService.openErrorToast(e.message);
      return;
    }
  }

  totalMMOWedJoin(index2?: any) {
    const index = (this.currentPage2 - 1) * this.numberPerPage2 + index2;
    const outsourcingMMTotal = this.checkValue(
      this.params.partnerJoinList[index].outsourcingMMTotal
    ); // tổng MM thuê ngoài
    const mmPayed = this.checkValue(this.params.partnerJoinList[index].mmPayed); // mm da thanh toan
    const mmOwed: any =
      this.validateNumberChange(outsourcingMMTotal) -
      this.validateNumberChange(mmPayed); // MM còn nợ

    const resMmOwed = parseFloat(mmOwed.toFixed(2))
      .toString()
      .replace(".", ",");
    if (
      mmOwed > 0 ||
      mmOwed < 0 ||
      ((mmOwed === 0 &&
        Number(this.validateNumberChange(outsourcingMMTotal)) > 0) ||
        Number(this.validateNumberChange(mmPayed) > 0))
    ) {
      this.params.partnerJoinList[index].mmOwed = resMmOwed;
    } else {
      this.params.partnerJoinList[index].mmOwed = "";
    }

    const price = this.checkValue(this.form.value.price);
    const priceNum = this.validateNumberChange(price); // xử ký price có dấu ','
    if (priceNum > 0) {
      const moneyOwed = mmOwed * priceNum; // so tien con no
      const resMoneyOwed = parseFloat(moneyOwed.toFixed(2))
        .toString()
        .replace(".", ",");
      if (
        moneyOwed > 0 ||
        (mmOwed < 0 && resMoneyOwed.length < 23) ||
        ((moneyOwed === 0 &&
          Number(this.validateNumberChange(outsourcingMMTotal)) > 0) ||
          Number(this.validateNumberChange(mmPayed) > 0))
      ) {
        this.params.partnerJoinList[index].moneyOwed = resMoneyOwed;
      } else if (resMoneyOwed.length > 23) {
        this.params.partnerJoinList[index].moneyOwed = "";
        this.toastService.openWarningToast(
          "Số tiền còn nợ trong đối tác tham gia lớn hơn giá trị cho phép"
        );
      } else {
        this.params.partnerJoinList[index].moneyOwed = "";
      }
    } else {
      this.params.partnerJoinList[index].moneyOwed = "";
    }
  }

  checkValue(value) {
    if (
      value === "" ||
      value === undefined ||
      value === null ||
      value === "null"
    ) {
      return 0;
    } else {
      return value;
    }
  }

  check5(data: any) {
    data = data + "";
    if (data === "" || data === "null" || data === null) {
      return "";
    } else {
      if (data.charAt(0) !== ",") {
        data = "," + data + ",";
      }
      return data;
    }
  }

  check4(data: any) {
    data = data + "";

    if (data === 0) {
      return Number(data);
    }

    data = data + "";
    if (data.includes(".")) {
      while (data.toString().includes(".")) {
        data = data.replace(".", ";"); // . -> ;
      }
    }

    if (data.includes(",")) {
      while (data.toString().includes(",")) {
        data = data.replace(",", ".");
      }
    }

    if (data.includes(";")) {
      while (data.toString().includes(";")) {
        data = data.replace(";", ",");
      }
    }
    return data;
  }

  check6(data: any) {
    data = data + "";

    if (data === 0) {
      return Number(data);
    }

    if (data.includes(",")) {
      while (data.toString().includes(",")) {
        data = data.replace(",", "");
      }
    }
    return data;
  }

  changePartnerJoin(event, index) {
    if (event !== undefined) {
      this.params.partnerJoinList[index].partnerId = event.id;
      this.params.partnerJoinList[index].partnerCode = event.partnerCode;
      this.params.partnerJoinList[index].partnerName = event.partnerName;
      // những record có mã đối tác trong thông tin nỗ lực thực tế cũng thay đổi theo
      this.params.actualEffortList.forEach(element => {
        if (element.partnerId === "") {
          element.partnerId = event.id;
          element.partnerCode = event.partnerCode;
          element.partnerName = event.partnerName;
        }
      });
      this.arrPage();
      this.loadList();
    }
  }

  insertDataToPartnerJoin(idContract, type: string) {
    const lengthJoin = this.params.partnerJoinList.length;
    if (lengthJoin !== 0) {
      let index = 0;
      this.params.partnerJoinList.forEach(element => {
        const obj: any = {};
        index++;
        obj.contractCode = idContract; // id hợp đồng
        obj.partnerId = element.partnerId; // id đối tác
        obj.nameClue = element.nameClue; // Đầu mối đề nghị hợp tác
        if (type === "add") {
          obj.isActive = 1;
        }
        obj.outsourcingOrganizationId = element.outsourcingOrganizationId; // Đơn vị thuê ngoài

        if (element.outsourcingMMTotal === "") {
          obj.outsourcingMMTotal = "";
        } else {
          const outsourcingMMTotal = this.validateNumberChange(
            element.outsourcingMMTotal
          );
          obj.outsourcingMMTotal = outsourcingMMTotal; // Tổng MM thuê ngoài
        }

        if (element.mmUsing === "") {
          obj.mmUsing = "";
        } else {
          const mmUsing = this.validateNumberChange(element.mmUsing);
          obj.mmUsing = mmUsing; // MM sử dụng lũy kế
        }

        if (element.mmPayed === "") {
          obj.mmPayed = "";
        } else {
          let mmPayed = this.validateNumberChange(element.mmPayed);
          obj.mmPayed = mmPayed; // MM đã thanh toán
        }

        if (element.mmOwed === "") {
          obj.mmOwed = "";
        } else {
          let mmOwed = this.validateNumberChange(element.mmOwed);
          obj.mmOwed = mmOwed; // MM còn nợ
        }

        if (element.moneyOwed === "") {
          obj.moneyOwed = "";
        } else {
          let moneyOwed = this.validateNumberChange(element.moneyOwed);
          obj.moneyOwed = moneyOwed; // Số tiền còn nợ
        }
        obj.isActive = 1; // Trạng thái xóa (0: Đã xóa; 1:Hoạt động)
        // call api insert đối tác tham gia
        this.insertDataForTableJoin(obj, index);
      });
    }
  }

  // insert data tới đối tác tham gia
  insertDataForTableJoin(obj: any, index: number) {
    this.contractManagerService
      .doInsertDataToPartnerJoin(obj)
      .subscribe(res => {
        // search theo short name
        if (res["data"].length <= 0) {
          this.toastService.openErrorToast(
            this.translateService.instant(
              "thêm bản ghi thứ " + (index + 1) + "đối tác tham gia thất bại !"
            )
          );
        }
      });
  }

  // validate số hợp đồng là duy nhất
  checkNumContract() {
    const val = this.form.value;
    const type = val.type;
    const numContract = val.numContract;

    if (numContract === "") {
      this.errorMsgNumberContract = "";
      this.clErrNumContract = "";
    } else {
      if (type === "update") {
        const id = val.id;
        this.contractManagerService
          .doSearchNumContract(numContract, id)
          .subscribe(res => {
            // search số hợp đồng
            if (res.length > 0) {
              // this.toastService.openWarningToast('Số hợp đồng đã tồn tại !');
              this.errorMsgNumberContract = "Số hợp đồng đã tồn tại";
              this.clErrNumContract = "has-error";
            } else {
              this.errorMsgNumberContract = "";
              this.clErrNumContract = "";
            }
          });
      } else {
        this.contractManagerService
          .doSearchNumContract(numContract, 0)
          .subscribe(res => {
            // search số hợp đồng
            if (res.length > 0) {
              // this.toastService.openWarningToast('Số hợp đồng đã tồn tại !');
              this.errorMsgNumberContract = "Số hợp đồng đã tồn tại";
              this.clErrNumContract = "has-error";
            } else {
              this.errorMsgNumberContract = "";
              this.clErrNumContract = "";
            }
          });
      }
    }
  }

  // check mã đối tác là duy nhất
  checkUnitPartnerCode(array1?: any, array2?: any) {
    const array1IDs = new Set(array1.map(({ partnerId }) => partnerId));
    const combined = [
      ...array1,
      ...array2.filter(({ partnerId }) => !array1IDs.has(partnerId))
    ];
    return combined;
  }

  //
  checkJoinWithForm(val?: number, type?: number) {
    if (type === 1) {
      const value = this.formatNewToOld("totalMM");
      if (value < val) {
        return true;
      } else {
        return false;
      }
    } else if (type === 2) {
      const value = this.formatNewToOld("totalAccumulatedMM");
      if (value < val) {
        return true;
      } else {
        return false;
      }
    } else if (type === 3) {
      const value = this.formatNewToOld("totalMMPayed");
      if (value < val) {
        return true;
      } else {
        return false;
      }
    }
  }

  //
  changeProject(event, index?: number) {
    // check Kế hoạch thuê ngoài
    let i = (this.currentPage - 1) * this.numberPerPage + index;
    if (event === undefined) {
      this.outsourcePlans = [];
      this.params.actualEffortList[i].outsourcePlanId = ""; // clear Kế hoạch thuê ngoài
      this.params.actualEffortList[i].flagMMOS = false; // enable Tổng MM đã thẩm định
      this.params.actualEffortList[i].totalAppraisedMM = 0;
      this.onChangeTotalMD(i);
      this.arrPage();
      this.loadList();
      return;
    }
    const outsourcePlanId = this.params.actualEffortList[i].outsourcePlanId;
    const projectId = event.id;
    if (projectId !== "") {
      // mã dự án có giá trị
      if (outsourcePlanId !== "") {
        // Kế hoạch thuê ngoài đã có
        // mmos disable
        this.params.actualEffortList[i].flagMMOS = true;
      } else {
        // kế hoạch thuê ngoài chưa có
        // mmos enable
        this.contractManagerService
          .getbusinessByProjectId(projectId)
          .subscribe(res => {
            if (res["data"].length > 0) {
              this.funcToList(i, res);
            }
          });
        //this.params.actualEffortList[i].flagMMOS = false;
      }
    } else {
      // mã dự án không có giá trị
    }

    // lấy danh sách kế hoạch theo mã dự án
    if (projectId !== "") {
      this.contractManagerService
        .getAllPlanFollowApprove(projectId)
        .then(
          res => (this.params.actualEffortList[i].outsourcePlans = res["data"])
        );
    } else {
      this.outsourcePlans = of([]);
    }
  }

  getPlanByProjectId(projectId?: any) {
    this.contractManagerService
      .getAllPlanFollowApprove(projectId)
      .then(res => (this.outsourcePlans = res["data"]));
  }

  getValues(event: any, index?: any) {
    if (event !== undefined) {
      let i = (this.currentPage - 1) * this.numberPerPage + index;
      const length = event.length;
      const projectId = this.params.actualEffortList[i].projectId;
      if (length > 0) {
        // id mã dự án
        let lstOutsourcePlanId = ""; // danh sách id kế hoạch
        let lstPlanCode = ""; // danh sách  planCode

        let lstbusinessOrgName = ""; // danh sách name đơn vị kinh doanh
        let lstbusinessOrgId = ""; // danh sách id đơn vị kinh doanh

        let lstamName = ""; // danh sách name đầu mối kinh doanh
        let lstamId = ""; // danh sách id đầu mối kinh doanh

        let lstproductionOrgName = ""; // danh sách đơn vị sản xuất
        let lstproductionOrgId = ""; // danh sách id đơn vị sản xuất

        let lstpmName = ""; // danh sách name Đầu mối kỹ thuật
        let lstpmId = ""; // danh sách id Đầu mối kỹ thuật

        let totalOS = 0; //mmOS mmos

        this.plandMMOSBlank = "";
        event.forEach(element => {
          lstOutsourcePlanId += element.softwareDevelopmentID + ",";
          lstPlanCode += element.planCode + ",";

          if (element.mmos === 0 || element.mmos == null) {
            this.plandMMOSBlank += element.planCode + ", ";
          }
        });

        if (this.plandMMOSBlank !== "") {
          this.plandMMOSBlank = this.plandMMOSBlank.substring(
            0,
            this.plandMMOSBlank.length - 2
          );
        }

        lstOutsourcePlanId = lstOutsourcePlanId.substring(
          0,
          lstOutsourcePlanId.length - 1
        );
        this.params.actualEffortList[i].lstOutsourcePlanId =
          "," + lstOutsourcePlanId + ","; // danh sách id kế hoạch thuê ngoài
        lstPlanCode = lstPlanCode.substring(0, lstPlanCode.length - 1);
        this.params.actualEffortList[i].lstPlanCode = "," + lstPlanCode + ","; // danh sách code(mã) kế hoạch thuê ngoài

        this.contractManagerService
          .doInfoByLstPlanCode(lstPlanCode, projectId)
          .subscribe(res => {
            if (res["data"].length > 0) {
              const lst = res["data"];
              for (let index = 0; index < lst.length; index++) {
                if (lst[index].businessUnit !== null) {
                  lstbusinessOrgName += lst[index].businessUnit + ","; // danh sách name đơn vị kinh doanh
                }

                if (lst[index].idBusinessUnit !== null) {
                  lstbusinessOrgId += lst[index].idBusinessUnit + ",";
                }

                if (lst[index].am !== null) {
                  lstamName += lst[index].am + ",";
                }

                if (lst[index].amId !== null) {
                  lstamId += lst[index].amId + ","; // danh sách id đầu mối kinh doanh
                }

                if (lst[index].productUnit !== null) {
                  lstproductionOrgName += lst[index].productUnit + ",";
                }

                if (lst[index].idProductionUnit !== null) {
                  lstproductionOrgId += lst[index].idProductionUnit + ","; // danh sách id đơn vị sản xuất
                }

                if (lst[index].pm !== null) {
                  lstpmName += lst[index].pm + ",";
                }
                if (lst[index].pmId !== null) {
                  lstpmId += lst[index].pmId + ","; // danh sách id Đầu mối kỹ thuật
                }

                totalOS += Number(this.checkValue(lst[index].mmos));

                if (totalOS !== 0) {
                  this.plandMMOSBlank = "";
                }
              }

              lstbusinessOrgName = lstbusinessOrgName.substring(
                0,
                lstbusinessOrgName.length - 1
              );
              lstbusinessOrgId = lstbusinessOrgId.substring(
                0,
                lstbusinessOrgId.length - 1
              );

              lstamName = lstamName.substring(0, lstamName.length - 1);
              lstamId = lstamId.substring(0, lstamId.length - 1);

              lstproductionOrgName = lstproductionOrgName.substring(
                0,
                lstproductionOrgName.length - 1
              );
              lstproductionOrgId = lstproductionOrgId.substring(
                0,
                lstproductionOrgId.length - 1
              );

              lstpmName = lstpmName.substring(0, lstpmName.length - 1);
              lstpmId = lstpmId.substring(0, lstpmId.length - 1);

              this.params.actualEffortList[
                i
              ].businessOrgName = lstbusinessOrgName;
              this.params.actualEffortList[i].lstbusinessOrgName =
                "," + lstbusinessOrgName + ",";
              this.params.actualEffortList[i].lstbusinessOrgId =
                "," + lstbusinessOrgId + ","; // danh sách id đơn vị kinh doanh

              this.params.actualEffortList[i].amName = lstamName;
              this.params.actualEffortList[i].lstamId = "," + lstamId + ","; // danh sách id Đầu mối kinh doanh
              this.params.actualEffortList[i].lstamName = "," + lstamName + ","; // danh sách name Đầu mối kinh doanh

              this.params.actualEffortList[
                i
              ].productionOrgName = lstproductionOrgName;
              this.params.actualEffortList[i].lstproductionOrgName =
                "," + lstproductionOrgName + ",";
              this.params.actualEffortList[i].lstproductionOrgId =
                "," + lstproductionOrgId + ","; // danh sách id Đơn vị sản xuất

              this.params.actualEffortList[i].pmName = lstpmName;
              this.params.actualEffortList[i].lstpmName = "," + lstpmName + ",";
              this.params.actualEffortList[i].lstpmId = "," + lstpmId + ","; // // danh sách id đầu mối kỹ thuật

              this.params.actualEffortList[i].totalAppraisedMM = this.check4(
                totalOS
              );

              this.params.actualEffortList[i].flagMMOS = true;
              this.onChangeTotalMD(i);
              this.arrPage();
              this.loadList();
            } else {
              this.params.actualEffortList[i].businessOrgName = "";
              this.params.actualEffortList[i].businessOrgName = "";

              this.params.actualEffortList[i].amName = "";

              this.params.actualEffortList[i].productionOrgName = "";

              this.params.actualEffortList[i].pmName = "";

              this.params.actualEffortList[i].totalAppraisedMM = "";
              this.params.actualEffortList[i].flagMMOS = false;
              this.onChangeTotalMD(i);
              this.arrPage();
              this.loadList();
            }
          });
      } else if (length <= 0) {
        // TH: không có kế hoạch -> đầu mối và đơn vị lấy theo dự án
        this.contractManagerService
          .getbusinessByProjectId(projectId)
          .subscribe(res => {
            if (res["data"].length > 0) {
              this.funcToList(i, res);
            }
          });
        // this.params.actualEffortList[i].flagMMOS = false;
        // this.params.actualEffortList[i].totalAppraisedMM = '';
        // this.onChangeTotalMD(i);
        this.arrPage();
        this.loadList();
      }
    }
  }

  onAdd() {}

  onClearlistJoinDT(index?: number, type?: any) {
    if (type === "DT") {
      /*    let value = this.params.partnerJoinList[index].partnerCode;
      this.params.partnerJoinList[index].listJoinDT$ = of([]);
      this.joinUnitSearch1 = '';
      this.params.actualEffortList.forEach(element => {
        if (element.partnerCode === value) {
          element.partnerId = '';
        }
      });
      this.arrPage();
      this.loadList();*/
      this.params.partnerJoinList[index].listJoinDT$ = of([]);
      this.joinUnitSearch1 = "";
    } else {
      this.params.partnerJoinList[index].listJoinDVTN$ = of([]);
      this.joinUnitSearch2 = "";
    }
  }

  // code chức năng đối tác tham gia  --- end

  checkBlurLK() {
    const val = this.form.value;
    const valLK = Number(val.totalAccumulatedMM);
    if (valLK === 0) {
      this.form.get("totalAccumulatedMM").setValue("");
    }
  }

  //quanghn add
  checkBlurLKContract() {
    let totalMD = 0;
    const val = this.form.value;
    const valLK = Number(val.totalAccumulatedMM);

    if (valLK === 0) {
      this.form.get("totalAccumulatedMM").setValue("");
      this.isCheckMMLK = false;
      this.params.actualEffortList.forEach(element => {
        totalMD += Number(
          this.getValueMD(
            element.monthValue1,
            element.monthValue2,
            element.monthValue3,
            element.monthValue4,
            element.monthValue5,
            element.monthValue6,
            element.monthValue7,
            element.monthValue8,
            element.monthValue9,
            element.monthValue10,
            element.monthValue11,
            element.monthValue12
          )
        );
      });
      if (Number(totalMD) === 0) {
        this.form.get("totalAccumulatedMM").setValue("");
      } else {
        this.form.get("totalAccumulatedMM").setValue(this.check4(totalMD));
      }
    }
    if (valLK > 0) {
      this.isCheckMMLK = true;
    }
  }

  checkBlurTotalAppraisedMM(index?: number, name?: string) {
    let name2 = name;
    let i = (this.currentPage - 1) * this.numberPerPage + index;
    let val = this.params.actualEffortList[i][name2];
    if (val !== "") {
      if (Number(val) === 0) {
        this.params.actualEffortList[i][name2] = "";
      }
    }
    this.arrPage();
    this.loadList();
  }

  checkLK(event) {
    let value = event.target.value;
    if (value.toString().includes(",") && event.key === ",") {
      return false;
    }
    event.target.value = value.replace(/^0+/, "");
    // const val = this.form.value;
    // value = Number(value);
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

    const partnerCode = item.code.toLocaleLowerCase();
    let partnerName = item.name.toLocaleLowerCase();
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
      (partnerCode + " - " + partnerName).includes(term)
    );
  }

  customSearchFnMDA(term: string, item: any) {
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

    const projectCode = item.projectCode.toLocaleLowerCase();
    let projectName = item.projectName.toLocaleLowerCase();

    projectName = projectName.replace(
      /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,
      "a"
    );
    projectName = projectName.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    projectName = projectName.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    projectName = projectName.replace(
      /ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,
      "o"
    );
    projectName = projectName.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    projectName = projectName.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    projectName = projectName.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    projectName = projectName.replace(
      /\u0300|\u0301|\u0303|\u0309|\u0323/g,
      ""
    ); // Huyền sắc hỏi ngã nặng
    projectName = projectName.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return (
      projectCode.indexOf(term) > -1 ||
      projectName.indexOf(term) > -1 ||
      (projectCode + " - " + projectName).includes(term)
    );
  }

  // QuangHN add
  //trim space input field
  trimSpaceOfTable(index, field, event) {
    const value = event.target.value;
    this.params.actualEffortList[index][field] = value.trim();
    event.target.value = value.trim();
  }

  checkBlurTotalpay() {
    const val = this.form.value;
    const valLK = Number(val.totalMMPayed);
    if (valLK === 0) {
      this.form.get("totalMMPayed").setValue("");
    }
  }

  getYear() {
    const todays = new Date();
    this.yy = todays.getFullYear();
    for (let i = this.yy; i >= 1970; i--) {
      this.years.push(i);
    }
  }

  getAllProject() {
    this.contractManagerService.getAllProject().subscribe(res => {
      this.listProject = res;
    });
  }

  getAllProjectCreate() {
    this.contractManagerService.getAllProject().subscribe(res => {
      this.listProject = res;
      this.getPlanApproveCreate();
    });
  }

  getPlanApprove() {
    this.contractManagerService
      .getPlanApprove()
      .subscribe(res => (this.planOutsourcingApprove = res));
  }

  getPlanApproveCreate() {
    this.contractManagerService.getPlanApprove().subscribe(res => {
      this.planOutsourcingApprove = res;
      this.getYear();
      this.checkTile = 0;
      // this.lst = res.data;
      this.lst = this.getValue("QLDT_SEND_DATA");
      this.lst = this.lst.data;
      this.pushDataToList();
      this.remove("QLDT_SEND_DATA");
    });
  }

  splitPlancode(planCode: string) {
    this.listPlancode = planCode.split(",");
  }

  getObject(key: string): any {
    return JSON.parse(this.storage[key] || "{}");
  }

  getStorage(key: string): string {
    return this.storage[key] || false;
  }

  getValue<T>(key: string): T {
    const obj = JSON.parse(this.storage[key] || null);
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return <T>obj || null;
  }

  remove(key: string): any {
    this.storage.removeItem(key);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.contractManagerService.changeInvoice(null);
  }

  getValueMD(...mdValue) {
    let totalMDValue = 0;
    mdValue.forEach(element => {
      if (element !== "" && element !== null && Number(element) > 0) {
        totalMDValue += Number(element);
      }
    });
    if (totalMDValue === 0) {
      return "";
    } else {
      return (totalMDValue / 22).toFixed(2);
    }
  }
  //huyenlt update 3/9/2020
  checkValueMMPayed(item, event) {
    const mmPayed = event.target.value
      .toString()
      .replace(/\./g, "")
      .replace(",", ".");
    const outMMTotal = item.outsourcingMMTotal
      .toString()
      .replace(/\./g, "")
      .replace(",", ".");
    if (parseFloat(mmPayed) > parseFloat(outMMTotal)) {
      this.toastService.openErrorToast(
        "MM đã thanh toán phải nhỏ hơn hoặc bằng Tổng MM thuê ngoài"
      );
      this.clErrorPayed = "has-error";
      this.btnDisabled1 = true;
    } else {
      this.clErrorPayed = "";
      this.btnDisabled1 = false;
    }
  }

  onChangeLK(value) {
    let totalLKPartner = 0;
    this.params.partnerJoinList.forEach(item => {
      totalLKPartner += Number(item.mmUsing);
    });

    if (
      totalLKPartner <= Number(this.replaceFormatNumber(value.target.value))
    ) {
      this.clErrorMMUsing = "";
    }
  }

  replaceFormatNumber(value: any) {
    return value
      .toString()
      .replace(/\./g, "")
      .replace(",", ".");
  }
}
