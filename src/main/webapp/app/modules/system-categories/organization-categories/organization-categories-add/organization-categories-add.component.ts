import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { HeightService } from "app/shared/services/height.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OrganizationCategoriesModel } from "app/core/models/system-categories/organization-categories.model";
import { OrganizationCategoriesService } from "app/core/services/system-management/organization-categories.service";
import { CommonService } from "app/shared/services/common.service";
import { NgxSpinnerService } from "ngx-spinner";
import { omit } from "lodash";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import {
  REGEX_PATTERN,
  REGEX_REPLACE_PATTERN
} from "app/shared/constants/pattern.constants";
import { JhiEventManager } from "ng-jhipster";
import { Observable, of, Subject } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "jhi-organization-categories-add",
  templateUrl: "./organization-categories-add.component.html",
  styleUrls: ["./organization-categories-add.component.scss"]
})
export class OrganizationCategoriesAddComponent implements OnInit {
  @Input() public selectedData: OrganizationCategoriesModel;
  @Input() type;
  form: FormGroup;
  isCheckedAdd = false;
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
  checkCode = false;
  // formValue : {
  //   code: string,
  //   name: string,
  //   parentId: number,
  //   organizationGroup: number
  // };
  parentOrganizationList = new Observable<any[]>();
  // groupOrganizationList = new Observable<any[]>();
  groupOrganizationList: any[] = [];
  listUnit$ = new Observable<any[]>();
  unitSearch;
  debouncer: Subject<string> = new Subject<string>();
  listUnit1$ = new Observable<any[]>();
  unitSearch1;
  notFoundText;
  debouncer1: Subject<string> = new Subject<string>();
  formValue: any[];

