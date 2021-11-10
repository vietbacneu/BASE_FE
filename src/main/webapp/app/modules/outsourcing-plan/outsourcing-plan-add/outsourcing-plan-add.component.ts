import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HeightService } from "app/shared/services/height.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { Observable, of, Subject, Subscription } from "rxjs";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { OrganizationCategoriesService } from "app/core/services/system-management/organization-categories.service";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { NgxSpinnerService } from "ngx-spinner";
import { UploadFileComponent } from "app/shared/components/upload-file/upload-file.component";
import { TranslateService } from "@ngx-translate/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { ToastService } from "app/shared/services/toast.service";
import { JhiEventManager } from "ng-jhipster";
import { OutsourcingPlanService } from "app/core/services/outsourcing-plan/outsourcing-plan.service";
import { ShareDataFromProjectService } from "app/core/services/outsourcing-plan/share-data-from-project";
import { CommonService } from "app/shared/services/common.service";
import { DateTimeModel } from "app/core/models/base.model";
import { DataFormatService } from "app/shared/services/data-format.service";
import * as moment from "moment";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { FileAttachmentService } from "app/core/services/outsourcing-plan/file-attachment.service";
import { DownloadService } from "app/shared/services/download.service";
import { REGEX_REPLACE_PATTERN } from "app/shared/constants/pattern.constants";
import { CommonUtils } from "app/shared/util/common-utils.service";

import { Title } from "@angular/platform-browser";

@Component({
  selector: "jhi-outsourcing-plan-add",
  templateUrl: "./outsourcing-plan-add.component.html",
  styleUrls: ["./outsourcing-plan-add.component.scss"]
})
export class OutsourcingPlanAddComponent implements OnInit, OnDestroy {
  @ViewChild("fileImport", { static: false }) fileImport: UploadFileComponent;
  type: any;
  private subscription: Subscription;
  form: FormGroup;
  height;
  itemsPerPage: any;
  maxSizePage: any;
  routeData: any;
  page: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  formValue = [];
  outsourcingFormList: any[];
  planCode: string;
  planStatus: string;
  planCodeCodeExist: string;
  projectCodeForwardFromProject = "";
  // import
  errImport = false;
  successImport = false;
  successMessage;
  errMessage;

  filePerPage = 10;
  filePage = 1;
  maxFilePage = 10;
  listFilePlan: any;

  codeSearch;
  debouncerCode: Subject<string> = new Subject<string>();
  listProject = new Observable<any[]>();
  notFoundText;

  nameBusinessSearch;
  debouncerNameBusiness: Subject<string> = new Subject<string>();
  listBusiness$ = new Observable<any[]>();

  nameProductionSearch;
  debouncerNameProduction: Subject<string> = new Subject<string>();
  listProduction$ = new Observable<any[]>();

  isModalConfirmShow = false;

