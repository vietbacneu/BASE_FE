import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { JhiResolvePagingParams } from "ng-jhipster";
import { DashboardComponent } from "app/modules/dashboard/dashboard.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "dashboard.title",
      url: "/dashboard"
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
