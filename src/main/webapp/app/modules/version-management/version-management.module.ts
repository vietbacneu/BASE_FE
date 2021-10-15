import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VersionManagementRoutingModule } from "app/modules/version-management/version-management-routing.module";
import { InvoiceWebappSharedModule } from "app/shared/shared.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { VersionManagementAddComponent } from "app/modules/version-management/version-management-add/version-management-add.component";
import { VersionManagementComponent } from "app/modules/version-management/version-management.component";

@NgModule({
  declarations: [VersionManagementComponent, VersionManagementAddComponent],
  imports: [
    CommonModule,
    VersionManagementRoutingModule,
    PerfectScrollbarModule,
    InvoiceWebappSharedModule
  ],
  entryComponents: [VersionManagementComponent, VersionManagementAddComponent]
})
export class VersionManagementModule {}
