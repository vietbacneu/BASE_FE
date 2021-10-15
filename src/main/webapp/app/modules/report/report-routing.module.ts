import { RouterModule, Routes } from "@angular/router";
import { JhiResolvePagingParams } from "ng-jhipster";
import { NgModule } from "@angular/core";
import { ProjectListComponent } from "app/modules/report/project-list/project-list.component";
import { PartnerListComponent } from "app/modules/report/partner-list/partner-list.component";
import { PartnerInformationComponent } from "app/modules/report/partner-information/partner-information.component";
import { OutsourcingPlanStatisticsComponent } from "app/modules/report/outsourcing-plan-statistics/outsourcing-plan-statistics.component";
import { OutsourcingContractsLiabilitiesComponent } from "app/modules/report/outsourcing-contracts-liabilities/outsourcing-contracts-liabilities.component";
import { LiabilitiesPartnerComponent } from "app/modules/report/liabilities-partner/liabilities-partner.component";
import { LiabilitiesOrganizationProjectPartnerComponent } from "app/modules/report/liabilities-organization-project-partner/liabilities-organization-project-partner.component";
import { LiabilitiesOrganizationPartnerComponent } from "app/modules/report/liabilities-organization-partner/liabilities-organization-partner.component";
import { LiabilitiesOrganizationComponent } from "app/modules/report/liabilities-organization/liabilities-organization.component";
import { DetailedContractManagementComponent } from "app/modules/report/detailed-contract-management/detailed-contract-management.component";

const routes: Routes = [
  {
    path: "project-list",
    component: ProjectListComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "reportProject.title",
      url: "report/project-list"
    }
  },
  {
    path: "partner-list",
    component: PartnerListComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "reportPartner.title",
      url: "report/partner-list"
    }
  },
  {
    path: "partner-information",
    component: PartnerInformationComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "detailedContractManagement.partnerInformation.title",
      url: "report/partner-information"
    }
  },
  {
    path: "outsourcing-plan-statistics",
    component: OutsourcingPlanStatisticsComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "outsourcingPlanReport.title",
      url: "report/outsourcing-plan-statistics"
    }
  },
  {
    path: "outsourcing-contracts-liabilities",
    component: OutsourcingContractsLiabilitiesComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "reportOutsourcingContract.title",
      url: "report/outsourcing-contracts-liabilities"
    }
  },
  {
    path: "liabilities-partner",
    component: LiabilitiesPartnerComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "reportLiabilitiesPartner.title",
      url: "report/liabilities-partner"
    }
  },
  {
    path: "liabilities-organization-project-partner",
    component: LiabilitiesOrganizationProjectPartnerComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "liabilities.title",
      url: "report/liabilities-organization-project-partner"
    }
  },
  {
    path: "liabilities-organization-partner",
    component: LiabilitiesOrganizationPartnerComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "liabilitiesOrganizationPartner.title",
      url: "report/liabilities-organization-partner"
    }
  },
  {
    path: "liabilities-organization",
    component: LiabilitiesOrganizationComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "reportLiabilitiesOrgan.title",
      url: "report/liabilities-organization"
    }
  },
  {
    path: "detailed-contract-management",
    component: DetailedContractManagementComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "detailedContractManagement.title",
      url: "report/detailed-contract-management"
    }
  },
  {
    path: "partner-information",
    component: PartnerInformationComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "detailedContractManagement.title",
      url: "report/partner-information"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {}
