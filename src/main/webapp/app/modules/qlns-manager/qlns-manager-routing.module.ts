import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NhanVienComponent} from "app/modules/qlns-manager/thong-tin-chung/nhan-vien/nhan-vien.component";

const routes: Routes = [
  {
    path: 'nhan-vien', component: NhanVienComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QlnsManagerRoutingModule { }
