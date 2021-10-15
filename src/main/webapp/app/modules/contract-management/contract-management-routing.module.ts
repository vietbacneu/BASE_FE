import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { JhiResolvePagingParams } from "ng-jhipster";
import { ContractManagementComponent } from "app/modules/contract-management/contract-management/contract-management.component";
import { ContractManagementFormComponent } from "app/modules/contract-management/contract-management-form/contract-management-form.component";

const routes: Routes = [
  {
    path: "contract-management",
    component: ContractManagementComponent,
    canActivate: [],
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      defaultSort: "id,asc",
      pageTitle: "contractManagement.contractManagement",
      url: "/contract-management"
    }
  },
  {
    path: "contract-management",
    component: ContractManagementComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      pageTitle: "Quản lý hợp đồng thuê ngoài",
      url: "contract-management"
    }
  },
  /*IIST - LongPC - CREATED 200514*/
  {
    path: "contract-management/create",
    component: ContractManagementFormComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      pageTitle: "contractManagement.titleAdd",
      url: "contract-management/create"
    }
  },
  /*IIST - LongPC - CREATED 200514*/
  {
    path: "contract-management/update",
    component: ContractManagementFormComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      pageTitle: "contractManagement.titleUpdate",
      url: "contract-management/update"
    }
  },
  /*IIST - LongPC - CREATED 200514*/
  {
    path: "contract-management/view",
    component: ContractManagementFormComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      pageTitle: "contractManagement.titleDetail",
      url: "contract-management/view"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractManagementRoutingModule {}
