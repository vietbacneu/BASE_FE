import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { CommonApiService } from "app/core/services/common-api/common-api.service";
import { JhiEventManager } from "ng-jhipster";
import { ActivatedRoute } from "@angular/router";
import { HeightService } from "app/shared/services/height.service";
import { FormBuilder } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataCategoryService } from "app/modules/system-categories/data-categories/services/data-category.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { DownloadService } from "app/shared/services/download.service";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { UploadFileComponent } from "app/shared/components/upload-file/upload-file.component";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { OrganizationCategoriesService } from "app/core/services/system-management/organization-categories.service";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";

@Component({
  selector: "jhi-import-excel-organization",
  templateUrl: "./import-excel-non-function-management.component.html",
  styleUrls: ["./import-excel-non-function-management.component.scss"]
})
export class ImportExcelNonFunctionManagementComponent implements OnInit {
  @ViewChild("fileImport", { static: false }) fileImport: UploadFileComponent;
  @ViewChild("cancelBtn", { static: false }) cancelBtn: ElementRef;
  @ViewChild("closeBtn", { static: false }) closeBtn: ElementRef;
  @ViewChild("deleteFileElem", { static: false }) deleteFileElem: ElementRef;
  @ViewChild("downloadTemplateBtn", { static: false })
  downloadTemplateBtn: ElementRef;
  @ViewChild("downloadTemplateBtn1", { static: false })
  downloadTemplateBtn1: ElementRef;
  @ViewChild("downloadResultBtn", { static: false })
  downloadResultBtn: ElementRef;
  @Input() public isClose;

  file: any;
  successRecord = 0;
  totalRecord = 0;
  formatIncorrect = false;
  exceedMaxSize = false;
  uploadSuccess = false;
  resultImportTrue = false;
  resultImportFalse = false;
  fileNotChoose = false;
  importResult = false;
  errImport = false;
  successImport = false;
  successMessage;
  errMessage;
  path: any;
  isCancel = false;
  isKeyPress = false;
  isEsc = false;
  isClick = false;
  errorFileStatus = false;
  dataFileResultExcel: any;
  validMaxSize = 5;

  constructor(
    private commonApiService: CommonApiService,
    private eventManager: JhiEventManager,
    private activatedRoute: ActivatedRoute,
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private dataCategoryService: DataCategoryService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private downloadService: DownloadService,
    private organizationCategoriesService: OrganizationCategoriesService,
    private versionManagementService: VersionManagementService,
    private commonUtils: CommonUtils
  ) {}

  ngOnInit() {}

  downloadFileExcel() {
    this.dataCategoryService
      .downloadFileExcel("excel-template1.xlsx")
      .subscribe(
        res => {
          if (res && res.body.statusCode === "SUCCESS") {
            // this.base64ExcelFile = res.body.data;
          }
        },
        error => console.warn(error)
      );
  }

  onClickedOutside() {
    if (
      this.isClose &&
      this.isCancel &&
      !this.isKeyPress &&
      document.activeElement !== this.cancelBtn.nativeElement &&
      document.activeElement !== this.closeBtn.nativeElement &&
      document.activeElement !== this.downloadTemplateBtn.nativeElement &&
      document.activeElement !== this.downloadTemplateBtn1.nativeElement &&
      document.activeElement !== this.deleteFileElem.nativeElement &&
      document.activeElement !== this.downloadResultBtn.nativeElement
    ) {
      this.isClose = false;
      this.onCloseAddModal();
      this.isClick = true;
    }
    !this.isClose ? (this.isCancel = false) : (this.isCancel = true);
    !this.isEsc ? (this.isKeyPress = false) : (this.isKeyPress = true);
  }

