import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {StandardDestinationFormComponent} from "app/modules/partner-management/price-commitment-management/standard-destination-form/standard-destination-form.component";
import {StandardDestinationApproveComponent} from "app/modules/partner-management/price-commitment-management/standard-destination-approve/standard-destination-approve.component";
import {PriceCommitmentSearchComponent} from "app/modules/partner-management/price-commitment-management/price-commitment-search/price-commitment-search.component";

const routes: Routes = [
    {
        path: '', component: PriceCommitmentSearchComponent,
    },
    {
        path: 'add', component: StandardDestinationFormComponent,
        data: {
            pageTitle: "partner.commitment.add",
        }
    },
    {
        path: 'approve', component: StandardDestinationApproveComponent,
        data: {
            pageTitle: "partner.commitment.approve",
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PriceCommitmentManagementRouting {
}
