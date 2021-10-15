import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { CommonApiService } from "app/core/services/common-api/common-api.service";
import { JhiEventManager } from "ng-jhipster";
import { HeightService } from "app/shared/services/height.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { DownloadService } from "app/shared/services/download.service";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { ProfileAppraisalService } from "app/core/services/profile-appraisal/profile-appraisal.service";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { UploadFileComponent } from "app/shared/components/upload-file/upload-file.component";

@Component({
  selector: "jhi-import-excel",
  templateUrl: "./import-excel.component.html",
  styleUrls: ["./import-excel.component.scss"]
})
export class ImportExcelComponent implements OnInit {
  @ViewChild("fileImport", { static: false }) fileImport: UploadFileComponent;
  @ViewChild("cancelBtn", { static: false }) cancelBtn: ElementRef;
  @ViewChild("closeBtn", { static: false }) closeBtn: ElementRef;
  @ViewChild("deleteFileElem", { static: false }) deleteFileElem: ElementRef;
  @ViewChild("downloadTemplateBtn", { static: false })
  downloadTemplateBtn: ElementRef;
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
  isProcess = true;
  checkTaskTimeHandle = null;
  validMaxSize = 5;
  constructor(
    private commonApiService: CommonApiService,
    private eventManager: JhiEventManager,
    private activatedRoute: ActivatedRoute,
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private downloadService: DownloadService,
    private commonUtils: CommonUtils,
    private profileAppraisalService: ProfileAppraisalService
  ) {}

  ngOnInit() {}

  onClickedOutside() {
    if (
      this.isClose &&
      this.isCancel &&
      !this.isKeyPress &&
      document.activeElement !== this.cancelBtn.nativeElement &&
      document.activeElement !== this.closeBtn.nativeElement &&
      document.activeElement !== this.downloadTemplateBtn.nativeElement &&
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
          this.activeModal.dismiss();
        }
        this.isClose = true;
        this.isEsc = false;
        this.isClick = false;
      });
    } else {
      this.activeModal.dismiss();
      this.activeModal.dismiss(true);
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
      this.profileAppraisalService
        .downloadTemplateFileExcel(excelType)
        .subscribe(res => {
          this.spinner.hide();
          console.warn(111, res);
          if (res) {
            this.downloadService.downloadFile(res);
          }
        });
    } else if ("xls" === excelType) {
      this.profileAppraisalService
        .downloadTemplateFileExcel(excelType)
        .subscribe(res => {
          this.spinner.hide();
          console.warn(111, res);
          if (res) {
            this.downloadService.downloadFile(res);
          }
        });
    }
  }

  downloadFileImport() {
    console.warn(this.dataFileResultExcel);
    this.downloadService.downloadFile(this.dataFileResultExcel);
  }

  onSubmitImport() {
    this.isProcess = true;
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
      this.profileAppraisalService.doImport(this.file).subscribe(
        res => {
          // this.spinner.hide();
          if (res) {
            console.warn(res);
            const idTask = res.body.id;
            this.checkTaskTimeHandle = setInterval(() => {
              console.warn("CALL API CHECK TASK PROCESS: " + idTask);
              console.warn("---- START CHECK ------");
              this.checkProcessTaskImport(idTask);
              console.warn("---- END CHECK ------");
              // neu truong hop import thanh cong hoa co loi xay ra => dung check task
            }, 10000); // 10s

            // this.successRecord = res.body.data.split('+')[1];
            // this.totalRecord = Number(res.body.data.split('+')[2]) + Number(res.body.data.split('+')[1]);
            // this.path = res.body.data.split('+')[0];
            // if (this.path === 'errHeader') {
            //   this.path = null;
            //   this.importResult = false;
            //   this.errImport = true;
            //   this.successImport = false;
            //   this.errMessage = this.translateService.instant('common.import.error.resultImportFalse', { totalRecord: this.totalRecord });
            // } else {
            //   this.successRecord = Number(res.headers.get('successRecord'));
            //   this.totalRecord = Number(res.headers.get('totalRecord'));
            //   this.dataFileResultExcel = res;
            //   this.importResult = true;
            //   this.errImport = false;
            //   this.successImport = true;
            //   this.successMessage = this.translateService.instant('common.import.success.import', {
            //     successRecord: this.successRecord,
            //     totalRecord: this.totalRecord
            //   });
            //   this.eventManager.broadcast({ name: 'dataCategoryChangeList' });
            // }
          }
        },
        err => {
          console.warn(err);
          this.spinner.hide();
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

  //@CreatBy: Thanhnb-iist 29/07/2020
  // check trang thai cua task import
  checkProcessTaskImport(id: number) {
    console.warn("CHECK TASK IMPORT");
    this.profileAppraisalService.checkProcessTaskAsyncImport(id).subscribe(
      res => {
        if ("PROCESSING" === res.body.statusCode) {
          // TH: task import dang thuc hien
          this.isProcess = true;
        } else if ("SUCCESS" === res.body.statusCode) {
          // TH: task Import thanh cong
          this.spinner.hide();
          this.isProcess = false;
          this.eventManager.broadcast({ name: "searchAllPartnerCapacityProf" });
          // goi api download file
          this.profileAppraisalService.downloadFileImport(id).subscribe(
            resDownload => {
              // truong hop thanh cong
              this.successRecord = Number(
                resDownload.headers.get("successRecord")
              );
              this.totalRecord = Number(resDownload.headers.get("totalRecord"));
              this.dataFileResultExcel = resDownload;
              console.warn(this.dataFileResultExcel);
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

              if (!this.isProcess) {
                this.spinner.hide();
                if (this.checkTaskTimeHandle !== null) {
                  clearInterval(this.checkTaskTimeHandle);
                }
              }
            },
            error => {
              if (!this.isProcess) {
                this.spinner.hide();
                if (this.checkTaskTimeHandle !== null) {
                  clearInterval(this.checkTaskTimeHandle);
                }
              }
            }
          );
        } else {
          // TH: task Import bi loi
          console.warn("TASK " + id + "ERROR ");
          this.spinner.hide();
          // truong hop loi
          this.errImport = true;
          this.successImport = false;
          this.errMessage = res.body.message
            ? res.body.message
            : this.translateService.instant("common.import.error.default");
          this.isProcess = false;

          if (!this.isProcess) {
            console.warn("----- CLEAR TIMEOUT -----");
            this.spinner.hide();
            if (this.checkTaskTimeHandle !== null) {
              clearInterval(this.checkTaskTimeHandle);
            }
          }
        }
      },
      error => {
        this.isProcess = false;
        this.errImport = true;
        this.successImport = false;
        this.errMessage = this.translateService.instant(
          "common.import.error.default"
        );

        if (!this.isProcess) {
          this.spinner.hide();
          if (this.checkTaskTimeHandle !== null) {
            clearInterval(this.checkTaskTimeHandle);
          }
        }
      }
    );
  }
}
