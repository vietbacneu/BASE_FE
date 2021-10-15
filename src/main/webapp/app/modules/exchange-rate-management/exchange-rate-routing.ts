import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ExchangeRateManagementComponent} from "app/modules/exchange-rate-management/exchange-rate-management/exchange-rate-management.component";

const routes: Routes = [
    {
        path: '', component: ExchangeRateManagementComponent,
        data: {
            pageTitle: "partner.appParam",
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExchangeRateRouting {
}
