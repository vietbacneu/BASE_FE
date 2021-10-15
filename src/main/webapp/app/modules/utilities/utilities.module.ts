import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UtilitiesRoutingModule } from "app/modules/utilities/utilities-routing.module";
import { InvoiceWebappSharedModule } from "app/shared/shared.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { CheckProfileAppraisalComponent } from "app/modules/utilities/check-profile-appraisal/check-profile-appraisal.component";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [CheckProfileAppraisalComponent],
  imports: [
    CommonModule,
    UtilitiesRoutingModule,
    PerfectScrollbarModule,
    InvoiceWebappSharedModule,
    ModalModule.forRoot()
  ],
  entryComponents: [CheckProfileAppraisalComponent]
})
export class UtilitiesModule {}
