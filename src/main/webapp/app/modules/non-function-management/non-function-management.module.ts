import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NonFunctionManagementRouting } from "app/modules/non-function-management/non-function-management-routing.module";
import { NonFunctionManagementComponent } from "./non-function-management.component";
import { InvoiceWebappSharedModule } from "app/shared/shared.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { ViewNonFunctionManagementComponent } from "./view-non-function-management/view-non-function-management.component";
import { ImportExcelNonFunctionManagementComponent } from "app/modules/non-function-management/import-excel-non-function-management-plan/import-excel-non-function-management.component";
import { AutocompleteLibModule } from "angular-ng-autocomplete";

@NgModule({
  declarations: [
    NonFunctionManagementComponent,
    ViewNonFunctionManagementComponent,
    ImportExcelNonFunctionManagementComponent
  ],
  imports: [
    CommonModule,
    NonFunctionManagementRouting,
    PerfectScrollbarModule,
    InvoiceWebappSharedModule,
    AutocompleteLibModule
  ],
  entryComponents: [
    ViewNonFunctionManagementComponent,
    ImportExcelNonFunctionManagementComponent
  ]
})
export class NonFunctionManagementModule {}
