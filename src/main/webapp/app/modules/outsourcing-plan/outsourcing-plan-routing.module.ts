import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { JhiResolvePagingParams } from "ng-jhipster";
import { OutsourcingPlanComponent } from "app/modules/outsourcing-plan/outsourcing-plan.component";
import { OutsourcingPlanAddComponent } from "app/modules/outsourcing-plan/outsourcing-plan-add/outsourcing-plan-add.component";
import { OutsourcingPlanUpdateComponent } from "app/modules/outsourcing-plan/outsourcing-plan-update/outsourcing-plan-update.component";

const routes: Routes = [
  {
    path: "outsourcing-plan",
    component: OutsourcingPlanComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "outsourcingPlan.title",
      url: "/outsourcing-plan"
    }
  },
  {
    path: "outsourcing-plan-add",
    component: OutsourcingPlanAddComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      // pageTitle: 'outsourcingPlan.title-detail',
      url: "/outsourcing-plan-add"
    }
  },
  {
    path: "outsourcing-plan-update",
    component: OutsourcingPlanUpdateComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      // pageTitle: 'outsourcingPlan.function.add',
      url: "/outsourcing-plan-update"
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutsourcingPlanRouting {}
