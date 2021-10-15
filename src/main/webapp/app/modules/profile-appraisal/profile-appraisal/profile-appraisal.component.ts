import { CommonUtils } from "./../../../shared/util/common-utils.service";
import { DownloadService } from "./../../../shared/services/download.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ProfileAppraisalService } from "../../../core/services/profile-appraisal/profile-appraisal.service";
import { AppParamModel } from "./../../../core/models/profile-management/app-param.model";
import { PofileManagementModel } from "app/core/models/profile-management/profile-management.model";
import { HeightService } from "./../../../shared/services/height.service";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "./../../../shared/constants/pagination.constants";
import { ToastService } from "./../../../shared/services/toast.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { REGEX_REPLACE_PATTERN } from "app/shared/constants/pattern.constants";
import { ConfirmModalComponent } from "app/shared/components/confirm-modal/confirm-modal.component";
import { STATUS_CODE } from "app/shared/constants/status-code.constants";
import { ImportExcelComponent } from "app/modules/profile-appraisal/profile-appraisal/import-excel/import-excel.component";
import { createNumberMask } from "text-mask-addons";
import { Subscription } from "rxjs";
import { JhiEventManager } from "ng-jhipster";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";
import { OrganizationCategoriesService } from "app/core/services/system-management/organization-categories.service";
import { HttpResponse } from "@angular/common/http";
import { ProfileAppraisalHistoryComponent } from "app/modules/profile-appraisal/profile-appraisal-history/profile-appraisal-history.component";

@Component({
  selector: "jhi-profile-appraisal",
  templateUrl: "./profile-appraisal.component.html",
  styleUrls: ["./profile-appraisal.component.scss"]
})
export class ProfileAppraisalComponent implements OnInit {
  @ViewChild("selectElement", { static: false }) selectElement: ElementRef;
  @ViewChild("buttonElement", { static: false }) buttonElement: ElementRef;

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
  groupPartnerList: AppParamModel[];
  partnerCategoryList: AppParamModel[];
  years: number[] = [];
  yy: number;
  searchForm: any;
  eventSubscriber: Subscription;
  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;
  listUsers: any[] = [];
  listOrganization: any[] = [];
  listStatus: any = [];

  columns = [
    {
      key: 0,
      value: this.translateService.instant(
        "profileAppraisal.profileAppraisalCode"
      ),
      isShow: true
    },
    {
      key: 1,
      value: this.translateService.instant("profileAppraisal.userRequest"),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant(
        "profileAppraisal.organizationRequest"
      ),
      isShow: true
    },
    {
      key: 3,
      value: this.translateService.instant("profileAppraisal.profileTitle"),
      isShow: true
    },
    {
      key: 4,
      value: this.translateService.instant("profileAppraisal.srCode"),
      isShow: true
    },
    {
      key: 5,
      value: this.translateService.instant("profileAppraisal.createDate"),
      isShow: true
    },
    {
      key: 6,
      value: this.translateService.instant("profileAppraisal.endDate"),
      isShow: true
    },
    {
      key: 7,
      value: this.translateService.instant("profileAppraisal.handler"),
      isShow: true
    },
    {
      key: 8,
      value: this.translateService.instant("profileAppraisal.status"),
      isShow: true
    }
  ];

  nonShowColumns: number[] = [25, 26, 27];

