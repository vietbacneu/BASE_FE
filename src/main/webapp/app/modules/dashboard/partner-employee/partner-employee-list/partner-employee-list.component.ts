import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HeightService } from "app/shared/services/height.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SHOW_HIDE_COL_HEIGHT } from "app/shared/constants/perfect-scroll-height.constants";
import { TranslateService } from "@ngx-translate/core";
import {
  ITEMS_PER_PAGE,
  MAX_SIZE_PAGE
} from "app/shared/constants/pagination.constants";
import { ActivatedRoute } from "@angular/router";
import { ProfileAppraisalService } from "app/core/services/profile-appraisal/profile-appraisal.service";
import { ToastService } from "app/shared/services/toast.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CommonService } from "app/shared/services/common.service";
import { HttpResponse } from "@angular/common/http";
import { EmployeeOfPartnerModel } from "app/core/models/outsourcing-plan/employee-of-partner.model";
import { REGEX_REPLACE_PATTERN } from "app/shared/constants/pattern.constants";

@Component({
  selector: "jhi-partner-employee-list",
  templateUrl: "./partner-employee-list.component.html",
  styleUrls: ["./partner-employee-list.component.scss"]
})
export class PartnerEmployeeListComponent implements OnInit {
  height: number;
  form: FormGroup;
  SHOW_HIDE_COL_HEIGHT = SHOW_HIDE_COL_HEIGHT;
  columns = [
    {
      key: 0,
      value: this.translateService.instant(
        "profileManagement.partnerShortName"
      ),
      isShow: true
    },
    {
      key: 1,
      value: this.translateService.instant("profileManagement.partnerName"),
      isShow: true
    },
    {
      key: 2,
      value: this.translateService.instant("profileManagement.foundedYear"),
      isShow: true
    },
    {
      key: 3,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.nameCluesContact"
      ),
      isShow: true
    },
    {
      key: 4,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.phoneNumberCluesContact"
      ),
      isShow: true
    },
    {
      key: 5,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.fullNameManager"
      ),
      isShow: true
    },
    {
      key: 6,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.phoneNumberManager"
      ),
      isShow: true
    },
    {
      key: 7,
      value: this.translateService.instant("profileManagement.employeeSum"),
      isShow: true
    },

    {
      key: 8,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.totalBA"
      ),
      isShow: true
    },
    {
      key: 9,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.expertBA"
      ),
      isShow: true
    },
    {
      key: 10,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.experienceBA"
      ),
      isShow: true
    },
    {
      key: 11,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.basicBA"
      ),
      isShow: true
    },

    {
      key: 12,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.totalDev"
      ),
      isShow: true
    },
    {
      key: 13,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.expertDev"
      ),
      isShow: true
    },
    {
      key: 14,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.experienceDev"
      ),
      isShow: true
    },
    {
      key: 15,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.basicDev"
      ),
      isShow: true
    },

    {
      key: 16,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.totalDevMobile"
      ),
      isShow: true
    },
    {
      key: 17,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.expertDevMobile"
      ),
      isShow: true
    },
    {
      key: 18,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.experienceDevMobile"
      ),
      isShow: true
    },
    {
      key: 19,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.basicDevMobile"
      ),
      isShow: true
    },

    {
      key: 20,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.totalTester"
      ),
      isShow: true
    },
    {
      key: 21,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.expertTester"
      ),
      isShow: true
    },
    {
      key: 22,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.experienceTester"
      ),
      isShow: true
    },
    {
      key: 23,
      value: this.translateService.instant(
        "totalPersonnelVts.dashboard.column.basicTester"
      ),
      isShow: true
    },

    {
      key: 24,
      value: this.translateService.instant("totalPersonnelVts.pointOfContact"),
      isShow: true,
      col: 2
    },
    {
      key: 25,
      value: this.translateService.instant("totalPersonnelVts.director"),
      isShow: true,
      col: 2
    },
    {
      key: 26,
      value: this.translateService.instant("totalPersonnelVts.ba"),
      isShow: true,
      col: 4
    },
    {
      key: 27,
      value: this.translateService.instant("totalPersonnelVts.dev"),
      isShow: true,
      col: 4
    },
    {
      key: 28,
      value: this.translateService.instant("totalPersonnelVts.devMobile"),
      isShow: true,
      col: 4
    },
    {
      key: 29,
      value: this.translateService.instant("totalPersonnelVts.tester"),
      isShow: true,
      col: 4
    }
  ];
  nonShowColumns: number[] = [24, 25, 26, 27, 28, 29];
  predicate: any;
  reverse: any;
  itemsPerPage: any;
  maxSizePage: any;
  routeData: any;
  page: any;
  second: any;
  totalItems: any;
  previousPage: any;
  searchForm: any;
  employeeOfPartnerList: EmployeeOfPartnerModel[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private heightService: HeightService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private profileAppraisalService: ProfileAppraisalService,
    private toastService: ToastService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService
  ) {
    this.itemsPerPage = 5;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.page = 1;
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadAll();
    this.onResize();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      partnerShortName: [""],
      employeeSum: [""],
      devAmount: [""],
      devMobileAmount: [""],
      testerAmount: [""],
      baAmount: [""]
    });
  }

  onResize() {
    this.height = this.heightService.onResizeTab();
  }

  onCloseAddModal() {
    this.activeModal.dismiss();
  }

  checkShowColumns(index) {
    for (const key of this.nonShowColumns) {
      if (key === index) {
        return false;
      }
    }
    return true;
  }

  toggleColumns(col) {
    col.isShow = !col.isShow;
    if (col.key === 3 || col.key === 4) {
      this.columns[24].col =
        col.isShow === true
          ? this.columns[24].col + 1
          : this.columns[24].col - 1;
    }

    if (col.key === 5 || col.key === 6) {
      this.columns[25].col =
        col.isShow === true
          ? this.columns[25].col + 1
          : this.columns[25].col - 1;
    }

    if (col.key === 8 || col.key === 9 || col.key === 10 || col.key === 11) {
      this.columns[26].col =
        col.isShow === true
          ? this.columns[26].col + 1
          : this.columns[26].col - 1;
    }

    if (col.key === 12 || col.key === 13 || col.key === 14 || col.key === 15) {
      this.columns[27].col =
        col.isShow === true
          ? this.columns[27].col + 1
          : this.columns[27].col - 1;
    }

    if (col.key === 16 || col.key === 17 || col.key === 18 || col.key === 19) {
      this.columns[28].col =
        col.isShow === true
          ? this.columns[28].col + 1
          : this.columns[28].col - 1;
    }

    if (col.key === 20 || col.key === 21 || col.key === 22 || col.key === 23) {
      this.columns[29].col =
        col.isShow === true
          ? this.columns[29].col + 1
          : this.columns[29].col - 1;
    }
  }

  loadAll() {
    const formValue = this.form.value;
    this.profileAppraisalService
      .getEmployeeOfPartner({
        page: this.page - 1,
        size: this.itemsPerPage,
        partnerShortName:
          formValue.partnerShortName === "" ? "" : formValue.partnerShortName,
        employeeSum: formValue.employeeSum === "" ? "" : formValue.employeeSum,
        devAmount: formValue.devAmount === "" ? "" : formValue.devAmount,
        devMobileAmount:
          formValue.devMobileAmount === "" ? "" : formValue.devMobileAmount,
        testerAmount:
          formValue.testerAmount === "" ? "" : formValue.testerAmount,
        baAmount: formValue.baAmount === "" ? "" : formValue.baAmount
      })
      .subscribe(
        (res: HttpResponse<EmployeeOfPartnerModel[]>) => {
          this.paginateEmployeeOfPartner(res);
        },
        err => {
          this.commonService.openToastMess(
            err.error.code,
            true,
            this.translateService.instant("common.action.search")
          );
        }
      );
  }

  paginateEmployeeOfPartner(data) {
    this.second = data.body.totalPages;
    this.totalItems = data.body.totalElements;
    this.employeeOfPartnerList = data.body["content"];
  }

  loadPage(page: number) {
    if (page !== this.previousPage) {
      this.previousPage = page;
      this.loadAll();
    }
  }

  doSearch() {
    this.page = 1;
    this.loadAll();
  }

  changePageSize(size) {
    this.itemsPerPage = size;
    this.loadAll();
  }

  trimSpace(element) {
    const value = this.getValueOfField(element);
    if (value) {
      this.setValueToField(element, value.trim());
    }
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  onKeyInput(event, element) {
    const value = this.getValueOfField(element);
    let valueChange = event.target.value;

    if (
      "employeeSum" === element ||
      "baAmount" === element ||
      "devAmount" === element ||
      "devMobileAmount" === element ||
      "testerAmount" === element
    ) {
      const parseStr = valueChange.split("");
      if (parseStr[0] === "0") {
        valueChange = valueChange.replace("0", "");
      } else {
        valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.INTEGER, "");
      }
    }

    if (value !== valueChange) {
      this.setValueToField(element, valueChange);
      return false;
    }
  }
}
