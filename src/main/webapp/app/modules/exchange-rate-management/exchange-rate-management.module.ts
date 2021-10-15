import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InvoiceWebappSharedModule} from "app/shared/shared.module";
import {ExchangeRateRouting} from "app/modules/exchange-rate-management/exchange-rate-routing";
import {ExchangeRateManagementComponent} from "app/modules/exchange-rate-management/exchange-rate-management/exchange-rate-management.component";
import { ExchangeRateManagementFormComponent } from './exchange-rate-management/exchange-rate-management-form/exchange-rate-management-form.component';


@NgModule({
    declarations: [ExchangeRateManagementComponent, ExchangeRateManagementFormComponent],
    imports: [
        CommonModule,
        InvoiceWebappSharedModule,
        ExchangeRateRouting
    ],
    entryComponents:[ExchangeRateManagementFormComponent]
})
export class ExchangeRateManagementModule {
}
