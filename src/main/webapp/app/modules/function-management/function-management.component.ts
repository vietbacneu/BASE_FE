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
import { ViewFunctionManagementComponent } from "app/modules/function-management/view-function-management/view-function-management.component";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "app/shared/services/common.service";
import { JhiEventManager } from "ng-jhipster";
import { Observable, of, Subject, Subscription } from "rxjs";
import { ToastService } from "app/shared/services/toast.service";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { ImportExcelFunctionManagementComponent } from "app/modules/function-management/import-excel-function-management-plan/import-excel-function-management.component";
import { DownloadService } from "app/shared/services/download.service";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { OrganizationCategoriesService } from "app/core/services/system-management/organization-categories.service";
import { AppParamModel } from "./../../core/models/profile-management/app-param.model";
import { HttpResponse } from "@angular/common/http";
@Component({
  selector: "jhi-function-management",
  templateUrl: "./function-management.component.html",
  styleUrls: ["./function-management.component.scss"]
})
export class FunctionManagementComponent implements OnInit {
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
  listVersion: any[] = [];

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;

  projectManagement: ProjectManagementModel[];
  eventSubscriber: Subscription;
  startDate;

  isModalConfirmShow = false;

  deleteStatus = ["SUCCESS", "ELEMENT_USED", "SYSTEM_ERROR"];

  wrapListPm: any;
  listPm$ = new Observable<any[]>();
  codeSearchPm;
  debouncerPm: Subject<string> = new Subject<string>();
  wrapListBusiness: any;
  listBusiness$ = new Observable<any[]>();
  codeSearchBusiness;
  debouncerBusiness: Subject<string> = new Subject<string>();
  listStatus: any = [];
  listWorkType: any = [];

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
    this.listWorkType = [
      {
        id: "Giải pháp",
        name: "Giải pháp"
      },
      {
        id: "Phát triển",
        name: "Phát triển"
      },
      {
        id: "Kiểm thử",
        name: "Kiểm thử"
      }
    ];
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      functionType: [""],
      workType: [""],
      versionCode: [""],
      status: [""]
    });
  }

  openModal(type?: string, selectedData?: any) {
    if (type === "add" || type === "detail" || type === "update") {
      const modalRef = this.modalService.open(ViewFunctionManagementComponent, {
        size: "lg",
        backdrop: "static",
        keyboard: false
      });
      modalRef.componentInstance.type = type;
      modalRef.componentInstance.selectedData = selectedData;
      modalRef.result.then(result => {}).catch(() => {});
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
    // set show first page
    if (isShowFirst) {
      this.previousPage = 1;
      this.page = 1;
    }
    const data = {
      functionType: this.form.value.functionType,
      workType: this.form.value.workType,
      versionCode: this.form.value.versionCode,
      status: this.form.value.status,
      page: this.page - 1,
      limit: this.itemsPerPage
    };

    this.versionManagementService.searchFunction(data).subscribe(
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
      "functionManagement.delete"
    );
    modalRef.componentInstance.onCloseModal.subscribe(value => {
      if (value === true) {
        this.versionManagementService.deleteFunction(id).subscribe(res => {
          this.toastService.openSuccessToast(
            this.translateService.instant(
              "functionManagement.toastr.messages.success.delete"
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

  onClearPm() {
    this.listPm$ = of([]);
    this.codeSearchPm = "";
  }

  /**
   * Am autocomplete
   * @param event
   */

  /**
   * Business autocomplete
   * @param event
   */
  onSelectBusiness(event) {
    this.codeSearchBusiness = event.term;
    const term = event.term;
    if (term !== "") {
      this.debouncerBusiness.next(term);
      $(".ng-option").css("display", "none");
    } else {
      this.listBusiness$ = of([]);
    }
  }

  onClearBusiness() {
    this.listBusiness$ = of([]);
    this.codeSearchBusiness = "";
  }

  onSearchBusinessClose() {
    if (!this.form.value.id) {
      this.listBusiness$ = of([]);
      this.codeSearchBusiness = "";
    }
  }

  trimSpace(element) {
    const value = this.getValueOfField(element);
    if (value) {
      this.setValueToField(element, value.trim());
    }
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
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
