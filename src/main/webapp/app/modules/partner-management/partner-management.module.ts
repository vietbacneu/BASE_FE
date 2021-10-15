import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PartnerManagementComponent} from './partner-management.component';
import {InvoiceWebappSharedModule} from "app/shared/shared.module";
import {PartnerManagementRouting} from "app/modules/partner-management/partner-management.routing";
import {PartnerInfoComponent} from './partner-info/partner-info.component';
import {ClueInfoComponent} from './clue-info/clue-info.component';
import {ContractInfoComponent} from './contract-info/contract-info.component';
import {TrunksManagementComponent} from './trunks-management/trunks-management.component';
import {PriceFormComponent} from './price-form/price-form.component';
import {ConfigEmailComponent} from './config-email/config-email.component';
import {PartnerEmailsComponent} from './partner-emails/partner-emails.component';
import {PriceInManagementComponent} from './price-in-management/price-in-management.component';
import {PriceOutManagementComponent} from './price-out-management/price-out-management.component';
import {PartnerManagementFormComponent} from './partner-management-form/partner-management-form.component';
import {PartnerManagementDetailComponent} from './partner-management-detail/partner-management-detail.component';
import {UpdatePartnerComponent} from './update-partner/update-partner.component';
import {AttachmentDocsComponent} from './contract-info/attachment-docs/attachment-docs.component';
import {TrunkFormComponent} from './trunks-management/trunk-form/trunk-form.component';
import {PriceOutFormComponent} from './price-out-management/price-out-form/price-out-form.component';
import {PriceOutAddUpdateComponent} from './price-out-management/price-out-form/price-out-add-update/price-out-add-update.component';
import {PriceInFormComponent} from './price-in-management/price-in-form/price-in-form.component';
import {PriceInAddUpdateComponent} from './price-in-management/price-in-form/price-in-add-update/price-in-add-update.component';
import {PageService, SortService, TreeGridModule} from "@syncfusion/ej2-angular-treegrid";
import {PriceCommitmentManagementModule} from "app/modules/partner-management/price-commitment-management/price-commitment-management.module";

@NgModule({
    declarations: [
        PartnerManagementComponent,
        PartnerInfoComponent,
        ClueInfoComponent,
        ContractInfoComponent,
        TrunksManagementComponent,
        PriceFormComponent,
        ConfigEmailComponent,
        PartnerEmailsComponent,
        PriceInManagementComponent,
        PriceOutManagementComponent,
        PartnerManagementFormComponent,
        PartnerManagementDetailComponent,
        UpdatePartnerComponent,
        AttachmentDocsComponent,
        TrunkFormComponent,
        PriceOutFormComponent,
        PriceOutAddUpdateComponent,
        PriceInFormComponent,
        PriceInAddUpdateComponent
    ],
    imports: [
        CommonModule,
        InvoiceWebappSharedModule,
        PartnerManagementRouting,
        TreeGridModule,
        PriceCommitmentManagementModule,
    ],
    entryComponents: [AttachmentDocsComponent, TrunkFormComponent, PriceOutAddUpdateComponent, PriceInAddUpdateComponent],
    providers: [PageService, SortService]
})
export class PartnerManagementModule {
}
