import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "app/shared/services/toast.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "app/shared/services/common.service";
import { SysUserService } from "app/core/services/system-management/sys-user.service";
import { JhiEventManager } from "ng-jhipster";
import { HttpResponse } from "@angular/common/http";
import { HeightService } from "app/shared/services/height.service";
import { DownloadService } from "app/shared/services/download.service";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";
import { UploadFileComponent } from "app/shared/components/upload-file/upload-file.component";
import { ProfileAppraisalService } from "app/core/services/profile-appraisal/profile-appraisal.service";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";

@Component({
  selector: "jhi-profile-appraisal-history",
  templateUrl: "./profile-appraisal-history.component.html",
  styleUrls: ["./profile-appraisal-history.component.scss"]
})
export class ProfileAppraisalHistoryComponent implements OnInit {
  @Input() data;
  @ViewChild("fileImport", { static: false }) fileImport: UploadFileComponent;
  ngbModalRef: NgbModalRef;
  listData: any = [];
  height: number;
  width: number;
  dataFileResultExcel: any;
  file: any;
  listStatus: any = [];

  constructor(
    public activeModal: NgbActiveModal,
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
    private profileAppraisalService: ProfileAppraisalService,
    private versionManagementService: VersionManagementService
  ) {}

  ngOnInit() {
    this.getHistory(this.data.id);
    this.height = this.heightService.onResize();
    this.listStatus = [
      {
        id: 1,
        name: "Draft"
      },
      {
        id: 2,
        name: "New"
      },
      {
        id: 3,
        name: "Pending"
      },
      {
        id: 4,
        name: "Approve"
      }
      // , {
      //   id: 5,
      //   name: 'Close'
      // }, {
      //   id: 6,
      //   name: 'Rejected'
      // }
    ];
  }

  closeModal() {
    this.activeModal.dismiss("Cross click");
    this.activeModal.dismiss(true);
  }

  onCancel() {
    this.closeModal();
  }

  getStatus(status) {
    for (const element of this.listStatus) {
      if (element.id == status) {
        return element.name;
      }
    }
  }
  getHistory(id) {
    this.profileAppraisalService.getHistoryProfileAppraisal(id).subscribe(
      (res: HttpResponse<any[]>) => {
        if (res) {
          this.listData = res.body;
        } else {
          this.listData = [];
        }
      },
      err => {
        this.listData = [];
      }
    );
  }

  onResize() {
    this.height = this.heightService.onResize();
    this.width = window.innerWidth - 50;
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
