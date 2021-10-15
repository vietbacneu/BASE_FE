import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PartnerInformationComponent } from "./partner-information/partner-information.component";
import { LiabilitiesOrganizationPartnerComponent } from "./liabilities-organization-partner/liabilities-organization-partner.component";
import { DetailedContractManagementComponent } from "./detailed-contract-management/detailed-contract-management.component";
import { OutsourcingPlanStatisticsComponent } from "./outsourcing-plan-statistics/outsourcing-plan-statistics.component";
import { LiabilitiesPartnerComponent } from "./liabilities-partner/liabilities-partner.component";
import { LiabilitiesOrganizationComponent } from "./liabilities-organization/liabilities-organization.component";
import { LiabilitiesOrganizationProjectPartnerComponent } from "./liabilities-organization-project-partner/liabilities-organization-project-partner.component";
import { ProjectListComponent } from "./project-list/project-list.component";
import { OutsourcingContractsLiabilitiesComponent } from "./outsourcing-contracts-liabilities/outsourcing-contracts-liabilities.component";
import { PartnerListComponent } from "./partner-list/partner-list.component";
import { ReportRoutingModule } from "app/modules/report/report-routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { InvoiceWebappSharedModule } from "app/shared/shared.module";
import { PartnerOutsideComponent } from "./partner-information/partner-outside/partner-outside.component";
import { PartnerContractComponent } from "./partner-information/partner-contract/partner-contract.component";
import { PartnerProjectComponent } from "./partner-information/partner-project/partner-project.component";

@NgModule({
  declarations: [
    PartnerInformationComponent,
    LiabilitiesOrganizationPartnerComponent,
    DetailedContractManagementComponent,
    OutsourcingPlanStatisticsComponent,
    LiabilitiesPartnerComponent,
    LiabilitiesOrganizationComponent,
    LiabilitiesOrganizationProjectPartnerComponent,
    ProjectListComponent,
    OutsourcingContractsLiabilitiesComponent,
    PartnerListComponent,
    PartnerOutsideComponent,
    PartnerContractComponent,
    PartnerProjectComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    TranslateModule,
    FormsModule,
    NgbModule,
    InvoiceWebappSharedModule
  ]
})
export class ReportModule {}
