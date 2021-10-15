import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { ActivatedRoute } from "@angular/router";
import { HeightService } from "app/shared/services/height.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OrganizationCategoriesAddComponent } from "app/modules/system-categories/organization-categories/organization-categories-add/organization-categories-add.component";
import { InvoiceSerialModel } from "app/core/models/announcement-management/invoice-serial.model";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { OrganizationCategoriesService } from "app/core/services/system-management/organization-categories.service";
import { OrganizationCategoriesModel } from "app/core/models/system-categories/organization-categories.model";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpClientModule,
  HttpResponse
} from "@angular/common/http";
import { BehaviorSubject, Observable, of, Subject, Subscription } from "rxjs";
import { JhiEventManager } from "ng-jhipster";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { ToastService } from "app/shared/services/toast.service";
import { REGEX_PATTERN } from "app/shared/constants/pattern.constants";
import { ImportExcelComponent } from "app/modules/system-categories/import-excel/import-excel.component";
import { ImportExcelOutsourcingPlanComponent } from "app/modules/outsourcing-plan/import-excel-outsourcing-plan/import-excel-outsourcing-plan.component";

@Component({
  selector: "jhi-organization-categories",
  templateUrl: "./organization-categories.component.html",
  styleUrls: ["./organization-categories.component.scss"]
})
export class OrganizationCategoriesComponent implements OnInit {
  @Input() public selectedData: InvoiceSerialModel;
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
  checkDelete = false;
  listId: any[];
  listA: any[];
  listUnit$ = new Observable<any[]>();
  parentOrganizationList = new Observable<any[]>();
  // groupOrganizationList = new Observable<any[]>();
  groupOrganizationList: any[] = [];
  unitSearch;
  debouncer: Subject<string> = new Subject<string>();
  listUnit1$ = new Observable<any[]>();
  unitSearch1;
  notFoundText;
  debouncer1: Subject<string> = new Subject<string>();
  searchForm: any;
  eventSubscriber: Subscription;
  organizationCategoriesModel: OrganizationCategoriesModel[];
  organizationList: any[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private organizationCategoriesService: OrganizationCategoriesService,
    private eventManager: JhiEventManager,
    private _http: HttpClient
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
    this.searchForm = {};
    this.buidForm();
    this.onResize();
    this.searchHandle();
    this.registerChange();
    // this.debounceOnSearch();
    this.debounceOnSearch1();
    this.getDataDropdown();
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
    this.organizationCategoriesService
      .getParents(term)
      .subscribe((res: HttpResponse<any[]>) => {
        if (this.unitSearch1) {
          this.listUnit1$ = of(
            res["content"].sort((a, b) =>
              a.parentName.localeCompare(b.parentName)
            )
          );
          if (res["content"].length === 0) {
            this.notFoundText = "common.select.notFoundText";
            $(".ng-option").css("display", "block");
          }
        } else {
          this.listUnit1$ = of([]);
        }
      });
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

  searchHandle() {
    this.page = this.page - 1;
    this.organizationCategoriesService
      .search(this.searchForm)
      .subscribe(result => {
        this.organizationCategoriesModel = result.data;
        this.totalItems = result.dataCount;
      });
  }

  getDataDropdown() {
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

  doSearch() {
    this.searchForm.code = this.form.value.code;
    this.searchForm.name = this.form.value.name;
    this.searchForm.parentId = this.form.value.parent;
    this.searchForm.organizationGroup = this.form.value.groupOrganization;
    this.searchForm.page = this.page;
    this.searchForm.pageSize = this.itemsPerPage;

    this.organizationCategoriesService
      .search(this.searchForm)
      .subscribe(response => {
        this.organizationCategoriesModel = response.data;
        this.totalItems = response.dataCount;
      });
  }

  openModal(type?: string, selectedData?: any) {
    if (type === "add" || type === "update") {
      const modalRef = this.modalService.open(
        OrganizationCategoriesAddComponent,
        {
          size: "lg",
          backdrop: "static",
          keyboard: false
        }
      );
      modalRef.componentInstance.type = type;
      modalRef.componentInstance.selectedData = selectedData;
      modalRef.result
        .then(result => {
          if (!result) {
            this.page = 0;
            this.doSearch();
          }
        })
        .catch(() => {
          `1`;
        });
    }
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

  onChangePosition(event) {
    if (event) {
      this.setValueToField("dataCategoryId", event.dataCategoryId);
      this.setValueToField("groupName", event.groupName);
    }
  }

  onClearPosition() {
    this.setValueToField("dataCategoryId", null);
    this.setValueToField("groupName", null);
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  onDelete(data) {
    this.listId = [Number(data.id)];
    this.organizationCategoriesService
      .checkDelete(data.id)
      .subscribe(result => {
        if (result) {
          this.toastService.openWarningToast(
            "Dữ liệu đã được sử dụng, không được phép xóa"
          );
        } else {
          const modalRef = this.modalService.open(ConfirmModalComponent, {
            centered: true,
            backdrop: "static"
          });
          modalRef.componentInstance.type = "delete";
          modalRef.componentInstance.param = this.translateService.instant(
            "organizationCategories.organizationConfirtm"
          );
          modalRef.componentInstance.onCloseModal.subscribe(value => {
            if (value === true) {
              this.onSubmitDelete(data.id);
            }
          });
        }
      });
  }

  onSubmitDelete(id: number) {
    this.organizationCategoriesService.delete(id).subscribe(result => {
      // this.fetchData();
      this.page = 0;
      this.doSearch();
      this.toastService.openSuccessToast("Xóa dữ liệu thành công!");
    });
  }

  fetchData() {
    this.organizationCategoriesService
      .search(this.searchForm)
      .subscribe(result => {
        this.organizationCategoriesModel = result.data;
        this.totalItems = result.dataCount;
      });
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
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
    this.doSearch();
  }
  registerChange() {
    this.eventSubscriber = this.eventManager.subscribe(
      "organizationChange",
      response => this.searchHandle()
    );
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
      parent: [null],
      groupOrganization: [null]
    });
  }
}
