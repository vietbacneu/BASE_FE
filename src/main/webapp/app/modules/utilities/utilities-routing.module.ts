import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { JhiResolvePagingParams } from "ng-jhipster";
import { CheckProfileAppraisalComponent } from "app/modules/utilities/check-profile-appraisal/check-profile-appraisal.component";
const routes: Routes = [
  {
    path: "check-ulnl",
    component: CheckProfileAppraisalComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "utilities.title",
      url: "utilities/check-ulnl"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilitiesRoutingModule {}
