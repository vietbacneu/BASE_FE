import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FunctionManagementRouting } from "app/modules/function-management/function-management-routing.module";
import { FunctionManagementComponent } from "./function-management.component";
import { InvoiceWebappSharedModule } from "app/shared/shared.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { ViewFunctionManagementComponent } from "./view-function-management/view-function-management.component";
import { ImportExcelFunctionManagementComponent } from "app/modules/function-management/import-excel-function-management-plan/import-excel-function-management.component";
import { AutocompleteLibModule } from "angular-ng-autocomplete";

@NgModule({
  declarations: [
    FunctionManagementComponent,
    ViewFunctionManagementComponent,
    ImportExcelFunctionManagementComponent
  ],
  imports: [
    CommonModule,
    FunctionManagementRouting,
    PerfectScrollbarModule,
    InvoiceWebappSharedModule,
    AutocompleteLibModule
  ],
  entryComponents: [
    ViewFunctionManagementComponent,
    ImportExcelFunctionManagementComponent
  ]
})
export class FunctionManagementModule {}
