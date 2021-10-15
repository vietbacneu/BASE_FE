import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PriceCommitmentSearchComponent} from "app/modules/partner-management/price-commitment-management/price-commitment-search/price-commitment-search.component";
import {StandardDestinationApproveComponent} from "app/modules/partner-management/price-commitment-management/standard-destination-approve/standard-destination-approve.component";
import {StandardDestinationFormComponent} from "app/modules/partner-management/price-commitment-management/standard-destination-form/standard-destination-form.component";
import {PriceCommitmentManagementComponent} from "app/modules/partner-management/price-commitment-management/price-commitment-management.component";
import {PriceCommitmentManagementRouting} from "app/modules/partner-management/price-commitment-management/price-commitment-management.routing";
import {InvoiceWebappSharedModule} from "app/shared/shared.module";


@NgModule({
    declarations: [PriceCommitmentSearchComponent, StandardDestinationApproveComponent, StandardDestinationFormComponent, PriceCommitmentManagementComponent],
    imports: [
        CommonModule,
        PriceCommitmentManagementRouting,
        InvoiceWebappSharedModule
    ],
    exports: [PriceCommitmentManagementComponent]
})
export class PriceCommitmentManagementModule {
}
