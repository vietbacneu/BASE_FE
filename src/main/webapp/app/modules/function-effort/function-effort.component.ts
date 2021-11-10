import { Component, OnDestroy, OnInit } from "@angular/core";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { HeightService } from "app/shared/services/height.service";
import { VersionManagementAddComponent } from "app/modules/version-management/version-management-add/version-management-add.component";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";
import { Observable, of, Subject, Subscription } from "rxjs";
import { JhiEventManager } from "ng-jhipster";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { REGEX_PATTERN } from "app/shared/constants/pattern.constants";
import { ProfileAppraisalService } from "app/core/services/profile-appraisal/profile-appraisal.service";
import { OrganizationCategoriesService } from "app/core/services/system-management/organization-categories.service";
import { DownloadService } from "app/shared/services/download.service";

@Component({
  selector: "jhi-sys-user",
  templateUrl: "./function-effort.component.html",
  styleUrls: ["./function-effort.component.scss"]
})
export class FunctionEffortComponent implements OnInit, OnDestroy {
  form: FormGroup;
  height: number;
  itemsPerPage: any;
  maxSizePage: any;
  routeData: any;
  page: number;
  second: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  userList: any;
  formValue;
  eventSubscriber: Subscription;
  listUnit: any = [];
  listStatus: any = [];
  debouncer: Subject<string> = new Subject<string>();
  positionList: any[] = [];
  listOrganization: any[] = [];
  constructor(
    private heightService: HeightService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private modalService: NgbModal,
    private downloadService: DownloadService,
    protected router: Router,
    private spinner: NgxSpinnerService,
    private eventManager: JhiEventManager,
    private toastService: ToastService,
    private profileAppraisalService: ProfileAppraisalService,
    private organizationCategoriesService: OrganizationCategoriesService,
    private versionManagementService: VersionManagementService
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
    this.buidForm();
    this.onResize();
    this.loadAll();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      functionName: "",
      appCode: "",
      appName: "",
      srCode: "",
      organizationRequest: "",
      profileAppraisaCode: "",
      startDate: "",
      endDate: ""
    });
  }

  get formControl() {
    return this.form.controls;
  }

  setValueOfForm(formValue) {
    this.formValue = formValue;
  }
  loadAll() {
    this.spinner.show();
    this.profileAppraisalService
      .searchFunctionEffort({
        page: this.page - 1,
        limit: this.itemsPerPage,
        sort: this.sort(),
        functionName: this.form.get("functionName").value
          ? this.form.get("functionName").value
          : "",
        srCode: this.form.get("srCode").value
          ? this.form.get("srCode").value
          : "",
        appCode: this.form.get("appCode").value
          ? this.form.get("appCode").value
          : "",
        appName: this.form.get("appName").value
          ? this.form.get("appName").value
          : "",
        organizationRequest: this.form.get("organizationRequest").value
          ? this.form.get("organizationRequest").value
          : "",
        profileAppraisaCode: this.form.get("profileAppraisaCode").value
          ? this.form.get("profileAppraisaCode").value
          : "",
        startDate: this.form.get("startDate").value
          ? this.form.get("startDate").value
          : "",
        endDate: this.form.get("endDate").value
          ? this.form.get("endDate").value
          : ""
      })
      .subscribe(
        res => {
          this.spinner.hide();
          this.paginateUserList(res);
        },
        err => {
          this.spinner.hide();
          this.toastService.openErrorToast(
            this.translateService.instant("common.toastr.messages.error.load")
          );
        }
      );
  }

  private paginateUserList(data) {
    this.totalItems = data.totalElements;
    this.userList = data.content;
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.loadAll();
    }
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.loadAll();
  }

  onSearchData() {
    this.loadAll();
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  sort() {
    const result = [this.predicate + "," + (this.reverse ? "asc" : "desc")];
    if (this.predicate !== "id") {
      result.push("id");
    }
    return result;
  }

  openModalAddUser(type?: string, selectedData?: any) {
    const modalRef = this.modalService.open(VersionManagementAddComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.data = selectedData;
    modalRef.result.then(result => {}).catch(() => {});
  }

  onDelete(ids) {
    this.versionManagementService.deleteVersion({ id: ids }).subscribe(res => {
      if (res.body) {
        const modalRef = this.modalService.open(ConfirmModalComponent, {
          centered: true,
          backdrop: "static"
        });
        modalRef.componentInstance.type = "delete";
        modalRef.componentInstance.param = this.translateService.instant(
          "user.user"
        );
        modalRef.componentInstance.onCloseModal.subscribe(value => {
          if (value === true) {
            this.onSubmitDelete(ids);
          }
        });
      } else {
        this.toastService.openErrorToast(
          this.translateService.instant("user.invalidDelete")
        );
      }
    });
  }

  onSubmitDelete(id) {
    this.spinner.show();
    this.versionManagementService.deleteVersion(id).subscribe(
      res => {
        if (res.status === STATUS_CODE.SUCCESS) {
          this.spinner.hide();
          this.toastService.openSuccessToast(
            this.translateService.instant("user.toastr.messages.success.delete")
          );
          this.loadAll();
        }
      },
      err => {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant("user.toastr.messages.error.delete")
        );
      }
    );
  }

  ngOnDestroy() {
    //this.eventManager.destroy(this.eventSubscriber);
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

  getValueOfField(item) {
    return this.form.get(item).value;
  }
  trimSpace(element) {
    const value = this.getValueOfField(element);
    if (value) {
      this.setValueToField(element, value.trim());
    }
  }

  searchOrganization(event) {
    if (event) {
      this.organizationCategoriesService
        .getAllCodeOrName({
          name: event.term,
          type: ""
        })
        .subscribe(res => {
          if (res) {
            this.listOrganization = res.body["content"];
          } else {
            this.listOrganization = [];
          }
        });
    }
  }

  onClearOrganization(type) {
    if (type === 1) {
      this.listOrganization = [];
    }
  }
  viewProfileAppraisal(id) {
    this.profileAppraisalService.getProfileById(id).subscribe(res => {
      const dataSend = res.body;
      dataSend.type = "preview";
      this.profileAppraisalService.changeProfile(dataSend);
      this.router.navigate(["/profile-appraisal-add"]);
    });
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
