import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {JhiMainComponent} from "app/layouts/main/main.component";

const routes: Routes = [
    {
        path: "",
        component: JhiMainComponent,
        children: [
            {
                path: "",
                // data: {
                //   authorities: ['ROLE_USER']
                // },
                /* canActivate: [UserRouteAccessService],*/
                loadChildren: () =>
                    import("../../home/home.module").then(m => m.InvoiceWebappHomeModule)
            },
            {
                path: "system-categories",
                /*canActivate: [UserRouteAccessService],*/
                loadChildren: () =>
                    import(
                        "../../modules/system-categories/system-categories.module"
                        ).then(m => m.SystemCategoriesModule)
            },
            {
                path: "",
                /* canActivate: [UserRouteAccessService],*/
                loadChildren: () =>
                    import(
                        "../../modules/version-management/version-management.module"
                        ).then(m => m.VersionManagementModule)
            },
            {
                path: "",
                /* canActivate: [UserRouteAccessService],*/
                loadChildren: () =>
                    import(
                        "../../modules/profile-appraisal/profile-appraisal.module"
                        ).then(m => m.ProfileAppraisalModule)
            },
            {
                path: "",
                /* canActivate: [UserRouteAccessService],*/
                loadChildren: () =>
                    import("../../modules/function-effort/function-effort.module").then(
                        m => m.FunctionEffortModule
                    )
            },
            {
                path: "",
                /*canActivate: [UserRouteAccessService],*/
                loadChildren: () =>
                    import(
                        "../../modules/contract-management/contract-management.module"
                        ).then(m => m.ContractManagementModule)
            },
            {
                path: "",
                /* canActivate: [UserRouteAccessService],*/
                loadChildren: () =>
                    import(
                        "../../modules/function-management/function-management.module"
                        ).then(m => m.FunctionManagementModule)
            },
            {
                path: "",
                /* canActivate: [UserRouteAccessService],*/
                loadChildren: () =>
                    import(
                        "../../modules/non-function-management/non-function-management.module"
                        ).then(m => m.NonFunctionManagementModule)
            },
            {
                path: "",
                /*canActivate: [UserRouteAccessService],*/
                loadChildren: () =>
                    import("../../modules/outsourcing-plan/outsourcing-plan.module").then(
                        m => m.OutsourcingPlanModule
                    )
            },
            {
                path: "report",
                /*canActivate: [UserRouteAccessService],*/
                loadChildren: () =>
                    import("../../modules/report/report.module").then(m => m.ReportModule)
            },
            {
                path: "",
                /*canActivate: [UserRouteAccessService],*/
                loadChildren: () =>
                    import("../../modules/dashboard/dashboard.module").then(
                        m => m.DashboardModule
                    )
            },
            {
                path: "utilities",
                loadChildren: () =>
                    import("../../modules/utilities/utilities.module").then(
                        m => m.UtilitiesModule
                    )
            },
            {
                path: "partner-management",
                loadChildren: () =>
                    import("../../modules/partner-management/partner-management.module").then(
                        m => m.PartnerManagementModule
                    )
            },
            {
                path: "app-param",
                loadChildren: () =>
                    import("../../modules/app-param/app-param.module").then(
                        m => m.AppParamModule
                    )
            },
            {
                path: "read-exel",
                loadChildren: () =>
                    import("../../modules/read-exel/read-exel.module").then(
                        m => m.ReadExelModule
                    )
            },
            {
                path: "ftp-server",
                loadChildren: () =>
                    import("../../modules/ftp-server/ftp-server.module").then(
                        m => m.FtpServerModule
                    )
            },
            {
                path: "exchange-rate",
                loadChildren: () =>
                    import("../../modules/exchange-rate-management/exchange-rate-management.module").then(
                        m => m.ExchangeRateManagementModule
                    )
            },
            {
                path: "currency-management",
                loadChildren: () =>
                    import("../../modules/currency-management/currency-management.module").then(
                        m => m.CurrencyManagementModule
                    )
            },
            {
                path: "service-management",
                loadChildren: () =>
                    import("../../modules/service-management/service-management.module").then(
                        m => m.ServiceManagementModule
                    )
            },
            {
                path: "thread-management",
                loadChildren: () =>
                    import("../../modules/thread-management/thread-management.module").then(
                        m => m.ThreadManagementModule
                    )
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class InvoiceWebapMainRoutingModule {
}
