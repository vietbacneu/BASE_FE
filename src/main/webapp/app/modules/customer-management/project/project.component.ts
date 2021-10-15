import { Component, OnInit } from "@angular/core";
import { ProfileAppraisalService } from "app/core/services/profile-appraisal/profile-appraisal.service";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { OutsourcingInfomationReportService } from "app/core/services/report/outsourcing-infomation-report.service";
import { OutsourcingPlanStatisticService } from "app/core/services/report/outsourcing-plan-statistic.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastService } from "app/shared/services/toast.service";
import { TranslateService } from "@ngx-translate/core";
import { DownloadService } from "app/shared/services/download.service";
import { Observable, of, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { TIME_OUT } from "app/shared/constants/set-timeout.constants";
import { ITEMS_PER_PAGE } from "app/shared/constants/pagination.constants";
import { HttpResponse } from "@angular/common/http";
import { REGEX_REPLACE_PATTERN } from "app/shared/constants/pattern.constants";

@Component({
  selector: "jhi-project",
  templateUrl: "./project.component.html",
  styleUrls: ["./project.component.scss"]
})
export class ProjectComponent implements OnInit {
  listContractStatus;
  form: FormGroup;
  projectList: any;

  listBusinessUnit$ = new Observable<any[]>();
  bUnitSearch;
  listProductUnit$ = new Observable<any[]>();
  pUnitSearch;

  debouncer: Subject<string> = new Subject<string>();
  debouncerUser: Subject<string> = new Subject<string>();

  pmSearch;
  amSearch;
  listPm$ = new Observable<any[]>();
  listAm$ = new Observable<any[]>();
  typeSearchUnit;
  typeSearchUser;

  itemsPerPage = 10;
  page = 1;
  totalItems = 0;
  maxSizePage = 10;
  previousPage: any;

  constructor(
    private formBuilder: FormBuilder,
    private profileAppraisalService: ProfileAppraisalService,
    private apparamService: AppParamsService,
    private reportService: OutsourcingInfomationReportService,
    private outsourcingPlanStatisticService: OutsourcingPlanStatisticService,
    private spinner: NgxSpinnerService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private downloadService: DownloadService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.getContractStatus();
    this.debounceOnSearch();
    this.search();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      totalApprasedMM: [""],
      manufacturingOrgId: [""],
      businessOrgId: [""],
      pm: [""],
      am: [""],
      contractStatus: [""]
    });
  }

  getContractStatus() {
    this.apparamService.getParamByCode("TTHD").subscribe(res => {
      if (res) {
        this.listContractStatus = res.body;
      }
    });
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
    this.search();
  }

  search() {
    this.spinner.show();
    const data = {
      totalApprasedMM: this.form.value.totalApprasedMM
        ? this.form.value.totalApprasedMM
        : "",
      contractStatus: this.form.value.contractStatus
        ? this.form.value.contractStatus
        : "",
      am: this.form.value.am ? this.form.value.am : "",
      pm: this.form.value.pm ? this.form.value.pm : "",
      businessOrgId: this.form.value.businessOrgId
        ? this.form.value.businessOrgId
        : "",
      manufacturingOrgId: this.form.value.manufacturingOrgId
        ? this.form.value.manufacturingOrgId
        : "",
      page: this.page - 1,
      size: this.itemsPerPage
    };

    this.reportService.searchProject(data).subscribe(
      res => {
        this.spinner.hide();
        this.projectList = res.body.content;
        this.totalItems = res.body.totalElements;
        this.maxSizePage = res.body.totalPages;
      },
      error => {
        this.spinner.hide();
        this.toastService.openErrorToast(
          this.translateService.instant("common.toastr.messages.error.load")
        );
      }
    );
  }

  onExport() {
    this.spinner.show();
    const data = {
      totalApprasedMM: this.form.value.totalApprasedMM
        ? this.form.value.totalApprasedMM
        : "",
      contractStatus: this.form.value.contractStatus
        ? this.form.value.contractStatus
        : "",
      am: this.form.value.am ? this.form.value.am : "",
      pm: this.form.value.pm ? this.form.value.pm : "",
      businessOrgId: this.form.value.businessOrgId
        ? this.form.value.businessOrgId
        : "",
      manufacturingOrgId: this.form.value.manufacturingOrgId
        ? this.form.value.manufacturingOrgId
        : ""
    };
    this.reportService.exportExcelProject(data).subscribe(
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

  onSearchUser(event, type) {
    switch (type) {
      case 1: {
        this.pmSearch = event.term;
        break;
      }
      case 2: {
        this.amSearch = event.term;
        break;
      }
    }
    const term = event.term;
    this.typeSearchUser = type;
    if (term !== "") {
      this.debouncerUser.next(term);
    } else {
      type === 1
        ? (this.listProductUnit$ = of([]))
        : (this.listBusinessUnit$ = of([]));
    }
  }

  loadDataOnSearchUser(term) {
    //
    this.reportService
      .searchUserByName({
        text: term,
        limit: 10
      })
      .subscribe(res => {
        if (res) {
          this.typeSearchUser === 1
            ? (this.listPm$ = of(
                res.body.sort((a, b) => a.name.localeCompare(b.name))
              ))
            : (this.listAm$ = of(
                res.body.sort((a, b) => a.name.localeCompare(b.name))
              ));
        } else {
          this.typeSearchUser === 1
            ? (this.listPm$ = of([]))
            : (this.listAm$ = of([]));
        }
      });
  }

  onSearchUserClose(type) {
    if (!this.form.value.pm && type === 1) {
      this.listPm$ = of([]);
      this.pmSearch = "";
    }
    if (!this.form.value.am && type === 2) {
      this.listAm$ = of([]);
      this.amSearch = "";
    }
  }

  debounceOnSearch() {
    this.debouncer
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => this.loadDataOnSearchUnit(value));
    this.debouncerUser
      .pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH))
      .subscribe(value => {
        this.loadDataOnSearchUser(value);
      });
  }

  loadDataOnSearchUnit(term) {
    this.outsourcingPlanStatisticService
      .getUnit({
        name: term,
        pageSize: ITEMS_PER_PAGE,
        page: 0
      })
      .subscribe((res: HttpResponse<any[]>) => {
        if (res) {
          this.typeSearchUnit === 1
            ? (this.listProductUnit$ = of(
                res.body["data"].sort((a, b) => a.name.localeCompare(b.name))
              ))
            : (this.listBusinessUnit$ = of(
                res.body["data"].sort((a, b) => a.name.localeCompare(b.name))
              ));
        } else {
          this.typeSearchUnit === 1
            ? (this.listProductUnit$ = of([]))
            : (this.listBusinessUnit$ = of([]));
        }
      });
  }

  onSearchUnit(event, type) {
    switch (type) {
      case 1: {
        this.pUnitSearch = event.term;
        break;
      }
      case 2: {
        this.bUnitSearch = event.term;
        break;
      }
    }
    // type === 1 ? (this.pUnitSearch = event.term) : (this.bUnitSearch = event.term);
    const term = event.term;
    this.typeSearchUnit = type;
    if (term !== "") {
      this.debouncer.next(term);
    } else {
      type === 1
        ? (this.listProductUnit$ = of([]))
        : (this.listBusinessUnit$ = of([]));
    }
  }

  onClearUnit(type: number) {
    switch (type) {
      case 1: {
        this.listProductUnit$ = of([]);
        this.pUnitSearch = "";
        break;
      }
      case 2: {
        this.listBusinessUnit$ = of([]);
        this.bUnitSearch = "";
        break;
      }
    }
  }

  onSearchUnitClose(type) {
    if (!this.form.value.businessUnitId && type === 2) {
      this.listBusinessUnit$ = of([]);
      this.bUnitSearch = "";
    }
    if (!this.form.value.productUnitId && type === 1) {
      this.listProductUnit$ = of([]);
      this.pUnitSearch = "";
    }
  }

  onClearUser(type) {
    switch (type) {
      case 1: {
        this.listPm$ = of([]);
        this.pmSearch = "";
        break;
      }
      case 2: {
        this.listAm$ = of([]);
        this.amSearch = "";
        break;
      }
    }
  }

  onKeyInput(event, element) {
    const value = this.getValueOfField(element);
    let valueChange = event.target.value;
    valueChange = valueChange.replace(REGEX_REPLACE_PATTERN.NUMBER, "");
    if (value !== valueChange) {
      this.setValueToField(element, valueChange);
      return false;
    }
  }

  trimSpace(fieldName) {
    this.setValueToField(fieldName, this.getValueOfField(fieldName).trim());
  }

  setValueToField(item, data) {
    this.form.get(item).setValue(data);
  }

  getValueOfField(item) {
    return this.form.get(item).value;
  }
}
