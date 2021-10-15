import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { JhiResolvePagingParams } from "ng-jhipster";
import { VersionManagementComponent } from "app/modules/version-management/version-management.component";
const routes: Routes = [
  {
    path: "version-management",
    component: VersionManagementComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "versionManagement.title",
      url: "version-management"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VersionManagementRoutingModule {}
