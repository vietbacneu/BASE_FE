import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QlnsManagerRoutingModule} from './qlns-manager-routing.module';
import {NhanVienComponent} from './thong-tin-chung/nhan-vien/nhan-vien.component';
import {ThemSuaNhanVienComponent} from './thong-tin-chung/nhan-vien/them-sua-nhan-vien/them-sua-nhan-vien.component';
import {InvoiceWebappSharedModule} from "app/shared/shared.module";
import {BaoHiemNhanVienComponent} from './thong-tin-chung/bao-hiem-nhan-vien/bao-hiem-nhan-vien.component';
import {ChucVuComponent} from './thong-tin-chung/chuc-vu/chuc-vu.component';
import {PhongBanComponent} from './thong-tin-chung/phong-ban/phong-ban.component';
import {DanhMucKyLuatComponent} from './thong-tin-chung/danh-muc-ky-luat/danh-muc-ky-luat.component';
import {DanhMucKhenThuongComponent} from './thong-tin-chung/danh-muc-khen-thuong/danh-muc-khen-thuong.component';
import {LuongNhanVienComponent} from './luong-vs-bao-cao/luong-nhan-vien/luong-nhan-vien.component';
import {ChamCongNhanVienComponent} from './luong-vs-bao-cao/cham-cong-nhan-vien/cham-cong-nhan-vien.component';
import {BaoCaoDanhGiaNhanVienComponent} from './luong-vs-bao-cao/bao-cao-danh-gia-nhan-vien/bao-cao-danh-gia-nhan-vien.component';
import {BaoCaoThongTinNhanVienComponent} from './luong-vs-bao-cao/bao-cao-thong-tin-nhan-vien/bao-cao-thong-tin-nhan-vien.component';
import {BaoCaoLuongNhanVienComponent} from './luong-vs-bao-cao/bao-cao-luong-nhan-vien/bao-cao-luong-nhan-vien.component';
import { ChiTietLuongNhanVienComponent } from './luong-vs-bao-cao/luong-nhan-vien/chi-tiet-luong-nhan-vien/chi-tiet-luong-nhan-vien.component';
import { ThemSuaChamCongNhanVienComponent } from './luong-vs-bao-cao/cham-cong-nhan-vien/them-sua-cham-cong-nhan-vien/them-sua-cham-cong-nhan-vien.component';
import { ThemSuaBaoHiemNhanVienComponent } from './thong-tin-chung/bao-hiem-nhan-vien/them-sua-bao-hiem-nhan-vien/them-sua-bao-hiem-nhan-vien.component';
import { ThemSuaChucVuComponent } from './thong-tin-chung/chuc-vu/them-sua-chuc-vu/them-sua-chuc-vu.component';
import { ThemSuaPhongBanComponent } from './thong-tin-chung/phong-ban/them-sua-phong-ban/them-sua-phong-ban.component';
import { ThemSuaKhenThuongComponent } from './thong-tin-chung/danh-muc-khen-thuong/them-sua-khen-thuong/them-sua-khen-thuong.component';
import { ThemSuaKyLuatComponent } from './thong-tin-chung/danh-muc-ky-luat/them-sua-ky-luat/them-sua-ky-luat.component';
import { DanhGiaKhenThuongComponent } from './thong-tin-chung/danh-gia-khen-thuong/danh-gia-khen-thuong.component';
import { ThemSuaDanhGiaKhenThuongComponent } from './thong-tin-chung/danh-gia-khen-thuong/them-sua-danh-gia-khen-thuong/them-sua-danh-gia-khen-thuong.component';
import { DanhGiaKyLuatComponent } from './thong-tin-chung/danh-gia-ky-luat/danh-gia-ky-luat.component';
import { ThemSuaDanhKyLuatComponent } from './thong-tin-chung/danh-gia-ky-luat/them-sua-danh-ky-luat/them-sua-danh-ky-luat.component';


@NgModule({
  declarations: [
      NhanVienComponent,
      ThemSuaNhanVienComponent,
      BaoHiemNhanVienComponent,
      ChucVuComponent,
      PhongBanComponent,
      DanhMucKyLuatComponent,
      DanhMucKhenThuongComponent,
      LuongNhanVienComponent,
      ChamCongNhanVienComponent,
      BaoCaoDanhGiaNhanVienComponent,
      BaoCaoThongTinNhanVienComponent,
      BaoCaoLuongNhanVienComponent,
      ChiTietLuongNhanVienComponent,
      ThemSuaChamCongNhanVienComponent,
      ThemSuaBaoHiemNhanVienComponent,
      ThemSuaChucVuComponent,
      ThemSuaPhongBanComponent,
      ThemSuaKhenThuongComponent,
      ThemSuaKyLuatComponent,
      DanhGiaKhenThuongComponent,
      ThemSuaDanhGiaKhenThuongComponent,
      DanhGiaKyLuatComponent,
      ThemSuaDanhKyLuatComponent,
  ],
    imports: [
        CommonModule,
        QlnsManagerRoutingModule,
        InvoiceWebappSharedModule
    ],
    entryComponents: [
        ThemSuaNhanVienComponent,
        ChiTietLuongNhanVienComponent,
        ThemSuaChamCongNhanVienComponent,
        ThemSuaBaoHiemNhanVienComponent,
        ThemSuaChucVuComponent,
        ThemSuaPhongBanComponent,
        ThemSuaKhenThuongComponent,
        ThemSuaKyLuatComponent,
        ThemSuaDanhGiaKhenThuongComponent,
        ThemSuaDanhKyLuatComponent,
    ]
})
export class QlnsManagerModule { }
