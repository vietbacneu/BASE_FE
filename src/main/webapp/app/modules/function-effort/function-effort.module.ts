import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FunctionEffortRoutingModule } from "app/modules/function-effort/function-effort-routing.module";
import { InvoiceWebappSharedModule } from "app/shared/shared.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { FunctionEffortComponent } from "app/modules/function-effort/function-effort.component";

@NgModule({
  declarations: [FunctionEffortComponent],
  imports: [
    CommonModule,
    FunctionEffortRoutingModule,
    PerfectScrollbarModule,
    InvoiceWebappSharedModule
  ],
  entryComponents: [FunctionEffortComponent]
})
export class FunctionEffortModule {}
