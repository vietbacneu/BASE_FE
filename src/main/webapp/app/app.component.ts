import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  NavigationError,
  Router
} from "@angular/router";
import { JhiLanguageHelper } from "app/core/language/language.helper";
import { ScriptService } from "app/shared/services/script.service";
import { NotificationComponent } from "app/shared/components/notification/notification.component";
import { HttpClient } from "@angular/common/http";
import { SERVER_API } from "app/shared/constants/api-resource.constants";
import { AppParamsService } from "app/core/services/common-api/app-params.service";
import { FormStoringService } from "app/shared/services/form-storing.service";
import { STORAGE_KEYS } from "app/shared/constants/storage-keys.constants";
import { CookieService } from "ngx-cookie";

@Component({
  selector: "jhi-main",
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(NotificationComponent, { static: true }) notification;

  resourceUrl = SERVER_API;

  constructor(
    private jhiLanguageHelper: JhiLanguageHelper,
    private router: Router,
    private scriptService: ScriptService,
    private http: HttpClient,
    private appParamsService: AppParamsService,
    private cookieService: CookieService,
    //ThucDV modify start 24/07/2020
    private formStoringService: FormStoringService //ThucDV modify end 24/07/2020
  ) {}

  ngOnInit() {
    const parameters = new URLSearchParams(window.location.search);
    const ticket = parameters.get("ticket");
    var path = this.resourceUrl;
    if (ticket != null) {
      path = this.resourceUrl + "/user/getUserInfo?ticket=" + ticket;
    } else {
      path = this.resourceUrl + "/user/getUserInfo";
    }
    console.log("dang chạy vsa " + path);

    this.http.get(path).subscribe(
      // this.http.get(this.resourceUrl + '/user/test-author').subscribe(
      res => {
        //Luu danh sach permission len local storage
        //ThucDV modify start 24/07/2020
        if (res == null) {
          alert("Người dùng chưa được tạo trên hệ thống Quản lý đối tác");
          this.http
            .get(this.resourceUrl + "/user/logout")
            .subscribe(res => {}, error => {});
          localStorage.clear();
          sessionStorage.clear();
          this.cookieService.removeAll();
        } else {
          let isLogin = true;
          if (
            this.formStoringService.get(STORAGE_KEYS.CURRENT_USER).name != null
          ) {
            console.warn("Da Dang nhap");
            isLogin = false;
          }
          this.formStoringService.set(
            STORAGE_KEYS.USER_PERMISSION_LIST,
            res["permissionLst"]
          );
          this.formStoringService.set(
            STORAGE_KEYS.CURRENT_USER,
            res["userEntity"]
          );
          //ThucDV modify end 24/07/2020

          if (isLogin) {
            console.warn("Dang nhap: reload");
            window.location.reload();
          }
        }

        //SyPT added
        // this.router.navigate(['/dashboard']);
      },
      error => {
        const directUrl = error.error["data"];
      }
    );

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.jhiLanguageHelper.updateTitle(
          this.getPageTitle(this.router.routerState.snapshot.root)
        );
      }
      if (event instanceof NavigationError && event.error.status === 404) {
        this.router.navigate(["/404"]);
      }
    });
  }

  ngAfterViewInit(): void {
    this.scriptService
      .load("jquery-1.11.1.min.js", "pace.min.js", "tether.min.js")
      .then(() => {
        this.scriptService
          .load(
            "bootstrap.min.js",
            "modernizr.custom.js",
            "jquery.scrollbar.min.js",
            "ckeditor.js"
          )
          .then(() => {
            this.scriptService
              .load("pages.min.js", "scripts.js", "demo.js")
              .then(() => {});
          });
      });
  }

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
    let title: string =
      routeSnapshot.data && routeSnapshot.data["pageTitle"]
        ? routeSnapshot.data["pageTitle"]
        : "invoiceWebappApp";
    if (routeSnapshot.firstChild) {
      title = this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }
}