  currencyMasksScoreQuality = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 3,
    thousandsSeparatorSymbol: ".",
    decimalSymbol: ","
  };
  isError = true;
  startDateProject = "";
  endDateProject: any;
  errImportFile = false;
  errMessageFile = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private outsourcingPlanService: OutsourcingPlanService,
    private versionManagementService: VersionManagementService,
    private organizationCategoriesService: OrganizationCategoriesService,
    private appParamsService: AppParamsService,
    private translateService: TranslateService,
    private modalService: NgbModal,
    private toastService: ToastService,
    private eventManager: JhiEventManager,
    protected router: Router,
    private shareDataFromProjectService: ShareDataFromProjectService,
    private commonService: CommonService,
    private dataFormatService: DataFormatService,
    private fileAttachmentService: FileAttachmentService,
    private downloadService: DownloadService,
    private titleService: Title
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      if (data && data.pagingParams) {
        this.page = data.pagingParams.page;
        this.previousPage = data.pagingParams.page;
        this.reverse = data.pagingParams.ascending;
        this.predicate = data.pagingParams.predicate;
      }else {
        this.page = 1;
      }
    });
  }

  ngOnInit() {
    this.buildForm();
    this.getForwardProjectCodeFromProject();
    this.debounceOnSearch();
    this.loadOutsourcingForm();
    this.getDataFromList();
    // perfect-scroll bar
    this.onResize();
    //this.getOutSource();
    //TODO: goi api lay hinh thuc thue ngoai

    this.setTitle();
  }

  public setTitle() {
    this.titleService.setTitle(
      this.translateService.instant("outsourcingPlan.title-add")
    );
  }

  ngOnDestroy() {
    this.shareDataFromProjectService.getDataFromList(null);
  }

  getForwardProjectCodeFromProject() {
    this.subscription = this.versionManagementService.currentOutsourcePlan.subscribe(
      res => {
        if (res !== null) {
          this.projectCodeForwardFromProject = res.projectCode;
          this.setValueToField("projectCode", res.projectCode);
          this.setValueToField("projectName", res.projectName);
          this.setValueToField("idProject", res.id);
          this.setValueToField("am", res.am);
          this.setValueToField("pm", res.pm);

          const setDefaultBusiness = {
            id: res.idBusinessUnit,
            name: res.businessOrg
          };
          const setDefaultProduct = {
            id: res.idProductionUnit,
            name: res.productionOrg
          };

          this.setValueToField("idBusinessUnit", res.idBusinessUnit);
          this.setValueToField("idProductionUnit", res.idProductionUnit);
          // if(this.nameBusinessSearch !== null )
          //huyenlt edit 14/09/2020
          if (res.idBusinessUnit !== null) {
            this.listBusiness$ = of([setDefaultBusiness]);
          }
          this.listProduction$ = of([setDefaultProduct]);
          this.startDateProject = res.startDate;
          this.endDateProject = res.endDate;
        }
      }
    );
  }

  getDataFromList() {
    this.subscription = this.shareDataFromProjectService.outsourcePlan.subscribe(
      res => {
        if (res) {
          this.type = res.actionType;
          this.loadProject(res.data.projectCode);
          const setDefaultBusiness = {
            id: res.data.idBusinessUnit,
            name: res.data.businessUnit
          };
          const setDefaultProduct = {
            id: res.data.idProductionUnit,
            name: res.data.productUnit
          };
          this.form.patchValue(res.data);
          this.formValue = this.form.value; // Lay gia tri form thoi diem nay

          this.listBusiness$ = of([setDefaultBusiness]);
          this.listProduction$ = of([setDefaultProduct]);
          this.startDateProject = res.data.startDate;
          this.endDateProject = res.data.endDate;
          if (this.form.value.endTime === null)
            this.setValueToField("endTime", "");
        } else {
          this.getPlanCodeAuto("");
          this.type = "add";
        }
      }
    );
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: [""],
      planCode: [""],
      idProject: [null, Validators.required],
      idBusinessUnit: [null, Validators.required],
      idProductionUnit: [null, Validators.required],
      projectName: [""],
      pm: [""],
      am: [""],
      startTime: ["", Validators.required],
      endTime: [""],
      outsourceTypeCode: ["", Validators.required],
      mmos: [null],
      baNumber: [""],
      devNumber: [""],
      testNumber: [""],
      requireBA: [""],
      requireDev: [""],
      requireTest: [""],
      description: [""],
      listFilePlan: [""],
      projectCode: [""],
      planStatusName: [""],
      planStatusCode: [""],
      businessUnit: [""],
      productUnit: [""],
      outsourceTypeName: [""],
      devMobileNumber: [""],
      requireDevMobile: [""]
    });
  }

  onSubmitData() {
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }
    const data = this.form.value;

    if (
      this.isDateErr("startTime") ||
      this.isDateErr("endTime") ||
      this.isDateErrProject("startTime") ||
      this.isDateErrProject("endTime") ||
      this.isDateErrProject("startTimeBeforeEndDateOfProject") ||
      this.isEndDateErr("endTime")
    ) {
      console.warn("false cmnr");
      return;
    }

    // open popup update confirm
    if (this.type === "update") {
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: "static"
      });
      modalRef.componentInstance.type = "update";
      modalRef.componentInstance.param = this.translateService.instant(
        "projectManagement.popup.this-value"
      );
      modalRef.componentInstance.onCloseModal.subscribe(value => {
        if (value === true) {
          this.submitFormAfterUpFile(data);
        }
      });
    } else {
      this.submitFormAfterUpFile(data);
    }
  }

  submitFormAfterUpFile(data) {
    this.spinner.show();
    if (typeof data.startTime !== typeof "string") {
      data.startTime = moment
        .utc(new Date(this.form.value.startTime))
        .format("YYYY-MM-DD");
    } else {
      data.startTime = moment
        .utc(this.form.value.startTime)
        .format("YYYY-MM-DD");
    }

    if ("" !== data.endTime) {
      if (typeof data.endTime !== typeof "string") {
        data.endTime = moment
          .utc(new Date(this.form.value.endTime))
          .format("YYYY-MM-DD");
      } else {
        data.endTime = moment.utc(this.form.value.endTime).format("YYYY-MM-DD");
      }
    }

    if (null !== data.mmos) data.mmos = data.mmos.replace(",", ".");
    this.outsourcingPlanService.save(data, this.listFilePlan).subscribe(
      res => {
        this.shareDataFromProjectService.getDataFromList(null);
        this.handleResponseSubmit(res);
      },
      err => {
        this.handleErrorMessage(err);
        this.spinner.hide();
      }
    );
  }

  cancelAddOrUpdate() {
    if (this.type !== "detail" && this.checkFormValueChanges(this.form.value)) {
      this.isModalConfirmShow = true;
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: "static"
      });
      modalRef.componentInstance.type = "confirm";
      modalRef.componentInstance.onCloseModal.subscribe(value => {
        if (value === true) {
          this.shareDataFromProjectService.getDataFromList(null);
          this.router.navigate(["/outsourcing-plan"]);
        }
        this.isModalConfirmShow = false;
      });
    } else {
      this.shareDataFromProjectService.getDataFromList(null);
      this.router.navigate(["/outsourcing-plan"]);
    }
  }

  checkFormValueChanges(form) {
    const formValueChange = CommonUtils.convertObjectToArray(form);
    const formOld = CommonUtils.convertObjectToArray(this.formValue);
    for (let i = 0; i < formValueChange.length; i++) {
      if (formValueChange[i] !== formOld[i]) {
        return true;
      }
    }
    return false;
  }

  handleResponseSubmit(res) {
    this.spinner.hide();
    if (res) {
      if (res.status === STATUS_CODE.CREATED)
        this.toastService.openSuccessToast(
          this.translateService.instant("common.toastr.messages.success.add", {
            paramName: this.translateService.instant("outsourcingPlan.plan")
          })
        );
      if (res.status === STATUS_CODE.SUCCESS)
        this.toastService.openSuccessToast(
          this.translateService.instant(
            "common.toastr.messages.success.update",
            {
              paramName: this.translateService.instant("outsourcingPlan.plan")
            }
          )
        );

      this.eventManager.broadcast({
        name: "outSourcingChange"
      });
      this.router.navigate(["/outsourcing-plan"]);
    } else {
      this.toastService.openErrorToast(
        this.translateService.instant("common.toastr.messages.error.save")
      );
    }
  }

  handleErrorMessage(err) {
    this.getPlanCodeAuto(err);
  }

  getMessPlanCodeExist(err, planCodeCodeExist) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: "static"
    });
    modalRef.componentInstance.type = "confirmWithMsg";
    modalRef.componentInstance.message = this.translateService.instant(
      "outsourcingPlan.popup.isExist",
      {
        planCodeCodeOld: planCodeCodeExist,
        planCodeNew: this.planCode
      }
    );
  }

  getPlanCodeAuto(err) {
    if (err !== null) {
      this.planCodeCodeExist = this.planCode;
      this.outsourcingPlanService.getPlanCodeAuto().subscribe(res => {
        this.planCode = res.body;
        this.setValueToField("planCode", this.planCode);
        this.formValue = this.form.value; // Lay gia tri form thoi diem nay
        if (err.status === STATUS_CODE.EXIST) {
          this.getMessPlanCodeExist(err, this.planCodeCodeExist);
        }
      });
    }
  }

  onResize() {
    this.height = this.heightService.onResizeHeight170Px();
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  loadOutsourcingForm() {
    this.appParamsService
      .getAllAppParamsByType("OUTSOURCE_TYPE")
      .subscribe(res => {
        this.outsourcingFormList = res.body;
      });
  }

  loadProject(term) {
    this.versionManagementService
      .search({
        code: term,
        name: "",
        product: "",
        business: "",
        startDate: "",
        endDate: ""
      })
      .subscribe(res => {
        if (res) {
          this.listProject = of(res.body.data);
          if (res.body.data.length === 0) {
            this.notFoundText = "common.select.notFoundText";
            $(".ng-option").css("display", "block");
          }
        } else {
          this.listProject = of([]);
        }
      });
  }

  onSearchProject(value) {
    this.codeSearch = value.term;
    if (value.term !== "") {
      this.debouncerCode.next(value.term);
      this.notFoundText = "";
      $(".ng-option").css("display", "none");
    } else {
      this.listProject = of([]);
      $(".ng-option").css("display", "block");
    }
  }

  onSelectCodeProject(event) {
    if (event) {
      this.setValueToField("projectName", event.projectName);
      this.setValueToField("am", event.am);
      this.setValueToField("pm", event.pm);
      const setDefaultBusiness = {
        id: event.idBusinessUnit,
        name: event.businessOrg
      };
      const setDefaultProduct = {
        id: event.idProductionUnit,
        name: event.productionOrg
      };
      this.setValueToField("idBusinessUnit", event.idBusinessUnit);
      this.setValueToField("idProductionUnit", event.idProductionUnit);
      if (event.idBusinessUnit !== null) {
        this.listBusiness$ = of([setDefaultBusiness]);
      }
      if (event.idProductionUnit !== null) {
        this.listProduction$ = of([setDefaultProduct]);
      }
      this.startDateProject = event.startDate;
      this.endDateProject = event.endDate;
    } else {
      this.setValueToField("projectName", "");
      this.setValueToField("am", "");
      this.setValueToField("pm", "");
    }
  }

  onClearProject() {
    this.listProject = of([]);
    this.setValueToField("projectName", "");
  }

  onSearchProjectClose() {
    if (!this.form.value.id) {
      this.listProject = of([]);
      this.codeSearch = "";
    }
  }

  onSearchBusiness(value) {
    this.nameBusinessSearch = value.term;
    const term = value.term;
    if (term !== "") {
      this.debouncerNameBusiness.next(term);
      this.notFoundText = "";
      $(".ng-option").css("display", "none");
    }
    this.organizationCategoriesService
      .getAllCodeOrName({
        name: value.term,
        type: "KD"
      })
      .subscribe(res => {
        if (res) {
          this.listBusiness$ = of(res.body["content"]);
          if (res.body["content"].length === 0) {
            this.notFoundText = "common.select.notFoundText";
            $(".ng-option").css("display", "block");
          }
        } else {
          this.listBusiness$ = of([]);
        }
      });
  }

  onClearBusiness() {
    this.nameBusinessSearch = "";
    this.listBusiness$ = of([]);
    this.setValueToField("name", "");
  }

  onSearchBusinessClose() {
    if (!this.form.value.id) {
      this.listBusiness$ = of([]);
      this.nameBusinessSearch = "";
    }
  }
  loadListProduct(value) {}

  onSearchProduction(value) {
    if (value.term && value.term.trim()) {
      this.nameProductionSearch = value.term.trim();
      const term = value.term;
      if (term !== "") {
        this.debouncerNameProduction.next(term);
        this.notFoundText = "";
        $(".ng-option").css("display", "none");
      }
      this.organizationCategoriesService
        .getAllCodeOrName({
          name: value.term,
          type: "SX"
        })
        .subscribe(res => {
          if (res) {
            if (res.body["content"].length === 0) {
              this.notFoundText = "common.select.notFoundText";
              $(".ng-option").css("display", "block");
            }
            this.listProduction$ = of(res.body["content"]);
          } else {
            this.listProduction$ = of([]);
          }
        });
    }
  }

  onClearProduction() {
    this.nameProductionSearch = "";
    this.listProduction$ = of([]);
    this.setValueToField("name", "");
  }

  onSearchProductionClose() {
    if (!this.form.value.id) {
      this.listProduction$ = of([]);
      this.nameProductionSearch = "";
    }
  }

  debounceOnSearch() {
    this.debouncerCode
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.loadProject(value));
    // this.debouncerNameBusiness.pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH)).subscribe(value => this.loadListBusiness(value));
    // this.debouncerNameProduction.pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH)).subscribe(value => this.loadListProduct(value));
  }

  onError(event) {
    if (event === "") {
      this.errImport = false;
      this.successImport = true;
      this.successMessage = this.translateService.instant(
        "common.import.success.upload"
      );
    } else {
      this.errImport = true;
      this.successImport = false;
      this.errMessage = event;
    }
  }

  onChangeFile(event: EventEmitter<File[]>) {
    this.errImportFile = false;
    let totalFileValid = 0;
    const indexs = [];
    this.listFilePlan = event;
    for (let index = 0; index < this.listFilePlan.length; index++) {
      const fileName = this.listFilePlan[index].name;
      const fileFormat = this.listFilePlan[index].name.substring(
        fileName.lastIndexOf("."),
        fileName.length
      );
      if (
        fileFormat !== ".pdf" &&
        fileFormat !== ".rar" &&
        fileFormat !== ".zip" &&
        fileFormat !== ".xlsx"
      ) {
        totalFileValid++;
        indexs.push(index);
      }
    }
    if (totalFileValid === this.listFilePlan.length) {
      // this.toastService.openErrorToast('Hệ thống chỉ hỗ trợ upload các file có định dạng: .pdf, .rar, .zip, .xlsx, .xls');
      this.errMessageFile =
        "Hệ thống chỉ hỗ trợ upload các file có định dạng: .pdf, .rar, .zip, .xlsx";
      this.form.get("listFilePlan").setValue([]);
      this.errImportFile = true;
      return;
    } else {
      for (let i = indexs.length - 1; i >= 0; i--) {
        this.listFilePlan.splice(indexs[i], 1);
        this.form.get("listFilePlan").setValue(this.listFilePlan);
      }
    }
    this.checkSizeFile();
  }

  get formControl() {
    return this.form.controls;
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  displayFieldHasError(field: string) {
    return {
      "has-error":
        this.isFieldValid(field) ||
        this.isDateErr(field) ||
        this.isDateErrProject(field) ||
        this.isEndDateErr(field)
    };
  }

  isDateErr(field: string) {
    const dt1 = DateTimeModel.fromLocalString(this.form.get("startTime").value);
    const dt2 = DateTimeModel.fromLocalString(this.form.get("endTime").value);
    if (field === "endTime") {
      return this.dataFormatService.after(dt1, dt2);
    }
    // if (field === 'endTime2' && this.form.value.endTime !== '') {
    //   if (this.endDateProject === null) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // } else {
    //   return false;
    // }
  }

  isEndDateErr(field: String) {
    if (field === "endTime" && this.form.value.endTime !== "") {
      if (this.endDateProject === null) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isDateErrProject(field: string) {
    if (this.type !== "detail") {
      let startDate = "";
      let endDate = "";

      //Get value date from form
      if (this.form.value.startTime !== "") {
        startDate = moment.utc(this.form.value.startTime).format("DD/MM/YYYY");
      }
      if (this.form.value.endTime !== "") {
        endDate = moment.utc(this.form.value.endTime).format("DD/MM/YYYY");
      }
      //end get value date

      if (
        field === "startTime" &&
        startDate !== "" &&
        this.startDateProject !== ""
      ) {
        return this.checkDateFirstAfterDateSecond(
          this.startDateProject,
          startDate
        );
      }

      if (
        field === "startTimeBeforeEndDateOfProject" &&
        startDate !== "" &&
        this.startDateProject !== "" &&
        this.endDateProject !== null
      ) {
        return this.checkDateFirstAfterDateSecond(
          startDate,
          this.endDateProject
        );
      }
      if (
        field === "endTime" &&
        endDate !== "" &&
        this.form.value.idProject !== null &&
        // (this.endDateProject !== null || this.endDateProject !== '' )
        this.endDateProject !== null
      ) {
        console.warn("Endate form : " + endDate);
        console.warn("Endate DA: " + this.endDateProject);
        return this.checkDateFirstAfterDateSecond(endDate, this.endDateProject);
      }
      // else if (
      //   field === 'endTime' &&
      //   endDate !== '' &&
      //   this.form.value.idProject !== null && (this.endDateProject == '' || this.endDateProject == null)
      // ) {
      //   console.warn("End date dự án null thì chết cmnr còn gì nữa")
      //   return true
      // }
    }
  }

  checkDateFirstAfterDateSecond(dateFirst, dateSecond) {
    const dateFirstArr = String(dateFirst).split("/");
    const dateSecondArr = String(dateSecond).split("/");
    if (Number(dateFirstArr[2]) < Number(dateSecondArr[2])) {
      return false;
    }
    if (
      Number(dateFirstArr[1]) < Number(dateSecondArr[1]) &&
      Number(dateFirstArr[2]) === Number(dateSecondArr[2])
    ) {
      return false;
    }
    if (
      Number(dateFirstArr[0]) < Number(dateSecondArr[0]) &&
      Number(dateFirstArr[1]) === Number(dateSecondArr[1]) &&
      Number(dateFirstArr[2]) === Number(dateSecondArr[2])
    ) {
      return false;
    }

    if (
      Number(dateFirstArr[0]) === Number(dateSecondArr[0]) &&
      Number(dateFirstArr[1]) === Number(dateSecondArr[1]) &&
      Number(dateFirstArr[2]) === Number(dateSecondArr[2])
    ) {
      return false;
    }

    return true;
  }

  onDeleteDocument(item) {
    let status;
    if (item.id !== undefined) {
      this.fileAttachmentService.deleteFile(item.id).subscribe(
        res => {
          if (res.status === STATUS_CODE.SUCCESS) {
            status = res.status;
            this.toastService.openSuccessToast(
              this.translateService.instant(
                "outsourcingPlan.toastr.delete.successful"
              )
            );
          }
        },
        error => {
          this.toastService.openErrorToast(
            this.translateService.instant("outsourcingPlan.toastr.delete.fail")
          );
        },
        () => {
          let data;
          if (status === STATUS_CODE.SUCCESS) {
            data = this.formControl.listFilePlan.value.filter(value => {
              if (value.fileName !== undefined && item.fileName !== undefined) {
                return value.fileName !== item.fileName;
              }
              if (value.name !== undefined) {
                return value;
              }
            });
          } else {
            data = this.formControl.listFilePlan.value.filter(value => {
              if (value.fileName !== undefined && item.fileName !== undefined) {
                return value.fileName;
              }
              if (value.name !== undefined) {
                return value;
              }
            });
          }
          this.setValueToField("listFilePlan", data);
        }
      );
    } else {
      const data = this.formControl.listFilePlan.value.filter(value => {
        if (value.name !== undefined && item.name !== undefined) {
          return value.name !== item.name;
        }
        if (value.fileName !== undefined) {
          return value;
        }
      });
      this.listFilePlan = data;
      this.setValueToField("listFilePlan", data);
      this.checkSizeFile();
    }
  }

  changePageSize(size) {
    this.filePerPage = size;
  }

  pageChange(event) {
    this.filePage = event;
  }

  downloadFile(item) {
    if (item.id !== undefined) {
      this.spinner.show();
      this.fileAttachmentService.downloadFile(item.filePath).subscribe(res => {
        this.spinner.hide();
        if (res) {
          this.downloadService.downloadFile(res);
        }
      });
    }
  }

  setErrorField(field: string, pattern) {
    const result = this.getValueOfField(field).match(pattern);
    if (result) {
      result.forEach(it => {
        if (it !== "") {
          this.form.controls[field].setErrors({ pattern: true });
        }
      });
    }
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }

  onKeyInput(event, element) {
    const value = this.getValueOfField(element);
    let valueChange = event.target.value;
    if ("mmos" === element) {
      valueChange = this.parseNumberMmos(valueChange);
    }

    if (
      "baNumber" === element ||
      "devNumber" === element ||
      "testNumber" === element ||
      "devMobileNumber" === element
    ) {
      valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.INTEGER, "");
      if (this.form.get("baNumber").value === "0") valueChange = "";
      if (this.form.get("devNumber").value === "0") valueChange = "";
      if (this.form.get("devMobileNumber").value === "0") valueChange = "";
      if (this.form.get("testNumber").value === "0") valueChange = "";
    }

    if (value !== valueChange) {
      this.setValueToField(element, valueChange);
      return false;
    }
  }

  parseNumberMmos(string) {
    string = string.replace(REGEX_REPLACE_PATTERN.FLOAT, "");
    const parseStr = string.split("");
    let i = 0;
    let count = 0;
    let indexPoint = 0;
    for (i = 0; i < parseStr.length; i++) {
      if ("," === parseStr[i]) {
        count++;
        if (count === 1) {
          indexPoint = i;
        }
      }
    }

    // Xoa dau phay khi da ton tai 1 dau phay
    if (count === 2) {
      string = string.substring(0, string.length - 1);
    }
    // Cho phep nhap 2 so sau dau phay
    if (count > 0) {
      string = string.substring(0, indexPoint + 3);
    }

    if (count === 0) {
      string = string.substring(0, 5);
    }

    return string;
  }

  trimSpace(element) {
    const value = this.getValueOfField(element);
    if (value) {
      this.setValueToField(element, value.trim());
    }
  }

  checkSizeFile() {
    let i = 0;
    let sizeFileAll = 0;
    let sizeFile = 0;
    for (i = 0; i < this.listFilePlan.length; i++) {
      if (this.listFilePlan[i].id !== undefined) {
        sizeFile = this.listFilePlan[i].size();
      } else {
        sizeFile = CommonUtils.tctGetFileSize(this.listFilePlan[i]);
      }
      sizeFileAll += Number(sizeFile);
    }

    if (sizeFileAll > 150) {
      this.form.controls["listFilePlan"].setErrors({ maxFile: true });
    }
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

    const code = item.code.toLocaleLowerCase();
    let name = item.name.toLocaleLowerCase();

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
}
