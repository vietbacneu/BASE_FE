import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { JhiLanguageService } from "ng-jhipster";
import { SessionStorageService } from "ngx-webstorage";

import { VERSION } from "app/app.constants";
import { JhiLanguageHelper } from "app/core/language/language.helper";
import { ProfileService } from "app/layouts/profiles/profile.service";
import { FormStoringService } from "app/shared/services/form-storing.service";
import { DownloadService } from "app/shared/services/download.service";
import { NotificationComponent } from "app/shared/components/notification/notification.component";
import { STORAGE_KEYS } from "app/shared/constants/storage-keys.constants";
import { SERVER_API } from "app/shared/constants/api-resource.constants";
import { CookieService } from "ngx-cookie";

@Component({
  selector: "jhi-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["navbar.scss"]
})
export class NavbarComponent implements OnInit {
  @ViewChild(NotificationComponent, { static: true }) notification;

  resourceUrl = SERVER_API;
  inProduction: boolean;
  isNavbarCollapsed: boolean;
  languages: any[];
  swaggerEnabled: boolean;
  modalRef: NgbModalRef;
  version: string;
  notificationList: any[];
  notificationPopupList: any[];
  notificationTotalList: any[] = [];
  selectedItem;
  selectedIndex;
  hasPermission = true;
  userInfo;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private languageService: JhiLanguageService,
    private languageHelper: JhiLanguageHelper,
    private sessionStorage: SessionStorageService,
    private profileService: ProfileService,
    private formStoringService: FormStoringService,
    private downloadService: DownloadService,
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.version = VERSION
      ? VERSION.toLowerCase().startsWith("v")
        ? VERSION
        : "v" + VERSION
      : "";
    this.isNavbarCollapsed = true;
  }

  ngOnInit() {
    this.languages = this.languageHelper.getAll();
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.swaggerEnabled = profileInfo.swaggerEnabled;
    });
    this.formStoringService.get(STORAGE_KEYS.CURRENT_USER);
    this.userInfo = this.formStoringService.get(STORAGE_KEYS.CURRENT_USER);
  }

  getSelected(index) {
    if (index === this.selectedIndex) {
      return true;
    } else {
      return false;
    }
  }

  showNotification() {
    this.notification.setData(this.notificationPopupList);
  }

  changeLanguage(languageKey: string) {
    this.sessionStorage.store("locale", languageKey);
    this.languageService.changeLanguage(languageKey);
  }

  collapseNavbar() {
    this.isNavbarCollapsed = true;
  }

  login() {}

  logout() {
    this.collapseNavbar();
    this.router.navigate([""]);
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  get currentUser() {
    return this.formStoringService.get(STORAGE_KEYS.CURRENT_USER);
  }

  logOut() {
    this.http
      .get(this.resourceUrl + "/user/logout")
      .subscribe(res => {}, error => {});
    localStorage.clear();
    sessionStorage.clear();
    this.cookieService.removeAll();
  }

  closeNotification() {
    if (this.notification.show === true) {
      this.notification.closeAll();
    }
  }
}
