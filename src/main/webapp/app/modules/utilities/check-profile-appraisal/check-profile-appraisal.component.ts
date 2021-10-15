import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import { Observable, of, Subject, Subscription } from "rxjs";
import { JhiEventManager } from "ng-jhipster";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { ProfileAppraisalService } from "app/core/services/profile-appraisal/profile-appraisal.service";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { BsModalRef } from "ngx-bootstrap/modal/bs-modal-ref.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";
import { DownloadService } from "app/shared/services/download.service";
import { UploadFileComponent } from "app/shared/components/upload-file/upload-file.component";
import { HeightService } from "app/shared/services/height.service";

@Component({
  selector: "jhi-check-profile-appraisal",
  templateUrl: "./check-profile-appraisal.component.html",
  styleUrls: ["./check-profile-appraisal.component.scss"]
})
export class CheckProfileAppraisalComponent implements OnInit, OnDestroy {
  form: FormGroup;
  height: number;
  eventSubscriber: Subscription;
  file: any;
  errImport = false;
  successImport = false;
  errMessage;
  validMaxSize = 5;
  dataFileResultExcel: any;
  errorRecord = 0;
  modalRef: BsModalRef;
  successMessage;
  @ViewChild("template", { static: true }) templateRef: TemplateRef<any>;
  @ViewChild("fileImport", { static: false }) fileImport: UploadFileComponent;
  constructor(
    private translateService: TranslateService,
    protected router: Router,
    private profileAppraisalService: ProfileAppraisalService,
    private spinner: NgxSpinnerService,
    private eventManager: JhiEventManager,
    private toastService: ToastService,
    private commonUtils: CommonUtils,
    private bsModalService: BsModalService,
    private versionManagementService: VersionManagementService,
    private downloadService: DownloadService,
    private heightService: HeightService
  ) {}
  ngOnInit() {
    //this.eventManager.destroy(this.eventSubscriber);
  }

  ngOnDestroy() {}
  onSubmit() {
    if (!this.file) {
      this.errImport = true;
      this.successImport = false;
      this.errMessage = this.translateService.instant(
        "common.import.error.notChooseFile"
      );
      return;
    }
    if (CommonUtils.tctGetFileSize(this.file) > this.validMaxSize) {
      this.errImport = true;
      this.successImport = false;
      this.errMessage = this.translateService.instant(
        "common.import.error.exceedMaxSize"
      );
      return;
    }
    this.spinner.show();
    const formData: FormData = new FormData();
    formData.append("file", this.file);
    const apiCall = this.profileAppraisalService.checkProfileAppraisal(
      formData
    );
    apiCall.subscribe(
      res => {
        if (res.status === STATUS_CODE.SUCCESS) {
          const status = Number(res.headers.get("status"));
          if (status === 2) {
            //this.dataFileResultExcel = res;
            //this.importResult = true;
            //this.errImport = true;
            //this.successImport = false;
            this.errMessage = this.translateService.instant(
              "common.import.error.resultImportFalse"
            );
          } else {
            this.dataFileResultExcel = res;
            this.errorRecord = Number(res.headers.get("errorRecord"));
            if (res.body.size !== 0) {
              this.modalRef = this.bsModalService.show(this.templateRef, {});
            } else {
              window.history.back();
            }
          }
          this.spinner.hide();
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
            : this.translateService.instant("common.import.error.default");
        } else {
          this.toastService.openErrorToast(
            this.translateService.instant("user.toastr.messages.error.add"),
            this.translateService.instant("common.toastr.title.error")
          );
        }
        this.spinner.hide();
      }
    );
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

  downloadFileTemplate(fileName) {
    var fileExcel;
    this.spinner.show();
    if (fileName == "xlsx") {
      fileExcel = "ULNL_Template.xlsx";
    } else {
      fileExcel = "ULNL_Template.xls";
    }
    this.versionManagementService
      .downloadFileExcel(fileExcel)
      .subscribe(res => {
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
        this.spinner.hide();
      });
  }

  onChangeFile(event) {
    this.file = event;
    if (
      this.file != null &&
      CommonUtils.tctGetFileSize(this.file) > this.validMaxSize
    ) {
      this.errImport = true;
      this.successImport = false;
      this.errMessage = this.translateService.instant(
        "common.import.error.exceedMaxSize"
      );
      return false;
    }
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
  closeModalResult() {
    this.bsModalService.hide(1);
  }

  downloadFileImport() {
    this.downloadService.downloadFile(this.dataFileResultExcel);
    this.closeModalResult();
  }

  deleteFileImport() {
    this.file = "";
    this.errImport = false;
    this.successImport = false;
    this.fileImport.delete();
  }

  onResize() {
    this.height = this.heightService.onResize();
  }
}
