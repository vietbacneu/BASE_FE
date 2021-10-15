import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CurrencyManagementComponent} from './currency-management/currency-management.component';
import {InvoiceWebappSharedModule} from "app/shared/shared.module";
import {CurrencyManagementRouting} from "app/modules/currency-management/currency-management.routing";
import { CurrencyManagementFormComponent } from './currency-management/currency-management-form/currency-management-form.component';


@NgModule({
    declarations: [CurrencyManagementComponent, CurrencyManagementFormComponent],
    imports: [
        CommonModule,
        InvoiceWebappSharedModule,
        CurrencyManagementRouting
    ],
    entryComponents:[CurrencyManagementFormComponent]
})
export class CurrencyManagementModule {
}
