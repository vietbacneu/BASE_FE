import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfileAppraisalComponent } from "app/modules/profile-appraisal/profile-appraisal/profile-appraisal.component";
import { JhiResolvePagingParams } from "ng-jhipster";
import { AddProfileAppraisalComponent } from "app/modules/profile-appraisal/add-profile-appraisal/add-profile-appraisal.component";

const routes: Routes = [
  {
    path: "profile-appraisal",
    component: ProfileAppraisalComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "profileAppraisal.title",
      url: "/profile-appraisal"
    }
  },
  {
    path: "profile-appraisal-add",
    component: AddProfileAppraisalComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "profileAppraisal.titleAdd",
      url: "/profile-appraisal-add"
    },
    children: [
      {
        path: ":id",
        component: AddProfileAppraisalComponent,
        canActivate: [],
        resolve: {
          pagingParams: JhiResolvePagingParams
        },
        data: {
          defaultSort: "id,asc",
          pageTitle: "",
          url: "/profile-appraisal-add"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileAppraisalRoutingModule {}
