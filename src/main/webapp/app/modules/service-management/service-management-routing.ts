import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ExchangeRateManagementComponent} from "app/modules/exchange-rate-management/exchange-rate-management/exchange-rate-management.component";
import {ServiceManagementComponent} from "app/modules/service-management/service-management/service-management.component";

const routes: Routes = [
    {
        path: '', component: ServiceManagementComponent,
        data: {
            pageTitle: "partner.appParam",
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ServiceManagementRouting {
}
