import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {JhiEventManager} from "ng-jhipster";
import {FormStoringService} from "app/shared/services/form-storing.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: "jhi-home",
  templateUrl: "./home.component.html",
  styleUrls: ["home.scss"]
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  account: Account;
  authSubscription: Subscription;
  modalRef: NgbModalRef;
  isError = false;
  errorMsg = "";
  currentUser;

  constructor(
    private router: Router,
    private eventManager: JhiEventManager,
    private formStoringService: FormStoringService,
    private translateService: TranslateService,
    private cdref: ChangeDetectorRef,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.router.navigate(["/nhan-vien"]);
  }

  ngAfterViewInit(): void {
    console.warn("SyPT", "home init");
    // this.currentUser = this.formStoringService.get(STORAGE_KEYS.CURRENT_USER);
    // if (Number(this.currentUser.userState) !== STATUS.ACTIVE) {
    //   this.isError = true;
    //   this.errorMsg = this.translateService.instant('home.validate.userDeactivate');
    //   setTimeout(() => {
    //     localStorage.clear();
    //     this.router.navigate(['/account/login']);
    //   }, TIME_OUT.NAVIGATE_LOGIN);
    //   this.cdref.detectChanges();
    //   return;
    // }
    // if (Number(this.currentUser.tenantState) !== STATUS.ACTIVE) {
    //   this.isError = true;
    //   this.errorMsg = this.translateService.instant('home.validate.tenantDeactivate');
    //   setTimeout(() => {
    //     localStorage.clear();
    //     this.router.navigate(['/account/login']);
    //   }, TIME_OUT.NAVIGATE_LOGIN);
    //   this.cdref.detectChanges();
    //   return;
    // }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.eventManager.destroy(this.authSubscription);
    }
  }
}
