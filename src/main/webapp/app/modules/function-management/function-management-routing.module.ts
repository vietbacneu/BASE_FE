import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { JhiResolvePagingParams } from "ng-jhipster";
import { FunctionManagementComponent } from "app/modules/function-management/function-management.component";

const routes: Routes = [
  {
    path: "function-management",
    component: FunctionManagementComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "functionManagement.functionManagement",
      url: "/fuction-management"
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FunctionManagementRouting {}
