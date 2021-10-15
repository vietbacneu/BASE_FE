import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { InvoiceWebappSharedModule } from "app/shared/shared.module";
import { HOME_ROUTE } from "./home.route";
import { HomeComponent } from "./home.component";
import { DashboardModule } from "app/modules/dashboard/dashboard.module";

@NgModule({
  imports: [
    InvoiceWebappSharedModule,
    RouterModule.forChild([HOME_ROUTE]),
    DashboardModule
  ],
  declarations: [HomeComponent]
})
export class InvoiceWebappHomeModule {}
