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
    ],
    imports: [
        CommonModule,
        InvoiceWebappSharedModule,
        QlkhManagerRoutingModule
    ],
    entryComponents: [
        ThemSuaLoaiHangComponent,
        ThemSuaSanPhamComponent,
        ThemSuaNhaCungCapComponent,
        ThemSuaNhapHangComponent,
        ChiTietDonNhapComponent,
    ]
})
export class QlkhManagerModule {
}
