import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QlkhManagerRoutingModule} from './qlkh-manager-routing.module';
import {SanPhamComponent} from './danh-muc/san-pham/san-pham.component';
import {LoaiHangComponent} from './danh-muc/loai-hang/loai-hang.component';
import {InvoiceWebappSharedModule} from "app/shared/shared.module";
import {NhaCungCapComponent} from './danh-muc/nha-cung-cap/nha-cung-cap.component';
import {ThemSuaLoaiHangComponent} from './danh-muc/loai-hang/them-sua-loai-hang/them-sua-loai-hang.component';
import {ThemSuaSanPhamComponent} from './danh-muc/san-pham/them-sua-san-pham/them-sua-san-pham.component';


@NgModule({
    declarations: [
        SanPhamComponent,
        LoaiHangComponent,
        NhaCungCapComponent,
        ThemSuaLoaiHangComponent,
        ThemSuaSanPhamComponent,
    ],
    imports: [
        CommonModule,
        InvoiceWebappSharedModule,
        QlkhManagerRoutingModule
    ],
    entryComponents: [
        ThemSuaLoaiHangComponent,
        ThemSuaSanPhamComponent
    ]
})
export class QlkhManagerModule {
}
