import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NhanVienComponent} from "app/modules/qlns-manager/thong-tin-chung/nhan-vien/nhan-vien.component";
import {BaoHiemNhanVienComponent} from "app/modules/qlns-manager/thong-tin-chung/bao-hiem-nhan-vien/bao-hiem-nhan-vien.component";
import {ChucVuComponent} from "app/modules/qlns-manager/thong-tin-chung/chuc-vu/chuc-vu.component";
import {PhongBanComponent} from "app/modules/qlns-manager/thong-tin-chung/phong-ban/phong-ban.component";
import {DanhMucKyLuatComponent} from "app/modules/qlns-manager/thong-tin-chung/danh-muc-ky-luat/danh-muc-ky-luat.component";
import {DanhMucKhenThuongComponent} from "app/modules/qlns-manager/thong-tin-chung/danh-muc-khen-thuong/danh-muc-khen-thuong.component";
import {BaoCaoThongTinNhanVienComponent} from "app/modules/qlns-manager/luong-vs-bao-cao/bao-cao-thong-tin-nhan-vien/bao-cao-thong-tin-nhan-vien.component";
import {BaoCaoLuongNhanVienComponent} from "app/modules/qlns-manager/luong-vs-bao-cao/bao-cao-luong-nhan-vien/bao-cao-luong-nhan-vien.component";
import {BaoCaoDanhGiaNhanVienComponent} from "app/modules/qlns-manager/luong-vs-bao-cao/bao-cao-danh-gia-nhan-vien/bao-cao-danh-gia-nhan-vien.component";
import {ChamCongNhanVienComponent} from "app/modules/qlns-manager/luong-vs-bao-cao/cham-cong-nhan-vien/cham-cong-nhan-vien.component";
import {LuongNhanVienComponent} from "app/modules/qlns-manager/luong-vs-bao-cao/luong-nhan-vien/luong-nhan-vien.component";
import {DanhGiaKhenThuongComponent} from "app/modules/qlns-manager/thong-tin-chung/danh-gia-khen-thuong/danh-gia-khen-thuong.component";
import {DanhGiaKyLuatComponent} from "app/modules/qlns-manager/thong-tin-chung/danh-gia-ky-luat/danh-gia-ky-luat.component";
import {DanhMucBaoHiemComponent} from "app/modules/qlns-manager/thong-tin-chung/danh-muc-bao-hiem/danh-muc-bao-hiem.component";
import {TroCapComponent} from "app/modules/qlns-manager/thong-tin-chung/tro-cap/tro-cap.component";
import {NhanVienTroCapComponent} from "app/modules/qlns-manager/thong-tin-chung/nhan-vien-tro-cap/nhan-vien-tro-cap.component";

const routes: Routes = [
  {
    path: 'nhan-vien', component: NhanVienComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },{
    path: 'danh-gia-nhan-vien', component: DanhGiaKhenThuongComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },
  {
    path: 'tro-cap', component: TroCapComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  }
  ,
  {
    path: 'tro-cap-nhan-vien', component: NhanVienTroCapComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  }
  ,
  {
    path: 'danh-gia-ky-luat', component: DanhGiaKyLuatComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },{
    path: 'bao-hiem-nhan-vien', component: BaoHiemNhanVienComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },{
    path: 'chuc-vu', component: ChucVuComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },{
    path: 'phong-ban', component: PhongBanComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },{
    path: 'bao-hiem', component: DanhMucBaoHiemComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },{
    path: 'danh-muc-ky-luat', component: DanhMucKyLuatComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },{
    path: 'danh-muc-danh-gia', component: DanhMucKhenThuongComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },{
    path: 'luong-nhan-vien', component: LuongNhanVienComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },{
    path: 'cham-cong-nhan-vien', component: ChamCongNhanVienComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },{
    path: 'bc-danh-gia-nhan-vien', component: BaoCaoDanhGiaNhanVienComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },{
    path: 'bc-luong-nhan-vien', component: BaoCaoLuongNhanVienComponent,
    data: {
      pageTitle: "common.appParamNS",
    }
  },{
    path: 'bc-thong-tin-nhan-vien', component: BaoCaoThongTinNhanVienComponent,
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
