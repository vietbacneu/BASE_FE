import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SanPhamComponent} from "app/modules/qlkh-manager/danh-muc/san-pham/san-pham.component";
import {LoaiHangComponent} from "app/modules/qlkh-manager/danh-muc/loai-hang/loai-hang.component";
import {NhaCungCapComponent} from "app/modules/qlkh-manager/danh-muc/nha-cung-cap/nha-cung-cap.component";

const routes: Routes = [
  {
    path: 'san-pham', component: SanPhamComponent,
    data: {
      pageTitle: "partner.appParam",
    }
  },
  {
    path: 'loai-hang', component: LoaiHangComponent,
    data: {
      pageTitle: "partner.appParam",
    }
  },
  {
    path: 'nha-cung-cap', component: NhaCungCapComponent,
    data: {
      pageTitle: "partner.appParam",
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QlkhManagerRoutingModule { }
