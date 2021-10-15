import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PartnerManagementComponent} from "app/modules/partner-management/partner-management.component";
import {PartnerManagementFormComponent} from "app/modules/partner-management/partner-management-form/partner-management-form.component";
import {PartnerManagementDetailComponent} from "app/modules/partner-management/partner-management-detail/partner-management-detail.component";
import {UpdatePartnerComponent} from "app/modules/partner-management/update-partner/update-partner.component";
import {PriceOutFormComponent} from "app/modules/partner-management/price-out-management/price-out-form/price-out-form.component";
import {PriceInFormComponent} from "app/modules/partner-management/price-in-management/price-in-form/price-in-form.component";

const routes: Routes = [
    {
        path: '', component: PartnerManagementComponent,
        data: {
            pageTitle: "partner.pageTitle",
        }
    },
    {
        path: 'new', component: PartnerManagementFormComponent,
        data: {
            pageTitle: "partner.addPartner",
        }
    },
    {
        path: 'edit', component: UpdatePartnerComponent,
        data: {
            pageTitle: "partner.updatePartner",
        }
    },
    {
        path: 'detail', component: PartnerManagementDetailComponent,
        data: {
            pageTitle: "partner.detailPartner",
        }
    },
    {
        path: 'price-out-management', component: PriceOutFormComponent,
        data: {
            pageTitle: "partner.priceOutManagement",
        }
    },
    {
        path: 'price-in-management', component: PriceInFormComponent,
        data: {
            pageTitle: "partner.priceInManagement",
        }
    },
    {
        path: 'price-commitment-management',
        loadChildren: () => import('./price-commitment-management/price-commitment-management.module').then(m => m.PriceCommitmentManagementModule),
        data: {
            pageTitle: "partner.priceCommitmentManagement",
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerManagementRouting {
}
