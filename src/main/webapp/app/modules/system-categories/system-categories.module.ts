import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrganizationCategoriesComponent } from "./organization-categories/organization-categories.component";
import { UserGroupCategoriesComponent } from "./user-group-categories/user-group-categories.component";
import { DataCategoriesComponent } from "./data-categories/data-categories.component";
import { SystemCategoriesRoutingModule } from "app/modules/system-categories/system-categories-routing.module";
import { InvoiceWebappSharedModule } from "app/shared/shared.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { OrganizationCategoriesAddComponent } from "./organization-categories/organization-categories-add/organization-categories-add.component";
import { CreateDataCategoryComponent } from "./data-categories/create-data-category/create-data-category.component";
import { AddUserComponent } from "app/modules/system-categories/user-group-categories/add-user/add-user.component";
import { UserGroupAddComponent } from "./user-group-categories/user-group-add/user-group-add.component";
import { ImportExcelComponent } from "app/modules/system-categories/import-excel/import-excel.component";
import { SafePipe } from "app/modules/system-categories/import-excel/Safe.pipe";
import { SysUserAddComponent } from "app/modules/system-categories/sys-user/sys-user-add/sys-user-add.component";
import { SysUserComponent } from "app/modules/system-categories/sys-user/sys-user.component";
import { UserGroupAuthComponent } from "app/modules/system-categories/user-group-categories/user-group-auth/user-group-auth.component";
import { ImportExcelOutsourcingPlanComponent } from "../outsourcing-plan/import-excel-outsourcing-plan/import-excel-outsourcing-plan.component";

@NgModule({
  declarations: [
    OrganizationCategoriesComponent,
    UserGroupCategoriesComponent,
    DataCategoriesComponent,
    OrganizationCategoriesAddComponent,
    CreateDataCategoryComponent,
    AddUserComponent,
    UserGroupAddComponent,
    ImportExcelComponent,
    SafePipe,
    SysUserComponent,
    SysUserAddComponent,
    UserGroupAuthComponent
  ],
  imports: [
    CommonModule,
    SystemCategoriesRoutingModule,
    PerfectScrollbarModule,
    InvoiceWebappSharedModule
  ],
  entryComponents: [
    OrganizationCategoriesAddComponent,
    CreateDataCategoryComponent,
    AddUserComponent,
    UserGroupAddComponent,
    SysUserComponent,
    SysUserAddComponent,
    ImportExcelComponent,
    UserGroupAuthComponent
  ]
})
export class SystemCategoriesModule {}