  onCloseAddModal() {
    if (this.file && !this.importResult) {
      this.isClose = false;
      this.isEsc = true;
      this.isClick = true;
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: "static"
      });
      modalRef.componentInstance.type = "confirm";
      modalRef.componentInstance.onCloseModal.subscribe(value => {
        if (value === true) {
          this.activeModal.close("import");
        }
        this.isClose = true;
        this.isEsc = false;
        this.isClick = false;
      });
    } else {
      this.activeModal.close("import");
    }
  }

  deleteFileImport() {
    this.file = "";
    this.fileImport.delete();
    this.errImport = false;
    this.successImport = false;
    this.importResult = false;
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

  onFocusOut() {
    this.isClose = true;
    this.isCancel = true;
  }

  downloadFileTemplate(excelType) {
    this.spinner.show();
    if ("xlsx" === excelType) {
      this.versionManagementService
        .downloadFileExcel("projectManage.xlsx")
        .subscribe(res => {
          this.spinner.hide();
          if (res) {
            this.downloadService.downloadFile(res);
          }
        });
    } else if ("xls" === excelType) {
      this.versionManagementService
        .downloadFileExcel("template_import_quan_ly_du_an.xls")
        .subscribe(res => {
          this.spinner.hide();
          if (res) {
            this.downloadService.downloadFile(res);
          }
        });
    }
  }

  downloadFileImport() {
    this.downloadService.downloadFile(this.dataFileResultExcel);
  }

  onSubmitImport() {
    this.resetMess();
    if (CommonUtils.tctGetFileSize(this.file) > this.validMaxSize) {
      this.errImport = true;
      this.successImport = false;
      this.errMessage = this.translateService.instant(
        "common.import.error.exceedMaxSize"
      );
      return false;
    }
    if (!this.file) {
      this.errImport = true;
      this.successImport = false;
      this.errMessage = this.translateService.instant(
        "common.import.error.notChooseFile"
      );
    } else {
      this.spinner.show();
      this.versionManagementService.doImport(this.file).subscribe(
        res => {
          this.spinner.hide();
          if (res) {
            this.dataFileResultExcel = res;
            this.successRecord = Number(res.headers.get("successRecord"));
            this.totalRecord = Number(res.headers.get("totalRecord"));
            if (this.path === "errHeader") {
              this.path = null;
              this.importResult = false;
              this.errImport = true;
              this.successImport = false;
              this.errMessage = this.translateService.instant(
                "common.import.error.resultImportFalse",
                { totalRecord: this.totalRecord }
              );
            } else {
              this.successRecord = Number(res.headers.get("successRecord"));
              this.totalRecord = Number(res.headers.get("totalRecord"));
              this.dataFileResultExcel = res;
              this.importResult = true;
              this.errImport = false;
              this.successImport = true;
              this.successMessage = this.translateService.instant(
                "common.import.success.import",
                {
                  successRecord: this.successRecord,
                  totalRecord: this.totalRecord
                }
              );
              this.eventManager.broadcast({ name: "dataPmChange" });
            }
          }
        },
        err => {
          console.warn(err);
          this.spinner.hide();
          this.commonUtils.parseErrorBlob(err).subscribe(rs => {
            this.errMessage = rs.message;
          });
          if (err.status === STATUS_CODE.BAD_REQUEST) {
            this.commonUtils.parseErrorBlob(err).subscribe(rs => {
              this.errMessage = rs.message;
            });
            this.errImport = true;
            this.successImport = false;
            this.errMessage = err.error.data
              ? err.error.data
              : this.translateService.instant("common.import.error.default");
          } else {
            this.errImport = true;
            this.successImport = false;
            this.errMessage = this.translateService.instant(
              "common.import.error.default"
            );
          }
        }
      );
    }
  }

  resetMess() {
    this.formatIncorrect = false;
    this.exceedMaxSize = false;
    this.uploadSuccess = false;
    this.resultImportTrue = false;
    this.resultImportFalse = false;
    this.fileNotChoose = false;
    this.importResult = false;
    this.errImport = false;
    this.successImport = false;
  }

  base64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || "";
    sliceSize = sliceSize || 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: "application/vnd.ms-excel" });
    return blob;
  }
}
