import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { HeightService } from "app/shared/services/height.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import { UserGroupAddComponent } from "app/modules/system-categories/user-group-categories/user-group-add/user-group-add.component";
import { UserGroupCategoriesService } from "app/core/services/system-management/user-group-categories.service";
import { HttpResponse } from "@angular/common/http";
import { UserGroupModel } from "app/core/models/system-categories/user-group.model";
import { CommonService } from "app/shared/services/common.service";
import { Subscription } from "rxjs";
import { JhiEventManager } from "ng-jhipster";
import { UserGroupAuthComponent } from "app/modules/system-categories/user-group-categories/user-group-auth/user-group-auth.component";
import { AddUserComponent } from "app/modules/system-categories/user-group-categories/add-user/add-user.component";

@Component({
  selector: "jhi-user-group-categories",
  templateUrl: "./user-group-categories.component.html",
  styleUrls: ["./user-group-categories.component.scss"]
})
export class UserGroupCategoriesComponent implements OnInit, OnDestroy {
  @Input() type;
  form: FormGroup;
  height: number;
  itemsPerPage: any;
  maxSizePage: any;
  routeData: any;
  page: any;
  second: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  idUserGroup: any;
  userGroupList: UserGroupModel[] = [];
  searchForm: any;
  disableDelete = true;
  private eventSubscriber: Subscription;
  listUserIsEmpty = false;
  listUser = [
    {
      id: "",
      lineNumber: 1,
      email: "",
      organizationName: "",
      organizationId: "",
      status: true
    }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private userGroupCategoriesService: UserGroupCategoriesService,
    private router: Router,
    private commonService: CommonService,
    private eventManager: JhiEventManager
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
    this.loadAll();
    this.registerChange();
  }

  onDelete(data) {
    this.idUserGroup = [Number(data.id)];
    const id = [Number(data.id)];
    this.checkUserGroupIsEmpty(id);
  }

  onSubmitDelete() {
    this.spinner.show();
    this.userGroupCategoriesService.delete(this.idUserGroup).subscribe(
      res => {
        this.spinner.hide();
        if (res) {
          this.toastService.openSuccessToast(
            this.translateService.instant(
              "common.toastr.messages.success.delete",
              {
                paramName: this.translateService.instant(
                  "userGroup.modal.title.deleteSucc"
                )
              }
            )
          );
          this.eventManager.broadcast({
            name: "userGroupListChange"
          });
        } else {
          this.toastService.openErrorToast(
            this.translateService.instant("common.toastr.messages.error.delete")
          );
        }
      },
      () => {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.delete")
        );
      }
    );
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      code: [""],
      name: [""]
    });
  }

  openModal(type?: string, selectedData?: any) {
    const modalRef = this.modalService.open(UserGroupAddComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.selectedData = selectedData;
    modalRef.result.then(result => {}).catch(() => {});
  }

  loadAll() {
    this.spinner.show();
    const formValue = this.form.value;
    this.userGroupCategoriesService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        name: formValue.name === "" ? "" : formValue.name,
        code: formValue.code === "" ? "" : formValue.code
      })
      .subscribe(
        (res: HttpResponse<UserGroupModel[]>) => {
          this.spinner.hide();
          this.paginateUserGroup(res.body);
        },
        err => {
          this.spinner.hide();
          this.commonService.openToastMess(
            err.error.code,
            true,
            this.translateService.instant("common.action.search")
          );
        }
      );
  }

  sort() {
    const result = [this.predicate + "," + (this.reverse ? "desc" : "asc")];
    return result;
  }

  paginateUserGroup(data) {
    this.second = data.totalPages;
    this.totalItems = data.totalElements;
    this.userGroupList = data.content;
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.loadAll();
    }
  }

  doSearch() {
    this.page = 1;
    this.loadAll();
  }

  registerChange() {
    this.eventSubscriber = this.eventManager.subscribe(
      "userGroupListChange",
      response => this.loadAll()
    );
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.loadAll();
  }

  checkUserGroupIsEmpty(item) {
    this.page = 1;
    this.userGroupCategoriesService
      .getListUserOfGroup({
        id: item,
        page: this.page - 1,
        size: this.itemsPerPage
      })
      .subscribe(
        (res: HttpResponse<any[]>) => {
          if (res) {
            this.listUser = res.body["content"];
            if (this.listUser.length > 0) {
              this.toastService.openWarningToast(
                this.translateService.instant("userGroup.modal.confirm.delete")
              );
            } else {
              const modalRef = this.modalService.open(ConfirmModalComponent, {
                centered: true,
                backdrop: "static"
              });
              modalRef.componentInstance.type = "delete";
              modalRef.componentInstance.param = this.translateService.instant(
                "userGroup.userGroup"
              );
              modalRef.componentInstance.onCloseModal.subscribe(value => {
                if (value === true) {
                  this.onSubmitDelete();
                }
              });
            }
          }
        },
        err => {
          this.commonService.openToastMess(
            err.error.code,
            true,
            this.translateService.instant("common.action.search")
          );
        }
      );
  }

  /* HuyenLT-IIST modify start 21/05/2020*/
  openModalUserAdd(type?: string, selectedData?: any) {
    const modalRef = this.modalService.open(AddUserComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.selectedData = selectedData;
    modalRef.result.then(result => {}).catch(() => {});
  }

  openModalUserGroupAuth(type?: string, selectedData?: any) {
    const modalRef = this.modalService.open(UserGroupAuthComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.selectedData = selectedData;
    modalRef.result.then(result => {}).catch(() => {});
  }

  /*HuyenLT-IIST modify end 21/05/2020*/
}
