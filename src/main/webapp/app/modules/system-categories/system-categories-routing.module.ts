import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { JhiResolvePagingParams } from "ng-jhipster";
import { OrganizationCategoriesComponent } from "app/modules/system-categories/organization-categories/organization-categories.component";
import { UserGroupCategoriesComponent } from "app/modules/system-categories/user-group-categories/user-group-categories.component";
import { DataCategoriesComponent } from "app/modules/system-categories/data-categories/data-categories.component";
import { SysUserComponent } from "app/modules/system-categories/sys-user/sys-user.component";
const routes: Routes = [
  {
    path: "organization-categories",
    component: OrganizationCategoriesComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "organizationCategories.title",
      url: "system-categories/organization-categories"
    }
  },
  {
    path: "user-group-categories",
    component: UserGroupCategoriesComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "userGroup.title",
      url: "system-categories/user-group-categories"
    }
  },
  {
    path: "data-categories",
    component: DataCategoriesComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "dataCategories.webTitle",
      url: "system-categories/data-categories"
    }
  },
  {
    path: "sys-user",
    component: SysUserComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "user.title",
      url: "system-categories/sys-user"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemCategoriesRoutingModule {}
