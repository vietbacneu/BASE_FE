import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { JhiResolvePagingParams } from "ng-jhipster";
import { NonFunctionManagementComponent } from "app/modules/non-function-management/non-function-management.component";

const routes: Routes = [
  {
    path: "non-function-management",
    component: NonFunctionManagementComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "nonFunctionManagement.nonFunctionManagement",
      url: "/non-fuction-management"
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonFunctionManagementRouting {}
