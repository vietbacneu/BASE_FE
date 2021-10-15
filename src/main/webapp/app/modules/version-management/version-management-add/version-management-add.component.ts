import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { SysUserModel } from "app/core/models/system-categories/sys-user.model";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "app/shared/services/toast.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "app/shared/services/common.service";
import { SysUserService } from "app/core/services/system-management/sys-user.service";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { JhiEventManager } from "ng-jhipster";
import { Observable, of, Subject } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { REGEX_PATTERN } from "app/shared/constants/pattern.constants";
import { APP_PARAMS_CONFIG } from "app/shared/constants/app-params.constants";
import { HeightService } from "app/shared/services/height.service";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { DateTimeModel } from "app/core/models/base.model";
import { DownloadService } from "app/shared/services/download.service";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";
import { UploadFileComponent } from "app/shared/components/upload-file/upload-file.component";
import { DatePipe } from "@angular/common";
import { DataFormatService } from "app/shared/services/data-format.service";

@Component({
  selector: "jhi-sys-user-add",
  templateUrl: "./version-management-add.component.html",
  styleUrls: ["./version-management-add.component.scss"]
})
export class VersionManagementAddComponent implements OnInit {
  @Input() type;
  @Input() data;
  @ViewChild("fileImport", { static: false }) fileImport: UploadFileComponent;
  ngbModalRef: NgbModalRef;
  form: FormGroup;
  listUnit: any = [];
  listStatus: any = [];
  unitSearch;
  notFoundText;
  debouncer: Subject<string> = new Subject<string>();
  positionList: any[] = [];
  listUserGroup: any[];
  isDuplicateEmail = false;
  height: number;
  startDateValidate = false;
  endDateValidate = false;
  endDateValidateNowDate = false;
  dataFileResultExcel: any;
  file: any;
  validMaxSize = 5;
  errImport = false;
  successImport = false;
  successMessage;
  errMessage;
  importResult = false;
  messageData;
  startDateValidateData = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private eventManager: JhiEventManager,
    private heightService: HeightService,
    private sysUserService: SysUserService,
    private translateService: TranslateService,
    private downloadService: DownloadService,
    private commonUtils: CommonUtils,
    public datepipe: DatePipe,
    private dataFormatService: DataFormatService,
    private versionManagementService: VersionManagementService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.getPositionList();
    this.getGroupUsers();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: "",
      versionCode: "",
      versionName: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(255)])
      ],
      dataType: [1, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      status: [0, Validators.required],
      file: null
    });
    this.setDataDefault();
  }

  setDataDefault() {
    const dataDefault = [
      {
        id: 1,
        name: "Chức năng"
      },
      {
        id: 2,
        name: "Phi chức năng"
      }
    ];
    if (this.data) {
      this.form.patchValue(this.data);
    }
    this.listUnit = dataDefault;
    this.listStatus = [
      {
        id: 1,
        name: "Hiệu lực"
      },
      {
        id: 0,
        name: "Không hiệu lực"
      }
    ];
  }

  getStatus(status) {
    for (const element of this.listStatus) {
      if (element.id == status) {
        return element.name;
      }
    }
  }

  get formControl() {
    return this.form.controls;
  }
  closeModal() {
    // this.activeModal.dismiss('Cross click');
    this.activeModal.dismiss(true);
    this.eventManager.broadcast({ name: "userListChange" });
  }
  onSubmitData() {
    this.startDateValidateData = false;
    if (this.type === "add" && !this.file) {
      this.errImport = true;
      this.successImport = false;
      this.errMessage = this.translateService.instant(
        "common.import.error.notChooseFile"
      );
    }
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }
    if (this.type === "add" && !this.file) {
      return;
    }
    if (
      !this.file &&
      CommonUtils.tctGetFileSize(this.file) > this.validMaxSize
    ) {
      this.errImport = true;
      this.successImport = false;
      this.errMessage = this.translateService.instant(
        "common.import.error.exceedMaxSize"
      );
      return;
    }
    this.versionManagementService
      .checkStartDate(
        this.dataFormatService.parseTimestampToDate(this.form.value.startDate),
        this.form.value.id
      )
      .subscribe(
        res => {
          this.spinner.show();
          if (res.body.statusCode === "DATE_INVALID") {
            //this.toastService.openWarningToast(res.body.message);
            this.messageData = res.body.message;
            this.startDateValidateData = true;
            this.spinner.hide();
            return;
          } else {
            const formData: FormData = new FormData();
            if (this.file != null) {
              formData.append("file", this.file);
            }
            formData.append("id", this.form.value.id);
            formData.append("versionCode", this.form.value.versionCode);
            formData.append("versionName", this.form.value.versionName);
            formData.append("dataType", this.form.value.dataType);
            formData.append("status", this.form.value.status);
            formData.append(
              "startDate",
              this.dataFormatService.parseTimestampToDate(
                this.form.value.startDate
              )
            );
            formData.append(
              "endDate",
              this.dataFormatService.parseTimestampToDate(
                this.form.value.endDate
              )
            );
            const apiCall = this.versionManagementService.saveVersionManagement(
              formData
            );
            apiCall.subscribe(
              res => {
                if (res.status === STATUS_CODE.SUCCESS) {
                  const successRecord = Number(
                    res.headers.get("successRecord")
                  );
                  const totalRecord = Number(res.headers.get("totalRecord"));
                  this.dataFileResultExcel = res;
                  this.importResult = true;
                  this.errImport = true;
                  this.successImport = false;
                  this.type === "add"
                    ? this.toastService.openSuccessToast(
                        this.translateService.instant(
                          "versionManagement.toastr.messages.success.add"
                        )
                      )
                    : this.toastService.openSuccessToast(
                        this.translateService.instant(
                          "versionManagement.toastr.messages.success.update"
                        )
                      );
                  this.spinner.hide();
                  if (successRecord == 0) {
                    this.eventManager.broadcast({ name: "userListChange" });
                    this.closeModal();
                  } else {
                    this.errMessage =
                      "Import dữ liệu thất bại " +
                      successRecord +
                      "/" +
                      totalRecord +
                      " bản ghi";
                  }
                }
              },
              err => {
                if (err.status === STATUS_CODE.BAD_REQUEST) {
                  this.commonUtils.parseErrorBlob(err).subscribe(rs => {
                    this.errMessage = rs.message;
                  });
                  this.errImport = true;
                  this.successImport = false;
                  this.errMessage = err.error.data
                    ? err.error.data
                    : this.translateService.instant(
                        "common.import.error.default"
                      );
                } else {
                  this.toastService.openErrorToast(
                    this.translateService.instant(
                      "user.toastr.messages.error.add"
                    ),
                    this.translateService.instant("common.toastr.title.error")
                  );
                }
                this.spinner.hide();
              }
            );
          }
        },
        err => {
          return;
        }
      );
  }

  customSearchFn(term: string, item: any) {
    const replacedKey = term.replace(REGEX_PATTERN.SEARCH_DROPDOWN_LIST, "");
    const newRegEx = new RegExp(replacedKey, "gi");
    const purgedPosition = item.name.replace(
      REGEX_PATTERN.SEARCH_DROPDOWN_LIST,
      ""
    );
    return newRegEx.test(purgedPosition);
  }

  onChangePosition(event) {
    if (event) {
      this.setValueToField("positionId", event.id);
      this.setValueToField("positionName", event.name);
    }
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  onClearPosition() {
    this.setValueToField("positionId", null);
    this.setValueToField("positionName", null);
  }

  getPositionList() {
    this.sysUserService
      .getPosition({ paramCode: APP_PARAMS_CONFIG.POSITION })
      .subscribe(
        (res: HttpResponse<any[]>) => {
          if (res) {
            this.positionList = res.body;
            // soft alphaB
            this.positionList.sort(function(a, b) {
              let nameA: string;
              let nameB: string;
              if (a.name !== null) nameA = a.name.toUpperCase();
              if (b.name !== null) nameB = b.name.toUpperCase();
              if (nameA < nameB) return -1;
              else return 1;
              return 0;
            });
          } else {
            this.positionList = [];
          }
        },
        err => {
          this.positionList = [];
        }
      );
  }

  getGroupUsers() {
    this.sysUserService
      .getGroupUsers()
      .subscribe((res: HttpResponse<any[]>) => {
        if (res) {
          this.listUserGroup = res.body;
          // soft alphaB
          this.listUserGroup.sort(function(a, b) {
            let nameA: string;
            let nameB: string;
            if (a.name !== null) nameA = a.name.toUpperCase();
            if (b.name !== null) nameB = b.name.toUpperCase();
            if (nameA < nameB) return -1;
            else return 1;
            return 0;
          });
        } else {
          this.listUserGroup = [];
        }
      });
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }

  displayFieldHasError(field: string) {
    return {
      "has-error": this.isFieldValid(field)
    };
  }

  onBlurEmail(field) {
    this.setValueToField(field, this.getValueOfField(field).trim());
    if (!REGEX_PATTERN.EMAIL.test(this.getValueOfField(field))) {
      if (this.getValueOfField(field) !== "") {
        this.form.controls[field].setErrors({ invalid: true });
      }
    } else {
      if (this.getValueOfField(field) !== "") {
        // check trùng
        this.sysUserService
          .checkEmail({
            email: this.getValueOfField(field),
            id: this.type === "update" ? this.data.id : ""
          })
          .subscribe(res => {
            this.isDuplicateEmail = res.body;
          });
      }
    }
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  onResize() {
    this.height = this.heightService.onResize();
  }

  trimSpace(element) {
    const value = this.getValueOfField(element);
    if (value) {
      this.setValueToField(element, value.trim());
    }
  }

  onCancel() {
    if (this.type === "preview") {
      this.closeModal();
    } else {
      if (this.checkFormValueChanges(this.form.value)) {
        const modalRef = this.modalService.open(ConfirmModalComponent, {
          centered: true,
          backdrop: "static"
        });
        modalRef.componentInstance.type = "confirm";
        modalRef.componentInstance.onCloseModal.subscribe(value => {
          if (value === true) {
            this.closeModal();
          }
        });
      } else {
        this.closeModal();
      }
    }
  }

  checkFormValueChanges(formValue) {
    if (
      this.type === "add" &&
      formValue.versionName === "" &&
      formValue.startDate === null &&
      formValue.endDate === null &&
      formValue.status === 0
    ) {
      return false;
    }
    if (
      this.type === "update" &&
      this.data.versionCode === formValue.versionCode &&
      this.data.versionName === formValue.versionName &&
      this.data.startDate === formValue.startDate &&
      this.data.status === formValue.status &&
      this.data.endDate === formValue.endDate
    ) {
      return false;
    }
    return true;
  }

  equalDateStr(date1: string, date2: string) {
    if (
      date1 == null ||
      date2 == null ||
      date1 === "" ||
      date2 === "" ||
      date1 === undefined ||
      date2 === undefined
    )
      return -2;
    const dt1 = this.fortmatDate(date1);
    const dt2 = this.fortmatDate(date2);
    if (dt1 > dt2) return 1;
    else if (dt1 < dt2) return -1;
    else return 0;
  }

  fortmatDate(dateString: string): DateTimeModel {
    const date = new Date(dateString);
    const isValidDate = !isNaN(date.valueOf());
    if (!dateString || !isValidDate) {
      return null;
    }
    return new DateTimeModel({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    });
  }

  /**
   * Kiểm tra hiển thị thông báo lỗi validate của ngày "Bắt đầu"
   * ưu tiên so sánh từ trên xuống dưới và từ trái sang phải
   * @param date
   */
  isShowErrorMessage(date) {
    this.startDateValidate = false;
    this.endDateValidate = false;
    this.endDateValidateNowDate = false;
    this.startDateValidateData = false;

    if (this.equalDateStr(date, this.form.get("endDate").value) === 1) {
      this.startDateValidate = true;
    }
    if (this.equalDateStr(date, this.form.get("startDate").value) === -1) {
      this.endDateValidate = true;
    }
    if (
      this.equalDateStr(
        this.datepipe.transform(new Date(), "yyyy-MM-dd"),
        this.form.get("endDate").value
      ) === 1
    ) {
      this.endDateValidateNowDate = true;
    }
  }

  downloadFileTemplate(fileName) {
    var fileExcel;
    this.spinner.show();
    if (fileName == "xlsx") {
      fileExcel = "IMPORT_Danh_Muc_Phien_Ban.xlsx";
    } else {
      fileExcel = "IMPORT_Danh_Muc_Phien_Ban.xls";
    }
    this.versionManagementService
      .downloadFileExcel(fileExcel)
      .subscribe(res => {
        this.spinner.hide();
        if (res) {
          this.downloadService.downloadFile(res);
        }
      });
  }

  downloadFileImport() {
    this.downloadService.downloadFile(this.dataFileResultExcel);
    this.closeModal();
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
  onChangeFile(event) {
    this.file = event;
    if (CommonUtils.tctGetFileSize(this.file) > this.validMaxSize) {
      this.errImport = true;
      this.successImport = false;
      this.errMessage = this.translateService.instant(
        "common.import.error.exceedMaxSize"
      );
      return false;
    }
  }
  deleteFileImport() {
    this.file = "";
    this.fileImport.delete();
    this.errImport = false;
    this.successImport = false;
    this.importResult = false;
  }
  downloadFileResult(fileName) {
    this.versionManagementService
      .downloadFileResultExcel(fileName)
      .subscribe(res => {
        this.spinner.hide();
        if (res.status === STATUS_CODE.SUCCESS) {
          const status = Number(res.headers.get("status"));
          if (status === 2) {
            this.toastService.openErrorToast(
              this.translateService.instant(
                "profileAppraisal.toastr.messages.fileNotFound"
              )
            );
          } else {
            this.downloadService.downloadFile(res);
          }
        }
      });
  }
}
