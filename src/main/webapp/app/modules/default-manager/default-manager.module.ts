import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultManagerRoutingModule } from './default-manager-routing.module';
import { QuanLyKhoHangComponent } from './quan-ly-kho-hang/quan-ly-kho-hang.component';
import { QuanLyNhapHangComponent } from './quan-ly-nhap-hang/quan-ly-nhap-hang.component';
import { QuanLyXuatHangComponent } from './quan-ly-xuat-hang/quan-ly-xuat-hang.component';
import { BaoCaoComponent } from './bao-cao/bao-cao.component';
import { XuatHangComponent } from './quan-ly-xuat-hang/xuat-hang/xuat-hang.component';
import { LichSuXuatHangComponent } from './quan-ly-xuat-hang/lich-su-xuat-hang/lich-su-xuat-hang.component';
import { NhapHangComponent } from './quan-ly-nhap-hang/nhap-hang/nhap-hang.component';
import { LichSuNhapComponent } from './quan-ly-nhap-hang/lich-su-nhap/lich-su-nhap.component';
import { ThongTinNCCComponent } from './quan-ly-nhap-hang/thong-tin-ncc/thong-tin-ncc.component';
import { SanPhamComponent } from './quan-ly-kho-hang/san-pham/san-pham.component';
import { HangTonKhoComponent } from './quan-ly-kho-hang/hang-ton-kho/hang-ton-kho.component';
import { BaoCaoHangBanChayComponent } from './bao-cao/bao-cao-hang-ban-chay/bao-cao-hang-ban-chay.component';
import { BaoCaoHangTonComponent } from './bao-cao/bao-cao-hang-ton/bao-cao-hang-ton.component';


@NgModule({
  declarations: [QuanLyKhoHangComponent, QuanLyNhapHangComponent, QuanLyXuatHangComponent, BaoCaoComponent, XuatHangComponent, LichSuXuatHangComponent, NhapHangComponent, LichSuNhapComponent, ThongTinNCCComponent, SanPhamComponent, HangTonKhoComponent, BaoCaoHangBanChayComponent, BaoCaoHangTonComponent],
  imports: [
    CommonModule,
    DefaultManagerRoutingModule
  ]
})
export class DefaultManagerModule { }
