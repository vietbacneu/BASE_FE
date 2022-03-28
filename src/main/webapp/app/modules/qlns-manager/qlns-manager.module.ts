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
import {ChiTietLuongNhanVienComponent} from './luong-vs-bao-cao/luong-nhan-vien/chi-tiet-luong-nhan-vien/chi-tiet-luong-nhan-vien.component';
import {ThemSuaChamCongNhanVienComponent} from './luong-vs-bao-cao/cham-cong-nhan-vien/them-sua-cham-cong-nhan-vien/them-sua-cham-cong-nhan-vien.component';
import {ThemSuaBaoHiemNhanVienComponent} from './thong-tin-chung/bao-hiem-nhan-vien/them-sua-bao-hiem-nhan-vien/them-sua-bao-hiem-nhan-vien.component';
import {ThemSuaChucVuComponent} from './thong-tin-chung/chuc-vu/them-sua-chuc-vu/them-sua-chuc-vu.component';
import {ThemSuaPhongBanComponent} from './thong-tin-chung/phong-ban/them-sua-phong-ban/them-sua-phong-ban.component';
import {ThemSuaKhenThuongComponent} from './thong-tin-chung/danh-muc-khen-thuong/them-sua-khen-thuong/them-sua-khen-thuong.component';
import {ThemSuaKyLuatComponent} from './thong-tin-chung/danh-muc-ky-luat/them-sua-ky-luat/them-sua-ky-luat.component';
import {DanhGiaKhenThuongComponent} from './thong-tin-chung/danh-gia-khen-thuong/danh-gia-khen-thuong.component';
import {ThemSuaDanhGiaKhenThuongComponent} from './thong-tin-chung/danh-gia-khen-thuong/them-sua-danh-gia-khen-thuong/them-sua-danh-gia-khen-thuong.component';
import {DanhGiaKyLuatComponent} from './thong-tin-chung/danh-gia-ky-luat/danh-gia-ky-luat.component';
import {ThemSuaDanhKyLuatComponent} from './thong-tin-chung/danh-gia-ky-luat/them-sua-danh-ky-luat/them-sua-danh-ky-luat.component';
import {DanhMucBaoHiemComponent} from './thong-tin-chung/danh-muc-bao-hiem/danh-muc-bao-hiem.component';
import {ThemSuaDanhMucBaoHiemComponent} from './thong-tin-chung/danh-muc-bao-hiem/them-sua-danh-muc-bao-hiem/them-sua-danh-muc-bao-hiem.component';
import {TroCapComponent} from './thong-tin-chung/tro-cap/tro-cap.component';
import {ThemSuaTroCapComponent} from './thong-tin-chung/tro-cap/them-sua-tro-cap/them-sua-tro-cap.component';
import {NhanVienTroCapComponent} from './thong-tin-chung/nhan-vien-tro-cap/nhan-vien-tro-cap.component';
import {ThemSuaNvTroCapComponent} from './thong-tin-chung/nhan-vien-tro-cap/them-sua-nv-tro-cap/them-sua-nv-tro-cap.component';


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
        DanhMucBaoHiemComponent,
        ThemSuaDanhMucBaoHiemComponent,
        TroCapComponent,
        ThemSuaTroCapComponent,
        NhanVienTroCapComponent,
        ThemSuaNvTroCapComponent
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
        ThemSuaDanhMucBaoHiemComponent,
        ThemSuaNvTroCapComponent,
        ThemSuaTroCapComponent

    ]
})
export class QlnsManagerModule {
}
