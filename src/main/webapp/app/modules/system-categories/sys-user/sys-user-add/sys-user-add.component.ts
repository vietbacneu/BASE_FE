import { Component, Input, OnInit } from "@angular/core";
import { SysUserModel } from "app/core/models/system-categories/sys-user.model";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "app/shared/services/toast.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "app/shared/services/common.service";
import { SysUserService } from "app/core/services/system-management/sys-user.service";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { JhiEventManager } from "ng-jhipster";
import { Observable, of, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { ITEMS_PER_PAGE } from "app/shared/constants/pagination.constants";
import { HttpResponse } from "@angular/common/http";
import { REGEX_PATTERN } from "app/shared/constants/pattern.constants";
import { APP_PARAMS_CONFIG } from "app/shared/constants/app-params.constants";
import { HeightService } from "app/shared/services/height.service";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";

@Component({
  selector: "jhi-sys-user-add",
  templateUrl: "./sys-user-add.component.html",
  styleUrls: ["./sys-user-add.component.scss"]
})
export class SysUserAddComponent implements OnInit {
  @Input() type;
  @Input() data: SysUserModel;

  ngbModalRef: NgbModalRef;
  form: FormGroup;
  listUnit$ = new Observable<any[]>();
  unitSearch;
  notFoundText;
  debouncer: Subject<string> = new Subject<string>();
  positionList: any[] = [];
  listUserGroup: any[];
  isDuplicateEmail = false;
  height: number;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private eventManager: JhiEventManager,
    private heightService: HeightService,
    private sysUserService: SysUserService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.debounceOnSearch();
    this.getPositionList();
    this.getGroupUsers();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: "",
      email: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(50)])
      ],
      name: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(255)])
      ],
      organizationId: [null, Validators.required],
      organizationName: [""],
      positionId: [null, Validators.required],
      positionName: [null, Validators.required],
      note: ["", Validators.maxLength(500)],
      description: ["", Validators.maxLength(500)],
      userGroup: [null]
    });
    if (this.data) {
      this.setDataDefault();
    }
  }

  setDataDefault() {
    const dataDefault = {
      id: this.data.organizationId,
      name: this.data.organizationName
    };
    this.form.patchValue(this.data);
    this.listUnit$ = of([dataDefault]);
    // load lại nhóm người dùng
  }

  get formControl() {
    return this.form.controls;
  }
  closeModal() {
    // if (this.checkFormValueChanges(this.form.value) && this.type !== 'detail') {
    //   this.isModalConfirmShow = true;
    //   const modalRef = this.modalService.open(ConfirmModalComponent, {centered: true, backdrop: 'static'});
    //   modalRef.componentInstance.type = 'confirm';
    //   modalRef.componentInstance.onCloseModal.subscribe(value => {
    //     if (value === true) {
    //       this.activeModal.dismiss('Cross click');
    //     }
    //     this.isModalConfirmShow = false;
    //   });
    // } else {
    this.activeModal.dismiss("Cross click");
    // this.form.reset();
    this.activeModal.dismiss(true);
    // }
  }
  onSubmitData() {
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }
    if (this.isDuplicateEmail) {
      return;
    }
    const apiCall =
      this.type === "add"
        ? this.sysUserService.save(this.form.value)
        : this.sysUserService.update(this.form.value);
    apiCall.subscribe(
      res => {
        if (res.status === STATUS_CODE.SUCCESS) {
          this.eventManager.broadcast({
            name: "userListChange"
          });
          this.activeModal.dismiss(true);
          this.type === "add"
            ? this.toastService.openSuccessToast(
                this.translateService.instant(
                  "user.toastr.messages.success.add"
                )
              )
            : this.toastService.openSuccessToast(
                this.translateService.instant(
                  "user.toastr.messages.success.update"
                )
              );
        }
      },
      err => {
        this.toastService.openErrorToast(
          this.translateService.instant("user.toastr.messages.error.add"),
          this.translateService.instant("common.toastr.title.error")
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
      .getPosition({ paramCode: APP_PARAMS_CONFIG.POSITION })
      .subscribe(
        (res: HttpResponse<any[]>) => {
          if (res) {
            this.positionList = res.body;
            // soft alphaB
            this.positionList.sort(function(a, b) {
              let nameA: string;
              let nameB: string;
              if (a.name !== null) nameA = a.name.toUpperCase();
              if (b.name !== null) nameB = b.name.toUpperCase();
              if (nameA < nameB) return -1;
              else return 1;
              return 0;
            });
          } else {
            this.positionList = [];
          }
        },
        err => {
          this.positionList = [];
        }
      );
  }

  getGroupUsers() {
    this.sysUserService
      .getGroupUsers()
      .subscribe((res: HttpResponse<any[]>) => {
        if (res) {
          this.listUserGroup = res.body;
          // soft alphaB
          this.listUserGroup.sort(function(a, b) {
            let nameA: string;
            let nameB: string;
            if (a.name !== null) nameA = a.name.toUpperCase();
            if (b.name !== null) nameB = b.name.toUpperCase();
            if (nameA < nameB) return -1;
            else return 1;
            return 0;
          });
        } else {
          this.listUserGroup = [];
        }
      });
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }

  displayFieldHasError(field: string) {
    return {
      "has-error": this.isFieldValid(field)
    };
  }

  onBlurEmail(field) {
    this.setValueToField(field, this.getValueOfField(field).trim());
    if (!REGEX_PATTERN.EMAIL.test(this.getValueOfField(field))) {
      if (this.getValueOfField(field) !== "") {
        this.form.controls[field].setErrors({ invalid: true });
      }
    } else {
      if (this.getValueOfField(field) !== "") {
        // check trùng
        this.sysUserService
          .checkEmail({
            email: this.getValueOfField(field),
            id: this.type === "update" ? this.data.id : ""
          })
          .subscribe(res => {
            this.isDuplicateEmail = res.body;
          });
      }
    }
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  onResize() {
    this.height = this.heightService.onResize();
  }

  trimSpace(element) {
    const value = this.getValueOfField(element);
    if (value) {
      this.setValueToField(element, value.trim());
    }
  }

  onCancel() {
    if (this.type === "update") {
      if (
        this.form.value.id === this.data.id &&
        this.form.value.email === this.data.email &&
        this.form.value.name === this.data.name &&
        this.form.value.organizationId === this.data.organizationId &&
        this.form.value.organizationName === this.data.organizationName &&
        this.form.value.positionId === this.data.positionId &&
        this.form.value.positionName === this.data.positionName &&
        this.form.value.note === this.data.note &&
        this.form.value.description === this.data.description &&
        this.form.value.userGroup === this.data.userGroup
      ) {
        this.closeModal();
      } else {
        const modalRef = this.modalService.open(ConfirmModalComponent, {
          centered: true,
          backdrop: "static"
        });
        modalRef.componentInstance.type = "confirm";
        modalRef.componentInstance.onCloseModal.subscribe(value => {
          if (value === true) {
            this.closeModal();
          }
        });
      }
    }
    if (this.type === "add") {
      if (
        this.form.value.id === "" &&
        this.form.value.email === "" &&
        this.form.value.name === "" &&
        this.form.value.organizationId === null &&
        this.form.value.organizationName === "" &&
        this.form.value.positionId === null &&
        this.form.value.positionName === null &&
        this.form.value.note === "" &&
        this.form.value.description === "" &&
        this.form.value.userGroup === null
      ) {
        this.closeModal();
      } else {
        const modalRef = this.modalService.open(ConfirmModalComponent, {
          centered: true,
          backdrop: "static"
        });
        modalRef.componentInstance.type = "confirm";
        modalRef.componentInstance.onCloseModal.subscribe(value => {
          if (value === true) {
            this.closeModal();
          }
        });
      }
    }
  }
}
