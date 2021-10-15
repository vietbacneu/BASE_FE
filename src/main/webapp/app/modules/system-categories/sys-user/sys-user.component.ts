import { Component, OnDestroy, OnInit } from "@angular/core";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { HeightService } from "app/shared/services/height.service";
import { SysUserAddComponent } from "app/modules/system-categories/sys-user/sys-user-add/sys-user-add.component";
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
import { SysUserService } from "app/core/services/system-management/sys-user.service";
import { Observable, of, Subject, Subscription } from "rxjs";
import { JhiEventManager } from "ng-jhipster";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { HttpResponse } from "@angular/common/http";
import { REGEX_PATTERN } from "app/shared/constants/pattern.constants";
import { APP_PARAMS_CONFIG } from "app/shared/constants/app-params.constants";

@Component({
  selector: "jhi-sys-user",
  templateUrl: "./sys-user.component.html",
  styleUrls: ["./sys-user.component.scss"]
})
export class SysUserComponent implements OnInit, OnDestroy {
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
  listUnit$ = new Observable<any[]>();
  unitSearch;
  notFoundText;
  debouncer: Subject<string> = new Subject<string>();
  positionList: any[] = [];
  constructor(
    private heightService: HeightService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private modalService: NgbModal,
    protected router: Router,
    private spinner: NgxSpinnerService,
    private eventManager: JhiEventManager,
    private toastService: ToastService,
    private sysUserService: SysUserService
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
    this.debounceOnSearch();
    this.getPositionList();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      userName: [""],
      email: [""],
      positionId: [null],
      organizationId: [null],
      positionName: null
    });
  }

  get formControl() {
    return this.form.controls;
  }

  registerChange() {
    this.eventSubscriber = this.eventManager.subscribe(
      "userListChange",
      response => this.loadAll()
    );
  }
  setValueOfForm(formValue) {
    this.formValue = formValue;
  }
  loadAll() {
    this.spinner.show();
    this.sysUserService
      .getAll({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        name: this.form.get("userName").value
          ? this.form.get("userName").value
          : "",
        email: this.form.get("email").value ? this.form.get("email").value : "",
        positionId: this.form.get("positionId").value
          ? this.form.get("positionId").value
          : "",
        organizationId: this.form.get("organizationId").value
          ? this.form.get("organizationId").value
          : ""
      })
      .subscribe(
        res => {
          this.spinner.hide();
          this.paginateUserList(res.body);
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
    this.totalItems = data.dataCount;
    this.userList = data.data;
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.transition();
  }

  onSearchData() {
    this.transition();
  }

  transition() {
    this.router.navigate(["/system-categories/sys-user"], {
      queryParams: {
        page: this.page,
        size: this.itemsPerPage,
        sort: this.predicate + "," + (this.reverse ? "asc" : "desc"),
        name: this.form.get("userName").value
          ? this.form.get("userName").value
          : "",
        email: this.form.get("email").value ? this.form.get("email").value : "",
        positionId: this.form.get("positionId").value
          ? this.form.get("positionId").value
          : "",
        organizationId: this.form.get("organizationId").value
          ? this.form.get("organizationId").value
          : ""
      }
    });
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
    const modalRef = this.modalService.open(SysUserAddComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.data = selectedData;
    modalRef.result.then(result => {}).catch(() => {});
  }

  onDelete(ids) {
    this.sysUserService.checkDeleteUser({ id: ids }).subscribe(res => {
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
    this.sysUserService.delete(id).subscribe(
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

  debounceOnSearch() {
    this.debouncer
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.loadDataOnSearchUnit(value));
  }

  onSearchUnit(event) {
    this.unitSearch = event.term;
    const term = event.term;
    if (term !== "") {
      this.debouncer.next(term);
      this.notFoundText = "";
      $(".ng-option").css("display", "none");
    } else {
      this.listUnit$ = of([]);
      $(".ng-option").css("display", "block");
    }
  }

  loadDataOnSearchUnit(term) {
    this.sysUserService
      .getUnit({
        name: term,
        limit: ITEMS_PER_PAGE,
        page: 0
      })
      .subscribe((res: HttpResponse<any[]>) => {
        if (res && res.status === STATUS_CODE.SUCCESS && this.unitSearch) {
          this.listUnit$ = of(
            res.body["content"].sort((a, b) => a.name.localeCompare(b.name))
          );
          if (res.body["content"].length === 0) {
            this.notFoundText = "common.select.notFoundText";
            $(".ng-option").css("display", "block");
          }
        } else {
          this.listUnit$ = of([]);
        }
      });
  }

  onClearUnit() {
    this.listUnit$ = of([]);
    this.unitSearch = "";
  }

  onSearchUnitClose() {
    if (!this.form.value.name) {
      this.listUnit$ = of([]);
      this.unitSearch = "";
    }
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
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
      .getPosition({
        paramCode: APP_PARAMS_CONFIG.POSITION
      })
      .subscribe(
        (res: HttpResponse<any[]>) => {
          if (res) {
            this.positionList = res.body;
          } else {
            this.positionList = [];
          }
        },
        err => {
          this.positionList = [];
        }
      );
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
}
