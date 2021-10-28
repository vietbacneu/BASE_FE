import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SanPhamComponent} from "app/modules/qlkh-manager/danh-muc/san-pham/san-pham.component";
import {LoaiHangComponent} from "app/modules/qlkh-manager/danh-muc/loai-hang/loai-hang.component";
import {NhaCungCapComponent} from "app/modules/qlkh-manager/danh-muc/nha-cung-cap/nha-cung-cap.component";
import {NhapHangComponent} from "app/modules/qlkh-manager/dl-nhap-hang/nhap-hang/nhap-hang.component";
import {SanPhamDaNhapComponent} from "app/modules/qlkh-manager/dl-nhap-hang/san-pham-da-nhap/san-pham-da-nhap.component";
import {XuatHangComponent} from "app/modules/qlkh-manager/dl-xuat-hang/xuat-hang/xuat-hang.component";
import {SanPhamDaXuatComponent} from "app/modules/qlkh-manager/dl-xuat-hang/san-pham-da-xuat/san-pham-da-xuat.component";
import {DuLieuKhoHangComponent} from "app/modules/qlkh-manager/du-lieu-kho-hang/du-lieu-kho-hang.component";

const routes: Routes = [
  {
    path: 'san-pham', component: SanPhamComponent,
    data: {
      pageTitle: "common.appParam",
    }
  },
  {
    path: 'loai-hang', component: LoaiHangComponent,
    data: {
      pageTitle: "common.appParam",
    }
  },
  {
    path: 'nha-cung-cap', component: NhaCungCapComponent,
    data: {
      pageTitle: "common.appParam",
    }
  },{
    path: 'nhap-hang', component: NhapHangComponent,
    data: {
      pageTitle: "common.appParam",
    }
  },{
    path: 'san-pham-da-nhap', component: SanPhamDaNhapComponent,
    data: {
      pageTitle: "common.appParam",
    }
  },{
    path: 'xuat-hang', component: XuatHangComponent,
    data: {
      pageTitle: "common.appParam",
    }
  },{
    path: 'san-pham-da-xuat', component: SanPhamDaXuatComponent,
    data: {
      pageTitle: "common.appParam",
    }
  },{
    path: 'du-lieu-kho-hang', component: DuLieuKhoHangComponent,
    data: {
      pageTitle: "common.appParam",
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QlkhManagerRoutingModule { }
