import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "app/modules/dashboard/dashboard.component";
import { OutsideProjectComponent } from "app/modules/dashboard/outside-project/outside-project.component";
import { ChartsModule } from "ng2-charts";
import { PartnerEmployeeListComponent } from "app/modules/dashboard/partner-employee/partner-employee-list/partner-employee-list.component";
import { InvoiceWebappSharedModule } from "app/shared/shared.module";
import { LiabilitiesPartnerComponent } from "./liabilities-partner/liabilities-partner.component";
import { PartnerOrganizationComponent } from "./partner-organization/partner-organization.component";
import { PartnerEmployeeChartComponent } from "app/modules/dashboard/partner-employee/partner-employee-chart.component";
import { PartnerProjectComponent } from "app/modules/dashboard/partner-project/partner-project.component";
import { DetailComponent } from "app/modules/dashboard/outside-project/detail/detail.component";
import { LiabilitiesPartnerPopupComponent } from "app/modules/dashboard/liabilities-partner/liabilities-partner-popup/liabilities-partner-popup.component";
import { PartnerOrganizationListComponent } from "app/modules/dashboard/partner-organization/partner-organization-list/partner-organization-list.component";
import { PartnerDetailComponent } from "./partner-project/partner-detail/partner-detail.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { DashboardRoutingModule } from "app/modules/dashboard/dashboard-routing.module";
import { PartnerOrganizationZoomComponent } from "./partner-organization/partner-organization-zoom/partner-organization-zoom.component";
import { PartnerEmployeeChartZoomComponent } from "app/modules/dashboard/partner-employee/partner-employee-chart-zoom/partner-employee-chart-zoom.component";
import { OutsideProjectZoomComponent } from "./outside-project/outside-project-zoom/outside-project-zoom.component";
import { PartnerProjectZoomComponent } from "./partner-project/partner-project-zoom/partner-project-zoom.component";
import { PartnerProjectCkZoomComponent } from "./partner-project/partner-project-ck-zoom/partner-project-ck-zoom.component";
import { LiabilitiesPartnerColumnChartZoomComponent } from "./liabilities-partner/liabilities-partner-column-chart-zoom/liabilities-partner-column-chart-zoom.component";
import { LiabilitiesPartnerCycleChartZoomComponent } from "./liabilities-partner/liabilities-partner-cycle-chart-zoom/liabilities-partner-cycle-chart-zoom.component";
import { HighchartsChartModule } from "highcharts-angular";

@NgModule({
  declarations: [
    DashboardComponent,
    PartnerEmployeeListComponent,
    OutsideProjectComponent,
    LiabilitiesPartnerComponent,
    PartnerOrganizationComponent,
    PartnerEmployeeChartComponent,
    PartnerDetailComponent,
    PartnerProjectComponent,
    DetailComponent,
    PartnerProjectComponent,
    PartnerOrganizationListComponent,
    LiabilitiesPartnerPopupComponent,
    PartnerOrganizationZoomComponent,
    PartnerEmployeeChartZoomComponent,
    OutsideProjectZoomComponent,
    PartnerProjectZoomComponent,
    PartnerProjectCkZoomComponent,
    LiabilitiesPartnerColumnChartZoomComponent,
    LiabilitiesPartnerCycleChartZoomComponent
  ],
  imports: [
    DashboardRoutingModule,
    CommonModule,
    ChartsModule,
    InvoiceWebappSharedModule,
    NgApexchartsModule,
    HighchartsChartModule
  ],
  exports: [DashboardComponent],
  entryComponents: [
    PartnerOrganizationListComponent,
    PartnerEmployeeListComponent,
    LiabilitiesPartnerPopupComponent,
    DetailComponent,
    PartnerDetailComponent,
    PartnerOrganizationZoomComponent,
    PartnerEmployeeChartZoomComponent,
    OutsideProjectZoomComponent,
    PartnerProjectZoomComponent,
    PartnerProjectCkZoomComponent,
    LiabilitiesPartnerColumnChartZoomComponent,
    LiabilitiesPartnerCycleChartZoomComponent
  ],
  providers: []
})
export class DashboardModule {}
