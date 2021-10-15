import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { HeightService } from "app/shared/services/height.service";
import { TranslateService } from "@ngx-translate/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { DataCategoryModel } from "app/modules/system-categories/data-categories/models/DataCategory.model";
import { DataCategoryService } from "app/modules/system-categories/data-categories/services/data-category.service";
import { CreateDataCategoryComponent } from "app/modules/system-categories/data-categories/create-data-category/create-data-category.component";
import { DataCategoryTypeModel } from "app/modules/system-categories/data-categories/models/DataCategoryType.model";
import { CustomValidationService } from "app/modules/system-categories/data-categories/services/custom-validation.service";
import * as moment from "moment";
import { ImportExcelComponent } from "app/modules/system-categories/import-excel/import-excel.component";
import { ToastService } from "app/shared/services/toast.service";
import { Subscription } from "rxjs";
import { JhiEventManager } from "ng-jhipster";
import { NgxSpinnerService } from "ngx-spinner";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";

@Component({
  selector: "jhi-data-categories",
  templateUrl: "./data-categories.component.html",
  styleUrls: ["./data-categories.component.scss"]
})
export class DataCategoriesComponent implements OnInit {
  @Input() public selectedData: DataCategoryModel;
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
  dataCategoriesType: DataCategoryTypeModel[];
  dataCategories: DataCategoryModel[];
  searchData: any;
  paramType = "DL";
  isValidToDelete: any;
  private eventSubscriber: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private heightService: HeightService,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dataCategoryService: DataCategoryService,
    private toastService: ToastService,
    private eventManager: JhiEventManager,
    private spinner: NgxSpinnerService
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
    //lan dau load -> search all
    this.searchData = {};
    this.buidForm();
    this.onResize();
    this.doSearch(true);
    this.dataCategoryService.currentDataCategory.subscribe(result => {
      this.dataCategories = result;
    });
    // this.fetchCategoriesType();
    this.registerChange();
  }

  onDelete(data) {
    //TODO: check nếu được xóa thì hệ popup xóa, còn không thì hiện thị popup k được xóa
    this.dataCategoryService.checkUsed(data).subscribe(
      res => {
        console.warn(res);
        if (res.body.statusCode === "DATA_CATEGORY_USED") {
          this.toastService.openErrorToast(
            this.translateService.instant(
              "dataCategories.validation.action.delete"
            )
          );
        }
        if (res.body.statusCode === "DATA_CATEGORY_NOT_USED") {
          const modalRef = this.modalService.open(ConfirmModalComponent, {
            centered: true,
            backdrop: "static"
          });
          modalRef.componentInstance.type = "delete";
          modalRef.componentInstance.param = this.translateService.instant(
            "dataCategories.action.delete"
          );
          modalRef.componentInstance.onCloseModal.subscribe(value => {
            if (value === true) {
              this.onSubmitDelete(data);
            }
          });
        }
      },
      error => {
        this.toastService.openErrorToast(
          this.translateService.instant(
            "dataCategories.toastr.messages.error.delete"
          )
        );
      }
    );
  }

  onSubmitDelete(id: number) {
    this.dataCategoryService.delete(id).subscribe(
      res => {
        // after delete -> fetchAll data
        if (res.body.statusCode === "SUCCESS") {
          this.spinner.hide();
          this.toastService.openSuccessToast(
            this.translateService.instant(
              "dataCategories.toastr.messages.success.delete"
            )
          );
          this.doSearch(true);
        }
      },
      error => {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant(
            "dataCategories.toastr.messages.error.delete"
          )
        );
      }
    );
  }

  openModal(type?: string, selectedData?: any) {
    if (type === "import") {
      const modalRef = this.modalService.open(ImportExcelComponent, {
        size: "lg",
        windowClass: "modal-import",
        backdrop: "static",
        keyboard: false
      });
      modalRef.componentInstance.type = type;
      modalRef.componentInstance.selectedData = selectedData;
      modalRef.result.then(result => {}).catch(() => {});
    }
    if (type === "add" || type === "update") {
      const modalRef = this.modalService.open(CreateDataCategoryComponent, {
        size: "lg",
        backdrop: "static",
        keyboard: false
      });
      modalRef.componentInstance.type = type;
      modalRef.componentInstance.selectedData = selectedData;
      modalRef.result.then(result => {}).catch(() => {});
    }
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  private buidForm() {
    this.form = this.formBuilder.group({
      code: [""],
      name: [""],
      type: [""]
    });
  }

  fetchCategoriesType() {
    this.dataCategoryService
      .fetchAllDataCategoryType(this.paramType)
      .subscribe(data => {
        this.dataCategoriesType = data;
      });
  }

  doSearch(isShowFirst: boolean) {
    this.spinner.show();

    // set show first page
    if (isShowFirst) {
      this.previousPage = 1;
      this.page = 1;
    }

    this.searchData.code = this.form.value.code;
    this.searchData.name = this.form.value.name;
    this.searchData.originType = this.form.value.type;
    this.searchData.page = this.page;
    this.searchData.limit = this.itemsPerPage;
    this.dataCategoryService.fetchAll(this.searchData).subscribe(
      response => {
        this.spinner.hide();
        this.dataCategories = response.data;
        this.totalItems = response.dataCount;
      },
      error => {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.load")
        );
      }
    );
  }

  loadPage(page: any) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    const formValue = this.form.value;
    this.doSearch(false);
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.transition();
  }

  registerChange() {
    this.eventSubscriber = this.eventManager.subscribe(
      "dataCategoryChangeList",
      response => this.doSearch(true)
    );
  }
}
