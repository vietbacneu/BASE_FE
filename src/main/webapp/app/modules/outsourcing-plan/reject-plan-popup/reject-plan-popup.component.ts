import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OutsourcingPlanService } from "app/core/services/outsourcing-plan/outsourcing-plan.service";
import { JhiEventManager } from "ng-jhipster";
import { ToastService } from "app/shared/services/toast.service";
import { OutsourcingPlanModel } from "app/core/models/outsourcing-plan/outsourcing-plan.model";
import { CommonService } from "app/shared/services/common.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "jhi-reject-plan-popup",
  templateUrl: "./reject-plan-popup.component.html",
  styleUrls: ["./reject-plan-popup.component.scss"]
})
export class RejectPlanPopupComponent implements OnInit {
  @Input() selectedData: OutsourcingPlanModel;
  @Input() type: String;

  form: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private outsourcingPlanService: OutsourcingPlanService,
    private eventManager: JhiEventManager,
    private toastService: ToastService,
    private commonService: CommonService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  onCloseModal() {
    this.activeModal.dismiss();
    this.form.reset();
    this.activeModal.dismiss(true);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      reasonReject: [this.selectedData.reasonRejection, Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.commonService.validateAllFormFields(this.form);
      return;
    }

    const body = {
      id: this.selectedData.softwareDevelopmentID,
      reasonRejection: this.form.value.reasonReject
    };

    this.outsourcingPlanService.rejectPlan(body).subscribe(res => {
      if (res.body.statusCode !== "SYSTEM_ERROR") {
        if (res.body.statusCode === "NOT_DRAFT") {
          this.toastService.openErrorToast(
            res.body.statusCode,
            res.body.message
          );
          this.toastService.openErrorToast(
            this.translateService.instant("outsourcingPlan.toast.notDraft"),
            this.translateService.instant("outsourcingPlan.toast.errorTitle")
          );
        } else if (res.body.statusCode === "SUCCESS") {
          this.toastService.openSuccessToast(
            this.translateService.instant(
              "outsourcingPlan.toast.rejectSuccess"
            ),
            this.translateService.instant("outsourcingPlan.toast.success")
          );
        }
        this.eventManager.broadcast({
          name: "outSourcingPlan"
        });
        this.onCloseModal();
      } else {
        this.toastService.openErrorToast(
          res.body.message,
          this.translateService.instant("outsourcingPlan.toast.errorTitle")
        );
      }
    });
  }

  get formControl() {
    return this.form.controls;
  }

  isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched;
  }
}
