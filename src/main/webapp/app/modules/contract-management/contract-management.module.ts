import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContractManagementComponent } from "./contract-management/contract-management.component";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { InvoiceWebappSharedModule } from "app/shared/shared.module";
import { ContractManagementRoutingModule } from "app/modules/contract-management/contract-management-routing.module";
import { ContractManagementFormComponent } from "app/modules/contract-management/contract-management-form/contract-management-form.component";
import { FormsModule } from "@angular/forms";
import { ImportExcelComponent } from "./import-excel/import-excel.component";

@NgModule({
  declarations: [
    ContractManagementComponent,
    ContractManagementFormComponent,
    ImportExcelComponent
  ],
  imports: [
    CommonModule,
    ContractManagementRoutingModule,
    PerfectScrollbarModule,
    FormsModule,
    InvoiceWebappSharedModule
  ],
  entryComponents: [ImportExcelComponent]
})
export class ContractManagementModule {}
