import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { TreeviewConfig, TreeviewItem } from "ngx-treeview";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { HttpResponse } from "@angular/common/http";
import { UserGroupCategoriesService } from "app/core/services/system-management/user-group-categories.service";
import { UserGroupModel } from "app/core/models/system-categories/user-group.model";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "jhi-user-group-auth",
  templateUrl: "./user-group-auth.component.html",
  styleUrls: ["./user-group-auth.component.scss"]
})
/**
 * huyenlt iist.
 * Created 15/05/2020
 */
export class UserGroupAuthComponent implements OnInit {
  @Input() public id;
  @Input() public selectedData: UserGroupModel;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  checkIdOld: any[] = [];
  treeViewItems = [];
  checkedTreeView: any[] = [];
  idPermission: number;
  ngbModalRef: NgbModalRef;
  valueChanges: boolean;
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 537
  });
  form: FormGroup;
  constructor(
    private spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    private toastService: ToastService,
    private modalService: NgbModal,
    private translateService: TranslateService,
    private commonUtils: CommonUtils,
    private userGroupService: UserGroupCategoriesService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.buildForm();
    this.getPermissionList(this.selectedData.id);
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      name: [""]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
    }
  }
  onSubmitData() {
    const lists = [];
    this.checkedTreeView.forEach(it => {
      lists.push({
        value: it,
        checked: true
      });
    });
    this.spinner.show();
    this.userGroupService
      .savePermission(this.selectedData.id, lists)
      .subscribe(res => {
        if (res) {
          this.spinner.hide();
          this.activeModal.dismiss(true);
          this.toastService.openSuccessToast(
            this.translateService.instant(
              "userGroup.toastr.messages.success.permission"
            )
          );
        } else {
          this.spinner.hide();
          this.toastService.openErrorToast(
            this.translateService.instant("common.toastr.messages.error.save")
          );
        }
      });
  }
  getPermissionList(id) {
    this.treeViewItems = [];
    //this.idPermission = this.id;
    this.userGroupService
      .getPermission(id)
      .subscribe((res: HttpResponse<any[]>) => {
        if (res) {
          const objTree = res.body;
          for (let i = 0; i < objTree.length; i++) {
            this.treeViewItems.push(new TreeviewItem(objTree[i]));
          }
        } else {
          this.treeViewItems = [];
        }
        this.getChecked(this.treeViewItems, this.checkIdOld);
        this.valueChanges = false;
      });
  }
  getChecked(treeView: TreeviewItem[], result: any[]) {
    treeView.forEach(tree => {
      if (tree.checked) {
        result.push(tree.value);
      }
      if (tree.children) {
        this.getChecked(tree.children, result);
      }
    });
    this.checkedTreeView = this.checkIdOld;
  }
  onSelectedChange(env) {
    this.checkedTreeView = env;
    this.valueChanges = true;
  }
  onCloseAddModal() {
    if (this.valueChanges) {
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: "static"
      });
      modalRef.componentInstance.type = "confirm";
      modalRef.componentInstance.onCloseModal.subscribe(value => {
        if (value === true) {
          this.activeModal.dismiss("Cross click");
        }
      });
    } else {
      this.activeModal.dismiss("Cross click");
      this.activeModal.dismiss(true);
    }
  }
}
