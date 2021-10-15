import { Component, OnInit } from "@angular/core";
import { HeightService } from "app/shared/services/height.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { ActivatedRoute, Router } from "@angular/router";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";
import { ProjectManagementModel } from "app/core/models/project-management/project-management.model";
import { ViewNonFunctionManagementComponent } from "app/modules/non-function-management/view-non-function-management/view-non-function-management.component";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "app/shared/services/common.service";
import { JhiEventManager } from "ng-jhipster";
import { Observable, of, Subject, Subscription } from "rxjs";
import { ToastService } from "app/shared/services/toast.service";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { ImportExcelNonFunctionManagementComponent } from "app/modules/non-function-management/import-excel-non-function-management-plan/import-excel-non-function-management.component";
import { DownloadService } from "app/shared/services/download.service";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { OrganizationCategoriesService } from "app/core/services/system-management/organization-categories.service";
import { AppParamModel } from "./../../core/models/profile-management/app-param.model";
import { HttpResponse } from "@angular/common/http";
@Component({
  selector: "jhi-non-function-management",
  templateUrl: "./non-function-management.component.html",
  styleUrls: ["./non-function-management.component.scss"]
})
export class NonFunctionManagementComponent implements OnInit {
  height: number;
  form: FormGroup;
  itemsPerPage: any;
  maxSizePage: any;
  pageSize: any;
  routeData: any;
  page: any;
  second: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;

  projectManagement: ProjectManagementModel[];
  eventSubscriber: Subscription;
  startDate;
  listStatus: any = [];
  listVersion: any[] = [];
  isModalConfirmShow = false;
  deleteStatus = ["SUCCESS", "ELEMENT_USED", "SYSTEM_ERROR"];
  constructor(
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    public translateService: TranslateService,
    private versionManagementService: VersionManagementService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private eventManager: JhiEventManager,
    private toastService: ToastService,
    private downloadService: DownloadService,
    private router: Router,
    private appParamsService: AppParamsService,
    private organizationCategoriesService: OrganizationCategoriesService
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.routeData = this.activatedRoute.data.subscribe(data => {
      if (data && data.pagingParams) {
        this.page = data.pagingParams.page;
        this.previousPage = data.pagingParams.page;
        this.reverse = data.pagingParams.ascending;
        this.predicate = data.pagingParams.predicate;
      }
    });
  }

  ngOnInit() {
    this.buidForm();
    this.onResize();
    this.search(false);
    this.registerChange();
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

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      workName: [""],
      workCode: [""],
      versionCode: [""],
      status: [""]
    });
  }

  openModal(type?: string, selectedData?: any) {
    if (type === "add" || type === "detail" || type === "update") {
      const modalRef = this.modalService.open(
        ViewNonFunctionManagementComponent,
        {
          size: "lg",
          backdrop: "static",
          keyboard: false
        }
      );
      modalRef.componentInstance.type = type;
      modalRef.componentInstance.selectedData = selectedData;
      modalRef.result.then(result => {}).catch(() => {});
    }

    if (type === "import") {
      const modalRef = this.modalService.open(
        ImportExcelNonFunctionManagementComponent,
        {
          size: "lg",
          windowClass: "modal-import",
          backdrop: "static",
          keyboard: false
        }
      );
      modalRef.componentInstance.type = type;
      modalRef.result
        .then(result => {
          if (result === "import") {
            this.page = 1;
            this.search(true);
          }
        })
        .catch(() => {});
      // this.router.navigate(['/import-excel-outsourcing-plan']);
    }
  }

  getParamList(paramType) {
    this.spinner.show();
    this.appParamsService.getParamByCode(paramType).subscribe(
      res => {
        this.spinner.hide();
        return res.body;
      },
      error => {
        this.spinner.hide();
        this.commonService.openToastMess(
          error.error.code,
          true,
          this.translateService.instant("common.action.search")
        );
      }
    );
  }

  search(isShowFirst: boolean) {
    this.spinner.show();
    if (isShowFirst) {
      this.previousPage = 1;
      this.page = 1;
    }
    const data = {
      workName: this.form.value.workName,
      workCode: this.form.value.workCode,
      versionCode: this.form.value.versionCode,
      status: this.form.value.status,
      page: this.page - 1,
      limit: this.itemsPerPage
    };

    this.versionManagementService.searchNonFunction(data).subscribe(
      res => {
        this.spinner.hide();
        this.projectManagement = res.body.data;
        this.totalItems = res.body.dataCount;
      },
      error => {
        this.spinner.hide();
        this.commonService.openToastMess(
          error.error.code,
          true,
          this.translateService.instant("common.action.search")
        );
      }
    );
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.transition();
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    const formValue = this.form.value;

    this.search(false);
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
  }

  registerChange() {
    this.eventSubscriber = this.eventManager.subscribe(
      "dataPmChange",
      response => {
        this.search(true);
      }
    );
  }

  onDelete(id) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: "static"
    });
    modalRef.componentInstance.type = "delete";
    modalRef.componentInstance.param = this.translateService.instant(
      "nonFunctionManagement.delete"
    );
    modalRef.componentInstance.onCloseModal.subscribe(value => {
      if (value === true) {
        this.versionManagementService.deleteNonFunction(id).subscribe(res => {
          // Có lỗi xảy ra
          this.toastService.openSuccessToast(
            this.translateService.instant(
              "nonFunctionManagement.toastr.messages.success.delete"
            )
          );
          this.search(true);
        });
      }
    });
  }

  navigation(data) {
    this.versionManagementService.navigation(data);
    this.router.navigate(["/outsourcing-plan"]);
  }

  formatPreShow(content: string) {
    if (content.length > 60) return content.substring(0, 60) + "...";
    else return content;
  }

  getStatus(status) {
    for (const element of this.listStatus) {
      if (element.id == status) {
        return element.name;
      }
    }
  }

  searchVersion(event) {
    if (event) {
      this.versionManagementService
        .getVersion(0, 50, event.term)
        .subscribe((res: HttpResponse<AppParamModel[]>) => {
          if (res) {
            this.listVersion = res.body["data"].map(i => {
              i.versionName = i.versionCode + " - " + i.versionName;
              return i;
            });
          } else {
            this.listVersion = [];
          }
        });
    }
  }
  onClearVersion(type) {
    if (type === 1) {
      this.listVersion = [];
    }
  }
}
