import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CurrencyManagementComponent} from "app/modules/currency-management/currency-management/currency-management.component";

const routes: Routes = [
    {
        path: '', component: CurrencyManagementComponent,
        data: {
            pageTitle: "partner.currency_management",
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CurrencyManagementRouting {
}
