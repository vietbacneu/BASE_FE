import { Component, Input, OnInit } from "@angular/core";
import { InvoiceSerialModel } from "app/core/models/announcement-management/invoice-serial.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { REGEX_REPLACE_PATTERN } from "app/shared/constants/pattern.constants";
import { UserGroupCategoriesService } from "app/core/services/system-management/user-group-categories.service";
import { NgxSpinnerService } from "ngx-spinner";
import { UserGroupCategoriesComponent } from "app/modules/system-categories/user-group-categories/user-group-categories.component";
import { validate } from "codelyzer/walkerFactory/walkerFn";
import { CommonService } from "app/shared/services/common.service";
import { JhiEventManager } from "ng-jhipster";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { UserGroupModel } from "app/core/models/system-categories/user-group.model";

@Component({
  selector: "jhi-user-group-add",
  templateUrl: "./user-group-add.component.html",
  styleUrls: ["./user-group-add.component.scss"]
})
export class UserGroupAddComponent implements OnInit {
  @Input() public selectedData: UserGroupModel;
  @Input() public type;

  form: FormGroup;
  isModalConfirmShow = false;
  formValue = [];
  codeError: string;
  codeUserGroupList = [];
  codeUserGroup: string;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    private userGroupCategoriesService: UserGroupCategoriesService,
    private commonService: CommonService,
    private eventManager: JhiEventManager,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  onCloseAddModal() {
    if (this.type !== "detail" && this.checkFormValueChanges(this.form.value)) {
      this.isModalConfirmShow = true;
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: "static"
      });
      modalRef.componentInstance.type = "confirm";
      modalRef.componentInstance.onCloseModal.subscribe(value => {
        if (value === true) {
          this.activeModal.dismiss();
          this.form.reset();
        }
        this.isModalConfirmShow = false;
      });
    } else {
      this.activeModal.dismiss();
      this.form.reset();
      this.activeModal.dismiss(true);
    }
  }

  checkFormValueChanges(formValue) {
    if (this.type === "add") {
      if (
        formValue.code === "" &&
        formValue.name === "" &&
        formValue.description === "" &&
        formValue.note === ""
      ) {
        return false;
      }
    }

    if (this.type === "update") {
      if (
        formValue.code === this.selectedData.code &&
        formValue.name === this.selectedData.name &&
        formValue.description === this.selectedData.description &&
        formValue.note === this.selectedData.note
      ) {
        return false;
      }
    }
    return true;
  }

  onSubmitData() {
    const data = this.form.value;
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }

    // open popup update confirm
    if (this.type === "update") {
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: "static"
      });
      modalRef.componentInstance.type = "update";
      modalRef.componentInstance.param = this.translateService.instant(
        "projectManagement.popup.this-value"
      );
      modalRef.componentInstance.onCloseModal.subscribe(value => {
        if (value === true) {
          this.saveData(data);
        }
      });
    } else {
      this.saveData(data);
    }
  }

  saveData(data) {
    this.spinner.show();
    this.userGroupCategoriesService.save(data).subscribe(
      res => {
        this.spinner.hide();

        this.type === "add"
          ? this.toastService.openSuccessToast(
              this.translateService.instant(
                "common.toastr.messages.success.add",
                {
                  paramName: this.translateService.instant(
                    "userGroup.userGroup"
                  )
                }
              )
            )
          : this.toastService.openSuccessToast(
              this.translateService.instant(
                "common.toastr.messages.success.update",
                {
                  paramName: this.translateService.instant(
                    "userGroup.userGroup"
                  )
                }
              )
            );

        this.eventManager.broadcast({
          name: "userGroupListChange"
        });
        this.closeAfterUpdateOrInsert();
      },
      error => {
        this.spinner.hide();
        error.error.data
          ? this.toastService.openErrorToast(error.error.data)
          : this.toastService.openErrorToast(
              this.translateService.instant("common.toastr.messages.error.save")
            );
      }
    );
  }

  closeAfterUpdateOrInsert() {
    this.activeModal.dismiss();
    this.form.reset();
    this.activeModal.dismiss(true);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      id: [""],
      code: ["", Validators.required],
      name: ["", Validators.required],
      description: [""],
      note: [""]
    });
    if (this.selectedData) {
      this.codeUserGroup = this.selectedData.code;
      this.form.patchValue(this.selectedData);
    }
  }

  displayFieldHasError(field: string) {
    return {
      "has-error": this.isFieldValid(field)
    };
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
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

  get formControl() {
    return this.form.controls;
  }

  checkCharSpecial(element) {
    if ("code" === element) {
      this.setErrorField(element, REGEX_REPLACE_PATTERN.CODE_USER_GROUP);
    }
  }

  checkGroupUserCodeExist() {
    const codeUserGroup = this.form.get("code").value;
    if (this.codeUserGroup !== codeUserGroup) {
      this.userGroupCategoriesService
        .checkExistCode(codeUserGroup)
        .subscribe(res => {
          if (res.body !== null) {
            this.form.controls["code"].setErrors({ exist: true });
            this.codeError = codeUserGroup;
          }
        });
    }
  }

  trimSpace(element) {
    const value = this.getValueOfField(element);
    if (value) {
      this.setValueToField(element, value.trim());
    }
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }
}