  currencyMasksScoreEvaluation = {
    prefix: "",
    suffix: "",
    includeThousandsSeparator: true,
    allowDecimal: true,
    decimalLimit: 2,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: true,
    integerLimit: 4,
    thousandsSeparatorSymbol: "",
    decimalSymbol: ","
  };

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
    private eventManager: JhiEventManager,
    private versionManagementService: VersionManagementService,
    private organizationCategoriesService: OrganizationCategoriesService
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
    this.searchHandle(false);
    this.onResize();
    this.getYear();
    this.setDecimal();
    this.registerChange();
    this.listStatus = [
      {
        id: 1,
        name: "Draft"
      },
      {
        id: 2,
        name: "New"
      },
      {
        id: 3,
        name: "Pending"
      },
      {
        id: 4,
        name: "Approve"
      }
      // , {
      //   id: 5,
      //   name: 'Close'
      // }, {
      //   id: 6,
      //   name: 'Rejected'
      // }
    ];
  }

  getStatus(status) {
    for (const element of this.listStatus) {
      if (element.id == status) {
        return element.name;
      }
    }
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
      userRequest: "",
      handler: "",
      organizationRequest: "",
      status: "",
      code: "",
      srCode: "",
      createDate: "",
      endDate: ""
    });
  }

  searchHandle(isShowFirst: boolean) {
    if (isShowFirst) {
      this.previousPage = 1;
      this.page = 1;
    }
    this.spinner.show();
    this.searchForm.userRequest = this.form.value.userRequest;
    this.searchForm.handler = this.form.value.handler;
    this.searchForm.organizationRequest = this.form.value.organizationRequest;
    this.searchForm.status = this.form.value.status;
    this.searchForm.code = this.form.value.code;
    this.searchForm.srCode = this.form.value.srCode;
    this.searchForm.createDate = this.form.value.createDate;
    this.searchForm.endDate = this.form.value.endDate;
    this.searchForm.page = this.page;
    this.searchForm.limit = this.itemsPerPage;
    this.profileAppraisalService.search(this.searchForm).subscribe(
      result => {
        this.paginatePofileManagement(result.data);
        this.totalItems = result.dataCount;
        this.spinner.hide();
      },
      () => {
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.load")
        );
        this.spinner.hide();
      }
    );
  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
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
    this.searchForm.partnerShortName = this.form.value.partnerShortName;
    this.searchForm.partnerName = this.form.value.partnerName;
    this.searchForm.contactPointName = this.form.value.contactPointName;
    this.searchForm.nameOfDirector = this.form.value.nameOfDirector;
    this.searchForm.devAmount = this.form.value.devAmount;
    this.searchForm.devMobileAmount = this.form.value.devMobileAmount;
    this.searchForm.testerAmount = this.form.value.testerAmount;
    this.searchForm.baAmount = this.form.value.baAmount;
    this.searchForm.foundedYear = this.form.value.foundedYear;
    this.searchForm.capacityScore = this.form.value.capacityScore;
    this.searchForm.page = this.page;
    this.searchForm.limit = this.itemsPerPage;

    this.searchHandle(false);
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.transition();
  }

  onSearchProfileManagement() {
    this.transition();
    //this.page = 0;
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
    if (selectedData === null) {
      selectedData = {};
    }
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
    } else if (type === "update") {
      this.profileAppraisalService
        .getProfileById(selectedData.id)
        .subscribe(res => {
          const dataSend = res.body;
          dataSend.type = "update";
          this.profileAppraisalService.changeProfile(dataSend);
          this.router.navigate(["/profile-appraisal-add"]);
        });
    } else if (type === "preview") {
      this.profileAppraisalService
        .getProfileById(selectedData.id)
        .subscribe(res => {
          const dataSend = res.body;
          dataSend.type = "preview";
          this.profileAppraisalService.changeProfile(dataSend);
          this.router.navigate(["/profile-appraisal-add"]);
        });
    } else {
      this.profileAppraisalService.changeProfile(selectedData);
      this.router.navigate(["/profile-appraisal-add"]);
    }
  }
  // onViewProfile(type?: string, selectedData?: any) {
  //
  //   this.profileAppraisalService.getProfileById(selectedData.id).subscribe(res => {
  //     const dataSend = res.body;
  //     dataSend.type = 'preview';
  //     this.profileAppraisalService.changeProfile(dataSend);
  //   });
  //   this.router.navigate(['/profile-add', selectedData.id]);
  // }

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
    this.spinner.hide();
    if (data.status !== 1) {
      this.toastService.openWarningToast(
        this.translateService.instant("profileAppraisal.existsData")
      );
      this.selectedData = "";
      this.transition();
    } else {
      const modalRef = this.modalService.open(ConfirmModalComponent, {
        centered: true,
        backdrop: "static"
      });
      modalRef.componentInstance.type = "delete";
      modalRef.componentInstance.param = this.translateService.instant(
        "profileAppraisal.profileAppraisal"
      );
      modalRef.componentInstance.onCloseModal.subscribe(value => {
        if (value === true) {
          this.onSubmitDelete();
        }
      });
    }
  }

  openModalHistory(selectedData?: any) {
    const modalRef = this.modalService.open(ProfileAppraisalHistoryComponent, {
      size: "lg",
      backdrop: "static",
      keyboard: false
    });
    modalRef.componentInstance.data = selectedData;
    modalRef.result.then(result => {}).catch(() => {});
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
                    "profileAppraisal.profileAppraisal"
                  )
                }
              )
            );
            this.buildForm();
            this.searchHandle(true);
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
  }
  //chỉ cho nhập số không cho nhập text
  onKeyInput(event, element) {
    const value = this.getValueOfField(element);
    let valueChange = event.target.value;
    if ("devAmount" === element) {
      valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.NUMBER, "");
    }
    if ("devMobileAmount" === element) {
      valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.NUMBER, "");
    }
    if ("testerAmount" === element) {
      valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.NUMBER, "");
    }
    if ("baAmount" === element) {
      valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.NUMBER, "");
    }
    if (value !== valueChange) {
      this.setValueToField(element, valueChange);
      return false;
    }
  }

  setDecimal() {
    this.currencyMasksScoreEvaluation = createNumberMask({
      ...this.currencyMasksScoreEvaluation
    });
  }

  trimSpace(element) {
    let value = this.getValueOfField(element);
    if ("partnerShortName" === element) {
      value = value.trim();
    }
    if ("partnerName" === element) {
      value = value.trim();
    }
    if ("contactPointName" === element) {
      value = value.trim();
    }
    if ("nameOfDirector" === element) {
      value = value.trim();
    }
    if (value) {
      this.setValueToField(element, value.trim());
    }
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }

  get formControl() {
    return this.form.controls;
  }

  registerChange() {
    this.eventSubscriber = this.eventManager.subscribe(
      "searchAllPartnerCapacityProf",
      response => this.searchHandle(true)
    );
  }

  searchUser(event) {
    if (event) {
      this.versionManagementService
        .getUserList(0, 50, event.term)
        .subscribe((res: HttpResponse<AppParamModel[]>) => {
          if (res) {
            this.listUsers = res.body["data"].map(i => {
              i.name = i.name + " - " + i.email;
              return i;
            });
          } else {
            this.listUsers = [];
          }
        });
    }
  }

  searchOrganization(event) {
    if (event) {
      this.organizationCategoriesService
        .getAllCodeOrName({
          name: event.term,
          type: ""
        })
        .subscribe(res => {
          if (res) {
            this.listOrganization = res.body["content"];
          } else {
            this.listOrganization = [];
          }
        });
    }
  }

  onClearUserRequest(type) {
    if (type === 1) {
      this.listUsers = [];
    }
  }

  onClearOrganization(type) {
    if (type === 1) {
      this.listOrganization = [];
    }
  }
}
