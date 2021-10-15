import { Component, AfterViewInit, Renderer, ElementRef } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import { JhiEventManager } from "ng-jhipster";

import { StateStorageService } from "app/core/auth/state-storage.service";

@Component({
  selector: "jhi-login-modal",
  templateUrl: "./login.component.html"
})
export class JhiLoginModalComponent implements AfterViewInit {
  authenticationError: boolean;

  loginForm = this.fb.group({
    username: [""],
    password: [""],
    rememberMe: [false]
  });

  constructor(
    private eventManager: JhiEventManager,
    private stateStorageService: StateStorageService,
    private elementRef: ElementRef,
    private renderer: Renderer,
    private router: Router,
    public activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngAfterViewInit() {
    setTimeout(
      () =>
        this.renderer.invokeElementMethod(
          this.elementRef.nativeElement.querySelector("#username"),
          "focus",
          []
        ),
      0
    );
  }

  cancel() {
    this.authenticationError = false;
    this.loginForm.patchValue({
      username: "",
      password: ""
    });
    this.activeModal.dismiss("cancel");
  }

  login() {}

  register() {
    this.activeModal.dismiss("to state register");
    this.router.navigate(["/account/register"]);
  }

  requestResetPassword() {
    this.activeModal.dismiss("to state requestReset");
    this.router.navigate(["/account/reset", "request"]);
  }
}
