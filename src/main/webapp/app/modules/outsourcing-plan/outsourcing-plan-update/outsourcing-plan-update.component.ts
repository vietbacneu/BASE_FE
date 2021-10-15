import { Component, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { HeightService } from "app/shared/services/height.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Observable, of, Subject, Subscription } from "rxjs";
import { ShareDataFromProjectService } from "app/core/services/outsourcing-plan/share-data-from-project";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";
import { OrganizationCategoriesService } from "app/core/services/system-management/organization-categories.service";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { DateTimeModel } from "app/core/models/base.model";
import { DataFormatService } from "app/shared/services/data-format.service";
import { CommonService } from "app/shared/services/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { OutsourcingPlanService } from "app/core/services/outsourcing-plan/outsourcing-plan.service";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { JhiEventManager } from "ng-jhipster";
import { FileAttachmentService } from "app/core/services/outsourcing-plan/file-attachment.service";
import { DownloadService } from "app/shared/services/download.service";
import { REGEX_REPLACE_PATTERN } from "app/shared/constants/pattern.constants";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "jhi-outsourcing-plan-update",
  templateUrl: "./outsourcing-plan-update.component.html",
  styleUrls: ["./outsourcing-plan-update.component.scss"]
})
export class OutsourcingPlanUpdateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  height;
  routeData: any;
  page: any;
  second: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  type: string;
  private subscription: Subscription;
  planStatus: string;
  outsourcingFormList: any[];
  repose: any;
  listFilePlanActual: any;
  // import
  errImport = false;
  successImport = false;
  successMessage;
  errMessage;

  filePerPage = 10;
  filePage = 1;
  maxFilePage = 5;

  filePerPageActual = 10;
  filePageActual = 1;
  maxFilePageActual = 5;

  nameBusinessSearchAct;
  debouncerNameBusinessAct: Subject<string> = new Subject<string>();
  listBusinessAct$ = new Observable<any[]>();
  notFoundText;

  nameProductionSearchAct;
  debouncerNameProductionAct: Subject<string> = new Subject<string>();
  listProductionAct$ = new Observable<any[]>();

  isModalConfirmShow = false;
  formValue = [];

  isError = true;
  startDateProject: any;
  endDateProject: any;
  errMessageFile = "";
  errImportFile = false;

  constructor(
    private heightService: HeightService,
    protected router: Router,
    private formBuilder: FormBuilder,
    private shareDataFromProjectService: ShareDataFromProjectService,
    private versionManagementService: VersionManagementService,
    private organizationCategoriesService: OrganizationCategoriesService,
    private appParamsService: AppParamsService,
    private dataFormatService: DataFormatService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private outsourcingPlanService: OutsourcingPlanService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private eventManager: JhiEventManager,
    private fileAttachmentService: FileAttachmentService,
    private downloadService: DownloadService,
    private modalService: NgbModal,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.buildForm();
    this.debounceOnSearch();
    this.getDataFromList();
    this.loadOutsourcingForm();
    this.onResize();
    this.setTitle();
  }

  public setTitle() {
    if (this.type === "detail")
      this.titleService.setTitle(
        this.translateService.instant("outsourcingPlan.title-detail")
      );
    else if (this.type === "update")
      this.titleService.setTitle(
        this.translateService.instant("outsourcingPlan.title-update")
      );
  }

  ngOnDestroy() {
    this.shareDataFromProjectService.getDataFromList(null);
  }

  getDataFromList() {
    this.subscription = this.shareDataFromProjectService.outsourcePlan.subscribe(
      res => {
        if (res) {
          // eslint-disable-next-line no-debugger
          this.repose = res;
          this.type = res.actionType;

          const setDefaultBusiness = {
            id: res.data.idBusinessUnitActual,
            name: res.data.businessUnitActual
          };

          const setDefaultProduct = {
            id: res.data.idProductionUnitActual,
            name: res.data.productUnitActual
          };

          this.form.patchValue(res.data);
          this.formValue = this.form.value;
          this.listBusinessAct$ = of([setDefaultBusiness]);
          this.listProductionAct$ = of([setDefaultProduct]);
          this.startDateProject = res.data.startDate;
          this.endDateProject = res.data.endDate;
          if (this.form.value.endTimeActual === null) {
            this.setValueToField("endTimeActual", "");
          }
        }
      }
    );
  }

  loadOutsourcingForm() {
    this.appParamsService
      .getAllAppParamsByType("OUTSOURCE_TYPE")
      .subscribe(res => {
        this.outsourcingFormList = res.body;
      });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      id: [""],
      planCode: [""],
      idProject: ["", Validators.required],
      idBusinessUnit: ["", Validators.required],
      idProductionUnit: ["", Validators.required],
      projectName: [""],
      pm: [""],
      am: [""],
      startTime: [null],
      endTime: [null],
      outsourceTypeCode: ["", Validators.required],
      mmos: [""],
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
      requireDevMobile: [""],
      // info actual
      requireTestActual: [""],
      requireDevActual: [""],
      requireBAActual: [""],
      testNumberActual: [""],
      devNumberActual: [""],
      baNumberActual: [""],
      mmosActual: [""],
      descriptionActual: [""],
      outsourceTypeCodeActual: ["", Validators.required],
      endTimeActual: [""],
      startTimeActual: ["", Validators.required],
      idProductionUnitActual: ["", Validators.required],
      idBusinessUnitActual: ["", Validators.required],
      productUnitActual: [""],
      businessUnitActual: [""],
      outsourceTypeNameActual: [""],
      listFilePlanActual: [""],
      devMobileNumberActual: [""],
      requireDevMobileActual: [""]
    });
  }

  onSubmitData() {
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }
    const data = this.form.value;

    if (
      this.isDateErr("startTimeActual") ||
      this.isDateErr("endTimeActual") ||
      this.isDateErrProject("startTimeActual") ||
      this.isDateErrProject("endTimeActual") ||
      this.isDateErrProject("startTimeActualBeforeEndDateOfProject") ||
      this.isEndDateErr("endTimeActual")
    ) {
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
    }
    // open popup create confirm
    if (this.type === "add") {
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: "static"
      });
      modalRef.componentInstance.type = "create";
      modalRef.componentInstance.param = this.translateService.instant(
        "projectManagement.popup.this-value"
      );
      modalRef.componentInstance.onCloseModal.subscribe(value => {
        if (value === true) {
          this.submitFormAfterUpFile(data);
        }
      });
    }
  }

  submitFormAfterUpFile(data) {
    this.spinner.show();
    if (typeof data.startTime === typeof "string") {
      data.startTime = moment
        .utc(this.form.value.startTime)
        .format("YYYY-MM-DD");
    }
    if (typeof data.endTime === typeof "string") {
      data.endTime = moment.utc(this.form.value.endTime).format("YYYY-MM-DD");
    }

    if (typeof data.startTimeActual !== typeof "string") {
      data.startTimeActual = moment
        .utc(new Date(this.form.value.startTimeActual))
        .format("YYYY-MM-DD");
    } else {
      data.startTimeActual = moment
        .utc(this.form.value.startTimeActual)
        .format("YYYY-MM-DD");
    }

    if ("" !== data.endTimeActual) {
      if (typeof data.endTimeActual !== typeof "string") {
        data.endTimeActual = moment
          .utc(new Date(this.form.value.endTimeActual))
          .format("YYYY-MM-DD");
      } else {
        data.endTimeActual = moment
          .utc(this.form.value.endTimeActual)
          .format("YYYY-MM-DD");
      }
    }

    if (null !== data.mmos) data.mmos = data.mmos.replace(",", ".");

    if (null !== data.mmosActual)
      data.mmosActual = data.mmosActual.replace(",", ".");

    this.outsourcingPlanService
      .saveAfterConfirm(data, this.listFilePlanActual)
      .subscribe(
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
    /*if (err.error.message === INVOICE_ERROR_CODE.INVOICE_PACKAGE_EMPTY || err.error.message === INVOICE_ERROR_CODE.INVOICE_INVOICE_LIST_EMPTY) {
      this.showPopupMsg(err.error.data);
    } else {
      err.error.data ? this.toastService.openErrorToast(err.error.data) : this.toastService.openErrorToast(this.translateService.instant('common.toastr.messages.error.save'));
    }*/
  }

  onResize() {
    this.height = this.heightService.onResizeHeight170Px();
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

  loadBusinessUnit(term) {
    this.organizationCategoriesService
      .search({
        name: term,
        page: 0,
        pageSize: 10,
        groupCode: "KD"
      })
      .subscribe(res => {
        if (res) {
          if (res.data === null) {
            $(".ng-option").css("display", "block");
            this.notFoundText = "common.select.notFoundText";
          }
          this.listBusinessAct$ = of(res.data);
        } else {
          this.listBusinessAct$ = of([]);
        }
      });
  }

  onSearchBusiness(value) {
    this.nameBusinessSearchAct = value.term;
    const term = value.term;
    if (term !== "") {
      this.debouncerNameBusinessAct.next(value.term);
      this.notFoundText = "";
      $(".ng-option").css("display", "none");
    } else {
      this.listBusinessAct$ = of([]);
    }
  }

  onClearBusiness() {
    this.nameBusinessSearchAct = "";
    this.listBusinessAct$ = of([]);
    this.setValueToField("name", "");
  }

  onSearchBusinessClose() {
    if (!this.form.value.id) {
      this.listBusinessAct$ = of([]);
      this.nameBusinessSearchAct = "";
    }
  }

  loadProductionUnit(term) {
    this.organizationCategoriesService
      .search({
        name: term,
        page: 0,
        pageSize: 10,
        groupCode: "SX"
      })
      .subscribe(res => {
        if (res) {
          if (res.data === null) {
            $(".ng-option").css("display", "block");
            this.notFoundText = "common.select.notFoundText";
          }
          this.listProductionAct$ = of(res.data);
        } else {
          this.listProductionAct$ = of([]);
        }
      });
  }

  onSearchProduction(value) {
    this.nameProductionSearchAct = value.term;
    const term = value.term;
    if (term !== "") {
      this.debouncerNameProductionAct.next(value.term);
      this.notFoundText = "";
      $(".ng-option").css("display", "none");
    } else {
      this.listProductionAct$ = of([]);
    }
  }

  onClearProduction() {
    this.nameProductionSearchAct = "";
    this.listProductionAct$ = of([]);
    this.setValueToField("name", "");
  }

  onSearchProductionClose() {
    if (!this.form.value.id) {
      this.listProductionAct$ = of([]);
      this.nameProductionSearchAct = "";
    }
  }

  debounceOnSearch() {
    this.debouncerNameBusinessAct
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.loadBusinessUnit(value));
    this.debouncerNameProductionAct
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.loadProductionUnit(value));
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  get formControl() {
    return this.form.controls;
  }

  isFieldValid(field: string) {
    if (field === "startTimeActual") {
      return !this.form.get(field).valid;
    }

    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  isDateErr(field: string) {
    const dt1 = DateTimeModel.fromLocalString(
      this.form.get("startTimeActual").value
    );
    const dt2 = DateTimeModel.fromLocalString(
      this.form.get("endTimeActual").value
    );
    if (field === "endTimeActual") {
      return this.dataFormatService.after(dt1, dt2);
    }
  }

  isEndDateErr(field: string) {
    if (field === "endTimeActual" && this.form.value.endTimeActual !== "") {
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
    let startDate = "";
    let endDate = "";
    if (this.form.value.startTimeActual !== "")
      startDate = moment
        .utc(this.form.value.startTimeActual)
        .format("DD/MM/YYYY");
    if (this.form.value.endTimeActual !== "")
      endDate = moment.utc(this.form.value.endTimeActual).format("DD/MM/YYYY");

    if (
      field === "startTimeActual" &&
      startDate !== "" &&
      this.startDateProject !== ""
    )
      return this.checkDateFirstBeforeDateSecond(
        this.startDateProject,
        startDate
      );
    if (
      field === "startTimeActualBeforeEndDateOfProject" &&
      startDate !== "" &&
      this.startDateProject !== "" &&
      this.endDateProject !== null
    )
      return this.checkDateFirstBeforeDateSecond(
        startDate,
        this.endDateProject
      );

    if (
      field === "endTimeActual" &&
      endDate !== "" &&
      this.endDateProject !== "" &&
      this.endDateProject !== null
    )
      return this.checkDateFirstBeforeDateSecond(endDate, this.endDateProject);
  }

  checkDateFirstBeforeDateSecond(dateFirst, dateSecond) {
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
    )
      return false;

    return true;
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

  changePageSize(size) {
    this.filePerPage = size;
  }

  pageChange(event) {
    this.filePage = event;
  }

  changePageSizeActual(size) {
    this.filePerPageActual = size;
  }

  pageChangeActual(event) {
    this.filePageActual = event;
  }

  onErrorActual(event) {
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

  onChangeFileActual(event: EventEmitter<File[]>) {
    this.errImportFile = false;
    let totalFileValid = 0;
    const indexs = [];
    this.listFilePlanActual = event;
    for (let index = 0; index < this.listFilePlanActual.length; index++) {
      const fileName = this.listFilePlanActual[index].name;
      const fileFormat = this.listFilePlanActual[index].name.substring(
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
    if (totalFileValid === this.listFilePlanActual.length) {
      // this.toastService.openErrorToast('Hệ thống chỉ hỗ trợ upload các file có định dạng: .pdf, .rar, .zip, .xlsx, .xls');
      this.errMessageFile =
        "Hệ thống chỉ hỗ trợ upload các file có định dạng: .pdf, .rar, .zip, .xlsx";
      this.form.get("listFilePlanActual").setValue([]);
      this.errImportFile = true;
      return;
    } else {
      for (let i = indexs.length - 1; i >= 0; i--) {
        this.listFilePlanActual.splice(indexs[i], 1);
        this.form.get("listFilePlanActual").setValue(this.listFilePlanActual);
      }
    }
    // this.checkSizeFile();
    // this.listFilePlanActual = event;
    this.checkSizeFile();
    // this.listFilePlanActual = event;
    // this.checkSizeFile();
  }

  onDeleteDocumentActual(item) {
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
            data = this.formControl.listFilePlanActual.value.filter(value => {
              if (value.fileName !== undefined && item.fileName !== undefined) {
                return value.fileName !== item.fileName;
              }
              if (value.name !== undefined) {
                return value;
              }
            });
          } else {
            data = this.formControl.listFilePlanActual.value.filter(value => {
              if (value.fileName !== undefined && item.fileName !== undefined) {
                return value.fileName;
              }
              if (value.name !== undefined) {
                return value;
              }
            });
          }
          this.listFilePlanActual = data;
          this.setValueToField("listFilePlanActual", data);
          this.checkSizeFile();
        }
      );
    } else {
      const data = this.formControl.listFilePlanActual.value.filter(value => {
        if (value.name !== undefined && item.name !== undefined) {
          return value.name !== item.name;
        }
        if (value.fileName !== undefined) {
          return value;
        }
      });
      this.setValueToField("listFilePlanActual", data);
    }
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

  onKeyInput(event, element) {
    const value = this.getValueOfField(element);
    let valueChange = event.target.value;
    if ("mmosActual" === element) {
      valueChange = this.parseNumberMmosActual(valueChange);
    }
    if (
      "baNumberActual" === element ||
      "devNumberActual" === element ||
      "testNumberActual" === element ||
      "devMobileNumberActual" === element
    ) {
      valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.INTEGER, "");
      if (this.form.get("baNumberActual").value === "0") valueChange = "";
      if (this.form.get("devNumberActual").value === "0") valueChange = "";
      if (this.form.get("testNumberActual").value === "0") valueChange = "";
      if (this.form.get("devMobileNumberActual").value === "0")
        valueChange = "";
    }

    if (value !== valueChange) {
      this.setValueToField(element, valueChange);
      return false;
    }
  }

  parseNumberMmosActual(string) {
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

  getValueOfField(item) {
    return this.form.get(item).value;
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
    for (i = 0; i < this.listFilePlanActual.length; i++) {
      if (this.listFilePlanActual[i].id !== undefined) {
        sizeFile = this.listFilePlanActual[i].size();
      } else {
        sizeFile = CommonUtils.tctGetFileSize(this.listFilePlanActual[i]);
      }
      sizeFileAll += Number(sizeFile);
    }

    if (sizeFileAll > 150) {
      this.form.controls["listFilePlanActual"].setErrors({ maxFile: true });
    }
  }
}
