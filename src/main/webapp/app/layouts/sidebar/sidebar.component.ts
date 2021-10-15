import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from "@angular/core";
import { Router } from "@angular/router";
import { JhiLanguageService } from "ng-jhipster";
import { SessionStorageService } from "ngx-webstorage";

import { VERSION } from "app/app.constants";
import { ProfileService } from "app/layouts/profiles/profile.service";
import { JhiLanguageHelper } from "app/core/language/language.helper";
import { FormStoringService } from "app/shared/services/form-storing.service";
import { TranslateService } from "@ngx-translate/core";
import { ToastService } from "app/shared/services/toast.service";
import { CommonApiService } from "app/core/services/common-api/common-api.service";
import { MENU_TITLE } from "app/shared/constants/sidebar-menu.constants";
import { STORAGE_KEYS } from "app/shared/constants/storage-keys.constants";
import { STATUS } from "app/shared/constants/app-params.constants";
import { VersionManagementService } from "app/core/services/version-management/version-management.service";

@Component({
  selector: "jhi-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit, AfterViewInit {
  inProduction: boolean;
  isNavbarCollapsed: boolean;
  languages: any[];
  swaggerEnabled: boolean;
  version: string;
  currentUser;
  hasPermission = false;

  systemManagements: any[] = [];
  categories: any[] = [];
  announcementManagements: any[] = [];
  invoiceManagements: any[] = [];
  reports: any[] = [];
  utilities: any[] = [];

  systemCategories_ = [
    {
      name: MENU_TITLE.SYSTEM_MANAGEMENT.ORGANIZATION_CATEGORIES,
      url: "/system-categories/organization-categories",
      class: "fa-cog",
      resourceCode: "DMDV"
    },
    {
      name: MENU_TITLE.SYSTEM_MANAGEMENT.SYS_USER,
      url: "/system-categories/sys-user",
      class: "fa-user",
      resourceCode: "DMND"
    },
    {
      name: MENU_TITLE.SYSTEM_MANAGEMENT.GROUP_USER_CATEGORIES,
      url: "/system-categories/user-group-categories",
      class: "fa-users",
      resourceCode: "DMNND"
    },
    {
      name: MENU_TITLE.SYSTEM_MANAGEMENT.DATA_CATEGORIES,
      url: "/system-categories/data-categories",
      class: "fa-database",
      resourceCode: "DMDL"
    }
  ];

  function_management = {
    name: MENU_TITLE.FUNCTION_MANAGEMENT.FUNCTION_MANAGEMENT,
    url: "/function-management",
    class: "fa-cog",
    resourceCode: "QLCN"
  };

  non_function_management = {
    name: MENU_TITLE.NON_FUNCTION_MANAGEMENT.NON_FUNCTION_MANAGEMENT,
    url: "/non-function-management",
    class: "fa-cog",
    resourceCode: "QLPCN"
  };

  report = [
    {
      name: MENU_TITLE.REPORT.OUTSOURCING_CONTRACTS_LIABILITIES,
      url: "/report/outsourcing-contracts-liabilities",
      class: "fa-clone",
      resourceCode: "menu.qldt_bc_hdtncn"
    },
    {
      name: MENU_TITLE.REPORT.PARTNER_LIST,
      url: "/report/partner-list",
      class: "fa-edit",
      resourceCode: "menu.qldt_bc_dsdt"
    },
    {
      name: MENU_TITLE.REPORT.PROJECT_LIST,
      url: "/report/project-list",
      class: "fa-calendar-plus-o",
      resourceCode: "menu.qldt_bc_dsda"
    },
    {
      name: MENU_TITLE.REPORT.LIABILITIES,
      url: "/report/liabilities-organization-project-partner",
      class: "fa-calendar-plus-o",
      resourceCode: "menu.qldt_bc_cntdvdt"
    },
    {
      name: MENU_TITLE.REPORT.LIABILITIES_PARTNER,
      url: "/report/liabilities-partner",
      class: "fa-calendar-plus-o",
      resourceCode: "menu.qldt_bc_thcntdt"
    },
    {
      name: MENU_TITLE.REPORT.LIABILITIES_ORGANIZATION,
      url: "/report/liabilities-organization",
      class: "fa-calendar-plus-o",
      resourceCode: "menu.qldt_bc_thcntdv"
    },
    {
      name: MENU_TITLE.REPORT.OUTSOURCING_PLAN_STATISTICS,
      url: "/report/outsourcing-plan-statistics",
      class: "fa-calendar-plus-o",
      resourceCode: "menu.qldt_bc_tkkhtn"
    },
    {
      name: MENU_TITLE.REPORT.DETAIL_CONTRACT_MANAGEMANT,
      url: "/report/detailed-contract-management",
      class: "fa-calendar-plus-o",
      resourceCode: "menu.qldt_bc_qlhdctsd"
    },
    {
      name: MENU_TITLE.REPORT.LIABILITIES_ORGANIZATION_PARTNER,
      url: "/report/liabilities-organization-partner",
      class: "fa-calendar-plus-o",
      resourceCode: "menu.qldt_bc_thcntdvdt"
    },
    {
      name: MENU_TITLE.REPORT.PARTNER_INFORMATION,
      url: "/report/partner-information",
      class: "fa-calendar-plus-o",
      resourceCode: "menu.qldt_bc_thttcdt"
    }
  ];
  menuFunctionList: any[] = [];
  menuFunctionListNotAuth: any[] = [];

  constructor(
    private languageService: JhiLanguageService,
    private languageHelper: JhiLanguageHelper,
    private sessionStorage: SessionStorageService,
    private profileService: ProfileService,
    private router: Router,
    private formStoringService: FormStoringService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private commonApiService: CommonApiService,
    private cdref: ChangeDetectorRef,
    private versionManagementService: VersionManagementService
  ) {
    this.version = VERSION ? "v" + VERSION : "";
    this.isNavbarCollapsed = true;
  }

  ngOnInit() {
    this.languages = this.languageHelper.getAll();
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.swaggerEnabled = profileInfo.swaggerEnabled;
    });
  }

  ngAfterViewInit(): void {
    this.currentUser = this.formStoringService.get(STORAGE_KEYS.CURRENT_USER);
    if (!this.currentUser) {
      this.hasPermission = false;
      // this.setPermission();
      //this.getMenuFunctionNotAuth();
      this.cdref.detectChanges();
      return;
    } else {
      if (
        this.currentUser.userState === STATUS.ACTIVE &&
        this.currentUser.tenantState === STATUS.ACTIVE
      ) {
        this.hasPermission = true;
        // this.getMenuFunction();
        this.cdref.detectChanges();
      }
    }
  }

  changeLanguage(languageKey: string) {
    this.sessionStorage.store("locale", languageKey);
    this.languageService.changeLanguage(languageKey);
  }

  collapseNavbar() {
    this.isNavbarCollapsed = true;
  }

  isAuthenticated() {}

  login() {}

  logout() {
    this.collapseNavbar();
    this.router.navigate([""]);
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  getImageUrl() {}

  setPermission() {
    this.getActiveRouter(this.systemCategories_, 0);
  }

  getActiveRouter(arr: any[] = [], number: any) {
    for (let index = 0; index < arr.length; index++) {
      if (number === 0) {
        this.systemManagements.push(arr[index]);
      } else if (number === 1) {
        this.categories.push(arr[index]);
      } else if (number === 2) {
        this.announcementManagements.push(arr[index]);
      } else if (number === 3) {
        this.invoiceManagements.push(arr[index]);
      } else if (number === 4) {
        this.reports.push(arr[index]);
      } else if (number === 5) {
        this.utilities.push(arr[index]);
      }
    }
  }

  filterParent(menuFunctionList) {
    if (menuFunctionList && menuFunctionList.length > 0) {
      const result = menuFunctionList.filter(it => it.parentId === null);
      return result;
    }
  }

  filterDetails(menuFunctionList, data) {
    if (menuFunctionList && menuFunctionList.length > 0) {
      return menuFunctionList.filter(it => it.parentId === data.id);
    }
  }

  clearCacheOutsource() {
    this.versionManagementService.navigation(null);
  }

  navigateHome() {
    void this.router.navigate(["/"]);
  }
}
