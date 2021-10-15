import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { InvoiceSerialModel } from "app/core/models/announcement-management/invoice-serial.model";
import { REGEX_REPLACE_PATTERN } from "app/shared/constants/pattern.constants";
import { Observable, of, Subject } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { UserGroupCategoriesService } from "app/core/services/system-management/user-group-categories.service";
import { UserGroupModel } from "app/core/models/system-categories/user-group.model";
import { SysUserService } from "app/core/services/system-management/sys-user.service";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { SysUserModel } from "app/core/models/system-categories/sys-user.model";
import { ObjectCreate } from "zone.js/lib/common/utils";
import { HeightService } from "app/shared/services/height.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "app/shared/services/common.service";

@Component({
  selector: "jhi-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"]
})
/**
 * huyenlt iist.
 * Created 15/05/2020
 */
export class AddUserComponent implements OnInit {
  @Input() public selectedData: UserGroupModel;
  @Input() type;

  form: FormGroup;
  isModalConfirmShow = false;
  formValueOld = [];
  hiddenSave = false;
  isAddFieldsError = false;
  height: number;
  page: any;
  itemsPerPage: any;
  maxSizePage: any;
  second: any;
  totalItems: any;
  previousPage: any;
  predicate: any;
  reverse: any;
  routeData: any;
  /*auto complete product*/
  listAccEmail$ = new Observable<any[]>();
  maxLengthItemTable = [];
  termSearchAccEmail;
  debouncerAccEmail: Subject<string> = new Subject<string>();
  listUser = [
    {
      id: "",
      email: null,
      organizationName: "",
      organizationId: "",
      status: true
    }
  ];
  listValue = [];
  backupUser = [];
  emailIsExistInGroup = false;
  emailIsNull = false;
  index: number;
  listUser2 = [];
  disabledAdd = false;
  checkAddFirst = 0;
  notFoundText;
  searchTerm;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private userGroupCategoriesService: UserGroupCategoriesService,
    private sysUserService: SysUserService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private heightService: HeightService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute
  ) {
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.page = 1;
  }

  ngOnInit() {
    this.onResize();
    this.buildForm();
    this.getUserListInGroup();
    this.debounceOnSearchEmail();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: [""]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      console.warn(111, this.selectedData);
    }
  }

  editUser(i) {
    this.hiddenSave = true;
    this.listUser[i].status = true;
    this.backupUser[i] = JSON.parse(JSON.stringify(this.listUser[i]));
  }
  cancelUser(i) {
    this.hiddenSave = false;
    if (
      this.listUser[i].email === null ||
      this.listUser[i].email === "" ||
      this.backupUser[i] === undefined
    ) {
      this.totalItems = this.totalItems - 1;
      this.isModalConfirmShow = true;
      this.listUser.splice(i, 1);
      this.changePageSize(this.itemsPerPage);
      this.disabledAdd = false;
      return;
    } else {
      this.listUser[i].status = false;
      this.listUser[i] = this.backupUser[i];
      this.listUser2[i] = this.backupUser[i];
    }
  }
  saveUser(i) {
    // validate
    if (this.checkEmailNull(i)) {
      this.hiddenSave = false;
      this.listUser2[i].status = false;
      this.disabledAdd = false;
    }
  }
  debounceOnSearchEmail() {
    this.debouncerAccEmail
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.loadListUser(value));
  }

  loadListUser(term) {
    this.sysUserService
      .getAll({
        page: 0,
        size: 10,
        email: term
      })
      .subscribe(res => {
        if (res) {
          this.listAccEmail$ = of(res.body.data);
          if (res.body.data.length === 0) {
            this.notFoundText = "common.select.notFoundText";
            $(".ng-option").css("display", "block");
          }
        } else {
          this.listAccEmail$ = of([]);
        }
      });
  }
  getUserListInGroup() {
    this.spinner.show();
    this.userGroupCategoriesService
      .getListUserOfGroup({
        id: this.selectedData.id,
        page: 0,
        size: 100
      })
      .subscribe(
        (res: HttpResponse<any[]>) => {
          if (res) {
            this.formValueOld = CommonUtils.convertObjectToArray(
              res.body["content"]
            );
            this.spinner.hide();
            this.listUser = res.body["content"];
            this.totalItems = this.listUser.length;
            this.listUser2 = res.body["content"];
            this.changePageSize(this.itemsPerPage);
          }
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

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.listUser2 = this.listUser.slice(
        this.itemsPerPage * page - this.itemsPerPage,
        this.itemsPerPage * page
      );
    }
  }
  changePageSize(size) {
    this.itemsPerPage = size;
    this.listUser2 = this.listUser.slice(0, size);
  }
  onCloseAddModal() {
    if (this.checkFormValueChanges()) {
      this.isModalConfirmShow = true;
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: "static"
      });
      modalRef.componentInstance.type = "confirm";
      modalRef.componentInstance.onCloseModal.subscribe(value => {
        if (value === true) {
          this.activeModal.dismiss();
        }
        this.isModalConfirmShow = false;
      });
    } else {
      this.activeModal.dismiss();
      this.form.reset();
      this.activeModal.dismiss(true);
    }
  }
  onSubmitData() {
    this.spinner.show();
    const data = JSON.parse(JSON.stringify(this.listUser));
    const listUser = [];
    data.forEach(item => {
      if (item.id) {
        listUser.push({
          id: item.id
        });
      }
    });
    const dataSend = {
      groupUserId: this.selectedData.id,
      lstUser: listUser
    };
    this.userGroupCategoriesService.addUserOfUser(dataSend).subscribe(res => {
      if (res) {
        this.spinner.hide();
        this.toastService.openSuccessToast(
          this.translateService.instant("userGroup.toastr.messages.success.add")
        );
        this.activeModal.dismiss(true);
      } else {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.save")
        );
      }
    });
  }

  checkFormValueChanges() {
    const formValueChange = CommonUtils.convertObjectToArray(this.listUser);
    if (formValueChange.length === this.formValueOld.length) {
      for (let i = 0; i < formValueChange.length; i++) {
        if (formValueChange[i] !== this.formValueOld[i]) return true;
      }
    } else {
      return true;
    }

    return false;
  }
  onChangeEmail(ind, event) {
    if (event) {
      if (this.checkUserIsExistInGroup(event) === false) {
        this.emailIsExistInGroup = false;
        this.listUser[ind].id = event.id;
        this.listUser[ind].email = event.email;
        this.listUser[ind].organizationName = event.organizationName;
        this.listUser[ind].organizationId = event.organizationId;
      } else {
        this.emailIsExistInGroup = true;
        this.index = ind; // hien thi input do tai chi so nao
      }
    } else {
      this.listUser[ind].organizationName = "";
    }
    if (this.listUser[ind].email === "") {
      this.hiddenSave = true;
    } else {
      this.disabledAdd = false;
    }
  }

  checkEmailNull(ind) {
    if (this.listUser[ind].email === null || this.listUser[ind].email === "") {
      this.emailIsNull = true;
      this.index = ind; // hien thi input do tai chi so nao
      this.hiddenSave = true;
      this.toastService.openErrorToast("Acc email bắt buộc nhập");
      return false;
    } else {
      this.emailIsNull = false;
      return true;
    }
  }

  setErrorField(field: string, pattern) {
    const result = this.getValueOfField(field).match(pattern);
    if (result) {
      result.forEach(it => {
        if (it !== "") {
          this.form.controls[field].setErrors({ pattern: true });
        }
      });
    }
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }

  onSearchItemEmail(value, index) {
    if ((value.term && value.term.trim()) || value.term !== "") {
      this.termSearchAccEmail = value.term.trim();
      this.debouncerAccEmail.next(value.term);
      this.listUser[index].email = null;
      this.notFoundText = "";
      $(".ng-option").css("display", "none");
    }
  }
  clearValueEmail(index) {
    this.termSearchAccEmail = null;
    this.listAccEmail$ = of([]);
    this.listUser[index].organizationName = null;
    this.emailIsExistInGroup = false;
    this.hiddenSave = true;
    this.disabledAdd = true;
  }

  onAddRow() {
    this.totalItems = this.totalItems + 1;
    this.disabledAdd = true;
    const obj = {
      id: "",
      email: null,
      organizationName: "",
      organizationId: "",
      status: true
    };
    this.listUser.unshift(obj);
    this.changePageSize(this.itemsPerPage);
    this.hiddenSave = true;
  }
  onDeleteRow(index) {
    this.totalItems = this.totalItems - 1;
    this.isModalConfirmShow = true;
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: "static"
    });
    modalRef.componentInstance.type = "confirmDelete";
    modalRef.componentInstance.onCloseModal.subscribe(value => {
      if (value === true) {
        this.listUser.splice(index, 1);
        this.changePageSize(this.itemsPerPage);
        this.disabledAdd = false;
      }
      this.isModalConfirmShow = true;
    });
    if (this.listUser.length === 0) {
      this.onAddRow();
    }
  }
  checkUserIsExistInGroup(event) {
    const formValueChange = CommonUtils.convertObjectToArray(this.listUser);
    for (let i = 1; i < formValueChange.length; i++) {
      if (event.id === formValueChange[i].id) {
        this.hiddenSave = true;
        this.toastService.openErrorToast(
          this.translateService.instant(
            "userGroup.toastr.messages.error.isExist"
          )
        );
        return true;
      }
    }

    return false;
  }

  showMessIsExist() {
    if (this.emailIsExistInGroup === true)
      this.toastService.openErrorToast(
        this.translateService.instant("userGroup.toastr.messages.error.isExist")
      );
  }
}
