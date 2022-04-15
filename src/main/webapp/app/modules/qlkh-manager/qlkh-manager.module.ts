import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QlkhManagerRoutingModule} from './qlkh-manager-routing.module';
import {SanPhamComponent} from './danh-muc/san-pham/san-pham.component';
import {LoaiHangComponent} from './danh-muc/loai-hang/loai-hang.component';
import {InvoiceWebappSharedModule} from "app/shared/shared.module";
import {NhaCungCapComponent} from './danh-muc/nha-cung-cap/nha-cung-cap.component';
import {ThemSuaLoaiHangComponent} from './danh-muc/loai-hang/them-sua-loai-hang/them-sua-loai-hang.component';
import {ThemSuaSanPhamComponent} from './danh-muc/san-pham/them-sua-san-pham/them-sua-san-pham.component';
import { ThemSuaNhaCungCapComponent } from './danh-muc/nha-cung-cap/them-sua-nha-cung-cap/them-sua-nha-cung-cap.component';
import { NhapHangComponent } from './dl-nhap-hang/nhap-hang/nhap-hang.component';
import { SanPhamDaNhapComponent } from './dl-nhap-hang/san-pham-da-nhap/san-pham-da-nhap.component';
import { ThemSuaNhapHangComponent } from './dl-nhap-hang/nhap-hang/them-sua-nhap-hang/them-sua-nhap-hang.component';
import { ChiTietDonNhapComponent } from './dl-nhap-hang/nhap-hang/them-sua-nhap-hang/chi-tiet-don-nhap/chi-tiet-don-nhap.component';
import { XuatHangComponent } from './dl-xuat-hang/xuat-hang/xuat-hang.component';
import { SanPhamDaXuatComponent } from './dl-xuat-hang/san-pham-da-xuat/san-pham-da-xuat.component';
import { ThemSuaXuatHangComponent } from './dl-xuat-hang/xuat-hang/them-sua-xuat-hang/them-sua-xuat-hang.component';
import { ChiTietDonXuatComponent } from './dl-xuat-hang/xuat-hang/them-sua-xuat-hang/chi-tiet-don-xuat/chi-tiet-don-xuat.component';
import { DuLieuKhoHangComponent } from './du-lieu-kho-hang/du-lieu-kho-hang.component';
import { ChiNhanhCuaHangComponent } from './danh-muc/chi-nhanh-cua-hang/chi-nhanh-cua-hang.component';
import { KhachHangComponent } from './danh-muc/khach-hang/khach-hang.component';
import { ThemSuaChiNhanhComponent } from './danh-muc/chi-nhanh-cua-hang/them-sua-chi-nhanh/them-sua-chi-nhanh.component';
import { ThemSuaKhachHangComponent } from './danh-muc/khach-hang/them-sua-khach-hang/them-sua-khach-hang.component';
import { BcSanPhamDanhThuComponent } from './bao-cao/bc-san-pham-danh-thu/bc-san-pham-danh-thu.component';
import { BcSanPhamChiPhiComponent } from './bao-cao/bc-san-pham-chi-phi/bc-san-pham-chi-phi.component';
import { PhuongThucThanhToanComponent } from './danh-muc/phuong-thuc-thanh-toan/phuong-thuc-thanh-toan.component';
import { ThemSuaPhuongThucThanhToanComponent } from './danh-muc/phuong-thuc-thanh-toan/them-sua-phuong-thuc-thanh-toan/them-sua-phuong-thuc-thanh-toan.component';
import { InDonXuatComponent } from './dl-xuat-hang/xuat-hang/in-don-xuat/in-don-xuat.component';
import { InNhapHangComponent } from './dl-nhap-hang/nhap-hang/in-nhap-hang/in-nhap-hang.component';
import { BcHoaDonBanHangComponent } from './bao-cao/bc-hoa-don-ban-hang/bc-hoa-don-ban-hang.component';
import { BcHoaDonNhapHangComponent } from './bao-cao/bc-hoa-don-nhap-hang/bc-hoa-don-nhap-hang.component';
import { CongNoComponent } from './cong-no/cong-no.component';
import { ThemSuaCongNoComponent } from './cong-no/them-sua-cong-no/them-sua-cong-no.component';
import { ChiTietCongNoComponent } from './cong-no/chi-tiet-cong-no/chi-tiet-cong-no.component';
import { InCongNoComponent } from './cong-no/in-cong-no/in-cong-no.component';


@NgModule({
    declarations: [
        SanPhamComponent,
        LoaiHangComponent,
        NhaCungCapComponent,
        ThemSuaLoaiHangComponent,
        ThemSuaSanPhamComponent,
        ThemSuaNhaCungCapComponent,
        NhapHangComponent,
        SanPhamDaNhapComponent,
        ThemSuaNhapHangComponent,
        ChiTietDonNhapComponent,
        XuatHangComponent,
        SanPhamDaXuatComponent,
        ThemSuaXuatHangComponent,
        ChiTietDonXuatComponent,
        DuLieuKhoHangComponent,
        ChiNhanhCuaHangComponent,
        KhachHangComponent,
        ThemSuaChiNhanhComponent,
        ThemSuaKhachHangComponent,
        BcSanPhamDanhThuComponent,
        BcSanPhamChiPhiComponent,
        PhuongThucThanhToanComponent,
        ThemSuaPhuongThucThanhToanComponent,
        InDonXuatComponent,
        InNhapHangComponent,
        BcHoaDonBanHangComponent,
        BcHoaDonNhapHangComponent,
        CongNoComponent,
        ThemSuaCongNoComponent,
        ChiTietCongNoComponent,
        InCongNoComponent,
    ],
    imports: [
        CommonModule,
        InvoiceWebappSharedModule,
        QlkhManagerRoutingModule
    ],
    entryComponents: [
        InCongNoComponent,
        ThemSuaLoaiHangComponent,
        ThemSuaSanPhamComponent,
        ThemSuaNhaCungCapComponent,
        ThemSuaNhapHangComponent,
        ChiTietDonNhapComponent,
        ThemSuaXuatHangComponent,
        ChiTietDonXuatComponent,
        ThemSuaChiNhanhComponent,
        ThemSuaKhachHangComponent,
        InDonXuatComponent,
        InNhapHangComponent,
        ThemSuaPhuongThucThanhToanComponent,
        ThemSuaCongNoComponent,
        ChiTietCongNoComponent,
    ]
})
export class QlkhManagerModule {
}
