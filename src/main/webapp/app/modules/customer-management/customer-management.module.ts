import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomerListComponent } from "./customer-list/customer-list.component";
import { InvoiceWebappSharedModule } from "app/shared/shared.module";
import { ContractComponent } from "./contract/contract.component";
import { NumberOfDocumentComponent } from "./number-of-document/number-of-document.component";
import { ProjectComponent } from "./project/project.component";

import { CustomerComponent } from "./customer/customer.component";
import { ChartsModule } from "ng2-charts";
// import { CanvasJS  } from 'canvasjs';

@NgModule({
  declarations: [
    CustomerListComponent,
    ContractComponent,
    NumberOfDocumentComponent,
    ProjectComponent,
    CustomerComponent
  ],
  exports: [CustomerListComponent, CustomerComponent],
  imports: [CommonModule, InvoiceWebappSharedModule, ChartsModule]
})
export class CustomerManagementModule {}
