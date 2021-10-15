import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InvoiceWebappSharedModule } from "app/shared/shared.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { OutsourcingPlanComponent } from "app/modules/outsourcing-plan/outsourcing-plan.component";
import { OutsourcingPlanRouting } from "app/modules/outsourcing-plan/outsourcing-plan-routing.module";
import { OutsourcingPlanAddComponent } from "./outsourcing-plan-add/outsourcing-plan-add.component";
import { OutsourcingPlanUpdateComponent } from "./outsourcing-plan-update/outsourcing-plan-update.component";
import { ImportExcelOutsourcingPlanComponent } from "app/modules/outsourcing-plan/import-excel-outsourcing-plan/import-excel-outsourcing-plan.component";
import { RejectPlanPopupComponent } from "./reject-plan-popup/reject-plan-popup.component";

@NgModule({
  declarations: [
    OutsourcingPlanComponent,
    OutsourcingPlanAddComponent,
    OutsourcingPlanUpdateComponent,
    ImportExcelOutsourcingPlanComponent,
    RejectPlanPopupComponent
  ],
  imports: [
    CommonModule,
    OutsourcingPlanRouting,
    PerfectScrollbarModule,
    InvoiceWebappSharedModule
  ],
  entryComponents: [
    ImportExcelOutsourcingPlanComponent,
    RejectPlanPopupComponent
  ]
})
export class OutsourcingPlanModule {}
