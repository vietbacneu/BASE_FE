import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { JhiResolvePagingParams } from "ng-jhipster";
import { FunctionEffortComponent } from "app/modules/function-effort/function-effort.component";
const routes: Routes = [
  {
    path: "function-effort",
    component: FunctionEffortComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "user.title",
      url: "function-effort"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FunctionEffortRoutingModule {}