  isModalConfirmShow = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private toastService: ToastService,
    private translateService: TranslateService,
    public activeModal: NgbActiveModal,
    private organizationCategoriesService: OrganizationCategoriesService,
    // private organizationCategoriesComponent: OrganizationCategoriesComponent,
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
    this.getDataDropdown();
    // this.debounceOnSearch();
    this.debounceOnSearch1();
  }

  onSearchUnit(event) {
    this.unitSearch = event.term;
    const term = event.term;
    if (term !== "") {
      this.debouncer.next(term);
    } else {
      this.listUnit$ = of([]);
    }
  }

  // debounceOnSearch() {
  //   this.debouncer.pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH)).subscribe(value => this.loadDataOnSearchUnit(value));
  // }
  // loadDataOnSearchUnit(term) {
  //   this.organizationCategoriesService.getGroups(term).subscribe((res: HttpResponse<any[]>) => {
  //     if (this.unitSearch) {
  //       this.listUnit$ = of(res['content']);
  //     } else {
  //       this.listUnit$ = of([]);
  //     }
  //   });
  // }
  onClearUnit() {
    this.listUnit$ = of([]);
    this.unitSearch = "";
  }

  onSearchUnitClose() {
    if (!this.form.value.groupName) {
      this.listUnit$ = of([]);
      this.unitSearch = "";
    }
  }

  onSearchUnit1(event) {
    this.unitSearch1 = event.term;
    const term = event.term;
    if (term !== "") {
      this.debouncer1.next(term);
      this.notFoundText = "";
      $(".ng-option").css("display", "none");
    } else {
      this.listUnit1$ = of([]);
      $(".ng-option").css("display", "block");
    }
  }

  debounceOnSearch1() {
    this.debouncer1
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.loadDataOnSearchUnit1(value));
  }

  loadDataOnSearchUnit1(term) {
    this.unitSearch1 = term;
    if (this.type === "update") {
      this.organizationCategoriesService
        .getParentsUpdate({
          id: this.selectedData.id,
          parenName: term
        })
        .subscribe(
          res => {
            if (this.unitSearch1) {
              const dataRes = res.body.content;
              this.listUnit1$ = of(
                dataRes.sort((a, b) => a.parentName.localeCompare(b.parentName))
              );
              if (res.body.content.length === 0) {
                this.notFoundText = "common.select.notFoundText";
                $(".ng-option").css("display", "block");
              }
            } else {
              this.listUnit1$ = of([]);
            }
          }
          // this.parentOrganizationList = res.body.content;
        );
    } else {
      this.organizationCategoriesService
        .getParents(term)
        .subscribe((res: HttpResponse<any[]>) => {
          if (this.unitSearch1) {
            this.listUnit1$ = of(
              res["content"].sort((a, b) =>
                a.parentName.localeCompare(b.parentName)
              )
            );
            if (res["content"].length === 0)
              this.notFoundText = "common.select.notFoundText";
          } else {
            this.listUnit1$ = of([]);
          }
        });
    }
  }

  onClearUnit1() {
    this.listUnit1$ = of([]);
    this.unitSearch1 = "";
  }

  onSearchUnitClose1() {
    if (!this.form.value.parentName) {
      this.listUnit1$ = of([]);
      this.unitSearch1 = "";
    }
  }

  // checkFormValueChanges(formValue) {
  //   const formValueChange = CommonUtils.convertObjectToArray(formValue);
  //   this.formValue = CommonUtils.convertObjectToArray(this.selectedData);
  //   for (let i = 0; i < formValueChange.length; i++) {
  //     if (formValueChange[i] !== this.formValue[i]) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
  checkFormValueChanges(formValue) {
    if (this.type === "add") {
      if (
        formValue.code === "" &&
        formValue.dataCategoryId === null &&
        formValue.description === "" &&
        formValue.name === "" &&
        formValue.note === "" &&
        formValue.parentId === null
      ) {
        return false;
      }
    }

    if (this.type === "update") {
      if (
        formValue.code === this.selectedData.code &&
        formValue.dataCategoryId === this.selectedData.dataCategoryId &&
        formValue.description === this.selectedData.description &&
        formValue.name === this.selectedData.name &&
        formValue.note === this.selectedData.note &&
        formValue.parentId === this.selectedData.parentId
      ) {
        return false;
      }
    }
    return true;
  }

  checkUpdate(formValue) {
    if (this.type === "update") {
      if (
        formValue.code === this.selectedData.code &&
        formValue.dataCategoryId === this.selectedData.dataCategoryId &&
        formValue.description === this.selectedData.description &&
        formValue.name === this.selectedData.name &&
        formValue.note === this.selectedData.note &&
        formValue.parentId === this.selectedData.parentId
      ) {
        return false;
      }
    }
    return true;
  }

  getDataDropdown() {
    this.listUnit$ = of([]);
    this.listUnit$ = of([]);
    // this.organizationCategoriesService.getParents().subscribe(result => {
    //   this.parentOrganizationList = result.content;
    // });
    this.organizationCategoriesService.getGroups().subscribe(
      result => {
        if (result) {
          this.groupOrganizationList = result.content;
        } else {
          this.groupOrganizationList = [];
        }
      },
      err => {
        this.groupOrganizationList = [];
      }
    );
  }

  customSearchFn(term: string, item: any) {
    const replacedKey = term.replace(REGEX_PATTERN.SEARCH_DROPDOWN_LIST, "");
    const newRegEx = new RegExp(replacedKey, "gi");
    const purgedPosition = item.groupName.replace(
      REGEX_PATTERN.SEARCH_DROPDOWN_LIST,
      ""
    );
    return newRegEx.test(purgedPosition);
  }

  onClearPosition() {
    this.setValueToField("dataCategoryId", null);
    this.setValueToField("groupName", null);
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

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  save() {
    this.organizationCategoriesService.save(this.form.value).subscribe();
  }

  onSubmitData() {
    if (this.checkUpdate(this.form.value)) {
      // validate data
      if (this.form.invalid) {
        this.commonService.validateAllFormFields(this.form);
        return;
      }
      if (this.checkCode) {
        return;
      }
      this.commonService.trimSpaceFormValue(this.form);
      if (this.type === "update") {
        this.form.value.id = this.selectedData.id;
      }
      let data = this.form.value;
      if (this.type === "add") {
        data = omit(data, ["id"]);
      }
      this.spinner.show();
      this.organizationCategoriesService.save(data).subscribe(
        res => {
          this.spinner.hide();
          if (res) {
            this.type === "add"
              ? this.toastService.openSuccessToast(
                  "Thêm danh mục đơn vị thành công"
                )
              : this.toastService.openSuccessToast(
                  "Sửa danh mục đơn vị thành công"
                );
            this.eventManager.broadcast({
              name: "organizationChange"
            });

            // this.activeModal.dismiss(true);
            this.activeModal.close(false);
          } else {
            this.toastService.openErrorToast(
              this.translateService.instant("common.toastr.messages.error.save")
            );
          }
        },
        error => {
          this.spinner.hide();
          error.error.data
            ? this.toastService.openErrorToast(error.error.data)
            : this.toastService.openErrorToast(
                this.translateService.instant(
                  "common.toastr.messages.error.save"
                )
              );
        }
      );
      // // open popup update confirm
      // if (this.type === 'update') {
      //   const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true, backdrop: 'static' });
      //   modalRef.componentInstance.type = 'update';
      //   modalRef.componentInstance.param = this.translateService.instant('projectManagement.popup.this-value');
      //   modalRef.componentInstance.onCloseModal.subscribe(value => {
      //     if (value === true) {
      //       this.saveData(data);
      //     }
      //   });
      // }
      // // open popup create confirm
      // if (this.type === 'add') {
      //   const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true, backdrop: 'static' });
      //   modalRef.componentInstance.type = 'create';
      //   modalRef.componentInstance.param = this.translateService.instant('projectManagement.popup.this-value');
      //   modalRef.componentInstance.onCloseModal.subscribe(value => {
      //     if (value === true) {
      //       this.saveData(data);
      //     }
      //   });
      // }
    } else {
      this.activeModal.dismiss();
      this.form.reset();
      this.activeModal.dismiss(true);
    }
  }

  saveData(data) {
    this.spinner.show();
    this.organizationCategoriesService.save(data).subscribe(
      res => {
        this.spinner.hide();
        if (res) {
          this.type === "add"
            ? this.toastService.openSuccessToast(
                "Thêm danh mục đơn vị thành công"
              )
            : this.toastService.openSuccessToast(
                "Sửa danh mục đơn vị thành công"
              );
          this.eventManager.broadcast({
            name: "organizationChange"
          });

          // this.activeModal.dismiss(true);
          this.activeModal.close(false);
        } else {
          this.toastService.openErrorToast(
            this.translateService.instant("common.toastr.messages.error.save")
          );
        }
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

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  trimSpace(fieldName) {
    this.setValueToField(fieldName, this.getValueOfField(fieldName).trim());
    if ("code" === fieldName) {
      this.setErrorField(fieldName, REGEX_REPLACE_PATTERN.PARTNER_CODE);
    }
    if (this.getValueOfField(fieldName) !== "") {
      this.organizationCategoriesService
        .checkCodeAdd({
          code: this.getValueOfField(fieldName),
          id: this.type === "update" ? this.selectedData.id : ""
        })
        .subscribe(res => {
          this.checkCode = res.body;
        });
    }
  }

  displayFieldHasError(field: string) {
    return {
      "has-error": this.isFieldValid(field)
    };
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

  onChangePosition(event) {
    if (event) {
      this.setValueToField("parentId", event.id);
      this.setValueToField("parentName", event.name);
    }
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      code: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(20)])
      ],
      name: [
        "",
        Validators.compose([Validators.required, Validators.maxLength(250)])
      ],
      parentId: [null, Validators.required],
      dataCategoryId: [null, Validators.required],
      description: ["", Validators.maxLength(255)],
      note: ["", Validators.maxLength(255)]
    });
    if (this.selectedData) {
      this.form.patchValue(this.selectedData);
      // this.listUnit$ = of([this.selectedData]);
      //this.form.get('parentId').setValue(this.selectedData.parentName);
      this.loadDataOnSearchUnit1(this.selectedData.parentName);
    }
  }
}
