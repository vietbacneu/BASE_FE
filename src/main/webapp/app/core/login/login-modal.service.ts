import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class LoginModalService {
  constructor(private modalService: NgbModal, private router: Router) {}

  open() {
    this.router.navigate(["/account/login"]);
    return null;
  }
}
