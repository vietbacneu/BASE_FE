import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HeightService } from "app/shared/services/height.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { PofileManagementModel } from "app/core/models/profile-management/profile-management.model";
import { AppParamModel } from "app/core/models/profile-management/app-param.model";
import { ProfileAppraisalService } from "app/core/services/profile-appraisal/profile-appraisal.service";
import { DownloadService } from "app/shared/services/download.service";
import { CommonUtils } from "app/shared/util/common-utils.service";
import { ImportExcelComponent } from "app/modules/profile-appraisal/profile-appraisal/import-excel/import-excel.component";
import { REGEX_REPLACE_PATTERN } from "app/shared/constants/pattern.constants";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { Observable, of, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";

@Component({
  selector: "jhi-partner-list",
  templateUrl: "./partner-list.component.html",
  styleUrls: ["./partner-list.component.scss"]
})
export class PartnerListComponent implements OnInit {
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
  selectedData: any;
  pofileManagementList: PofileManagementModel[];
  cityList: AppParamModel[];

  typeSearchPartner;
  debouncer: Subject<string> = new Subject<string>();
  notFoundText;

  partnerGroupList$ = new Observable<any[]>();
  partnerGroupSearch;
  partnerCatList$ = new Observable<any[]>();
  partnerCatSearch;

  years: number[] = [];
  yy: number;
  searchForm: any;

  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;

  columns = [
    {
      key: 0,
      value: this.translateService.instant("profileManagement.idPartner"),
      isShow: true
    },
    {
      key: 1,
      value: this.translateService.instant("profileManagement.partnerName"),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant(
        "profileManagement.partnerShortName"
      ),
      isShow: true
    },
    {
      key: 3,
      value: this.translateService.instant("profileManagement.foundedYear"),
      isShow: true
    },
    {
      key: 4,
      value: this.translateService.instant("profileManagement.groupPartner"),
      isShow: true
    },
    {
      key: 5,
      value: this.translateService.instant("profileManagement.partnerCategory"),
      isShow: true
    },
    {
      key: 6,
      value: this.translateService.instant(
        "profileManagement.registeredBusinessLines"
      ),
      isShow: true
    },
    {
      key: 7,
      value: this.translateService.instant(
        "profileManagement.registeredBusinessAddress"
      ),
      isShow: true
    }, // địa chỉ đăng ký kinh doanh
    {
      key: 8,
      value: this.translateService.instant("profileManagement.headQuarter"),
      isShow: true
    },
    {
      key: 9,
      value: this.translateService.instant("profileManagement.city"),
      isShow: true
    },
    {
      key: 10,
      value: this.translateService.instant("profileManagement.pointOfContact"),
      isShow: true,
      col: 4
    },
    {
      key: 11,
      value: this.translateService.instant(
        "profileManagement.currentProductionPersonnel"
      ),
      isShow: true,
      col: 5
    },
    {
      key: 12,
      value: this.translateService.instant(
        "profileManagement.nameCluesContact"
      ),
      isShow: true
    },
    {
      key: 13,
      value: this.translateService.instant("profileManagement.position"),
      isShow: true
    },
    {
      key: 14,
      value: this.translateService.instant("profileManagement.phoneNumber"),
      isShow: true
    },
    {
      key: 15,
      value: this.translateService.instant("profileManagement.email"),
      isShow: true
    },
    {
      key: 16,
      value: this.translateService.instant("profileManagement.total"),
      isShow: true
    },
    {
      key: 17,
      value: this.translateService.instant("profileManagement.ba"),
      isShow: true
    },
    {
      key: 18,
      value: this.translateService.instant("profileManagement.dev"),
      isShow: true
    },
    {
      key: 19,
      value: this.translateService.instant("profileManagement.devMobile"),
      isShow: true
    },
    {
      key: 20,
      value: this.translateService.instant("profileManagement.tester"),
      isShow: true
    },
    {
      key: 21,
      value: this.translateService.instant("profileManagement.note"),
      isShow: true
    }
  ];

  nonShowColumns: number[] = [10, 11];

  constructor(
    private modalService: NgbModal,
    private translateService: TranslateService,
    private router: Router,
    private profileAppraisalService: ProfileAppraisalService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private downloadService: DownloadService,
    private commonUtils: CommonUtils
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
    this.buildForm();
    this.searchHandle();
    this.onResize();
    this.loadCityList();
    this.getYear();
    this.debounceOnSearch();
  }

  getYear() {
    const todays = new Date();
    this.yy = todays.getFullYear();
    for (let i = this.yy; i >= 1970; i--) {
      this.years.push(i);
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      partnerCode: [""],
      partnerName: [""],
      partnerShortName: [""],
      foundedYear: [""],
      groupPartner: [null],
      partnerCategory: [null],
      city: [""],
      contactPointName: [""]
    });
  }

  searchHandle() {
    this.searchForm.partnerCode = this.form.value.partnerCode;
    this.searchForm.partnerName = this.form.value.partnerName;
    this.searchForm.partnerShortName = this.form.value.partnerShortName;
    this.searchForm.foundedYear = this.form.value.foundedYear;
    this.searchForm.groupPartner = this.form.value.groupPartner;
    this.searchForm.partnerCategory = this.form.value.partnerCategory;
    this.searchForm.city = this.form.value.city;
    this.searchForm.contactPointName = this.form.value.contactPointName;
    this.searchForm.page = this.page > 0 ? this.page - 1 : 0;
    this.searchForm.limit = this.itemsPerPage;

    this.profileAppraisalService.search(this.searchForm).subscribe(
      result => {
        this.paginatePofileManagement(result.data);
        this.totalItems = result.dataCount;
      },
      () => {
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.load")
        );
      }
    );
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  loadCityList() {
    // this.profileAppraisalService.getCityList().subscribe(
    //   res => {
    //     this.cityList = res.body;
    //   },
    //   error => {
    //     this.toastService.openErrorToast(this.translateService.instant('common.toastr.messages.error.load'));
    //   }
    // );
  }

  private paginatePofileManagement(data) {
    this.second = data.pageCount;
    this.totalItems = data.dataCount;
    this.pofileManagementList = data;
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.transition();
    }
  }

  transition() {
    const formValue = this.form.value;
    this.searchForm.partnerCode = this.form.value.partnerCode;
    this.searchForm.partnerName = this.form.value.partnerName;
    this.searchForm.partnerShortName = this.form.value.partnerShortName;
    this.searchForm.foundedYear = this.form.value.foundedYear;
    this.searchForm.groupPartner = this.form.value.groupPartner;
    this.searchForm.partnerCategory = this.form.value.partnerCategory;
    this.searchForm.contactPointName = this.form.value.contactPointName;
    this.searchForm.city = this.form.value.city;
    this.searchForm.page = this.page;
    this.searchForm.limit = this.itemsPerPage;

    this.searchHandle();
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.transition();
  }

  onSearchProfileManagement() {
    this.transition();
    this.page = 0;
  }

  checkShowColumns(index) {
    for (const key of this.nonShowColumns) {
      if (key === index) {
        return false;
      }
    }
    return true;
  }

  openModal(type?: string, selectedData?: any) {
    // thanhnb: update
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
    /**
     * huyenlt-23/06/2020
     * gui du lieu sang man update
     * start
     */
    this.profileAppraisalService
      .getProfileById(selectedData.id)
      .subscribe(res => {
        const dataSend = res.body;
        dataSend.type = "update";
        this.profileAppraisalService.changeProfile(dataSend);
      });
    /**
     *huyenlt-23/06/2020
     * gui du lieu sang man update
     * end
     */
    this.router.navigate(["/profile-add", selectedData.id]);
  }

  onViewProfile(type?: string, selectedData?: any) {
    this.profileAppraisalService
      .getProfileById(selectedData.id)
      .subscribe(res => {
        const dataSend = res.body;
        dataSend.type = "preview";
        this.profileAppraisalService.changeProfile(dataSend);
      });
    this.router.navigate(["/profile-add", selectedData.id]);
  }

  onCreate() {
    this.router.navigate(["/profile-add"]);
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }

  onKeyDown(event) {
    const key = event.key;
    const text = key.replace(REGEX_REPLACE_PATTERN.PARTNER_CODE, "");
    if (text.length === 0) {
      return false;
    }
  }

  onPasteValidate(element) {
    let value = this.getValueOfField(element).trim();
    value = value.replace(REGEX_REPLACE_PATTERN.COUNTRY_CODE, "");
    this.setValueToField(element, value);
  }

  onDelete(data) {
    this.selectedData = Number(data.id);
    this.profileAppraisalService
      .deleteProfileAppraisal({
        id: this.selectedData
      })
      .subscribe(res => {
        this.spinner.hide();
        if (res && res.body.status === STATUS_CODE.EXIST) {
          this.toastService.openWarningToast(
            this.translateService.instant("profileManagement.existsData")
          );
          this.selectedData = "";
          this.transition();
        } else if (res && res.body.status === STATUS_CODE.SUCCESS) {
          const modalRef = this.modalService.open(ConfirmModalComponent, {
            centered: true,
            backdrop: "static"
          });
          modalRef.componentInstance.type = "delete";
          modalRef.componentInstance.param = this.translateService.instant(
            "profileManagement.partnerProfile"
          );
          modalRef.componentInstance.onCloseModal.subscribe(value => {
            if (value === true) {
              this.onSubmitDelete();
            }
          });
        }
      });
  }

  onSubmitDelete() {
    this.spinner.show();
    this.profileAppraisalService
      .deleteProfileAppraisal({
        id: this.selectedData
      })
      .subscribe(
        res => {
          this.spinner.hide();
          if (res && res.body.status === STATUS_CODE.SUCCESS) {
            this.toastService.openSuccessToast(
              this.translateService.instant(
                "common.toastr.messages.success.delete",
                {
                  paramName: this.translateService.instant(
                    "profileManagement.partnerProfile"
                  )
                }
              )
            );
            this.buildForm();
            this.searchHandle();
            this.page = 0;
          } else {
            this.toastService.openErrorToast(
              this.translateService.instant(
                "common.toastr.messages.error.delete"
              )
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
    this.selectedData = "";
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;

    // if (col.key === 11 || col.key === 12 || col.key === 13 || col.key === 14) {
    //   this.columns[9].col = col.isShow === true ? this.columns[9].col + 1 : this.columns[9].col - 1;
    // }

    // if (col.key === 15 || col.key === 16 || col.key === 17 || col.key === 18) {
    //   this.columns[10].col = col.isShow === true ? this.columns[10].col + 1 : this.columns[10].col - 1;
    // }
    let col1 = 0;
    for (let i = 12; i <= 15; i++) {
      if (this.columns[i].isShow) {
        col1++;
      }
    }
    this.columns[10].col = col1;

    let col2 = 0;
    for (let i = 16; i <= 20; i++) {
      if (this.columns[i].isShow) {
        col2++;
      }
    }
    this.columns[11].col = col2;
  }

  onExport() {
    this.spinner.show();
    this.searchForm.partnerCode = this.form.value.partnerCode;
    this.searchForm.partnerName = this.form.value.partnerName;
    this.searchForm.partnerShortName = this.form.value.partnerShortName;
    this.searchForm.foundedYear = this.form.value.foundedYear;
    this.searchForm.groupPartner = this.form.value.groupPartner;
    this.searchForm.partnerCategory = this.form.value.partnerCategory;
    this.searchForm.city = this.form.value.city;
    this.searchForm.contactPointName = this.form.value.contactPointName;
    this.searchForm.page = this.page > 0 ? this.page - 1 : 0;
    this.searchForm.limit = this.itemsPerPage;

    this.profileAppraisalService.doExport(this.searchForm).subscribe(
      res => {
        this.spinner.hide();
        if (res) {
          this.downloadService.downloadFile(res);
        }
      },
      error => {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.load")
        );
      }
    );
  }

  onSearchPartnerGroup(event, type) {
    switch (type) {
      case 1: {
        this.partnerGroupSearch = event.term;
        break;
      }
      case 2: {
        this.partnerCatSearch = event.term;
        break;
      }
    }
    const term = event.term;
    this.typeSearchPartner = type;
    if (term !== "") {
      this.debouncer.next(term);
      this.notFoundText = "";
    } else {
      type === 1
        ? (this.partnerGroupList$ = of([]))
        : (this.partnerCatList$ = of([]));
    }
  }

  onClearPartnerGroup(type: number) {
    switch (type) {
      case 1: {
        this.partnerGroupList$ = of([]);
        this.partnerGroupSearch = "";
        break;
      }
      case 2: {
        this.partnerCatList$ = of([]);
        this.partnerCatSearch = "";
        break;
      }
    }
  }

  onSearchPartnerGroupClose(type) {
    if (!this.form.value.businessUnitId && type === 1) {
      this.partnerGroupList$ = of([]);
      this.partnerGroupSearch = "";
    }
    if (!this.form.value.productUnitId && type === 2) {
      this.partnerCatList$ = of([]);
      this.partnerCatSearch = "";
    }
  }

  debounceOnSearch() {
    this.debouncer
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.loadDataOnSearchPartner(value));
  }

  loadDataOnSearchPartner(term) {
    if (this.typeSearchPartner === 1) {
      // this.profileAppraisalService.getGroupParterList(term).subscribe((res: any) => {
      //   if (res) {
      //     this.partnerGroupList$ = of(res.body.sort((a, b) => a.name.localeCompare(b.name)));
      //     if (res.body.length === 0) this.notFoundText = 'common.select.notFoundText';
      //   }
      // });
    } else {
      // this.profileAppraisalService.getPartnerCategoryList(term).subscribe((res: any) => {
      //   if (res) {
      //     this.partnerCatList$ = of(res.body.sort((a, b) => a.name.localeCompare(b.name)));
      //     if (res.body.length === 0) this.notFoundText = 'common.select.notFoundText';
      //   }
      // });
    }
  }
}
