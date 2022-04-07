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
import {KhachHangComponent} from "app/modules/qlkh-manager/danh-muc/khach-hang/khach-hang.component";
import {BcSanPhamChiPhiComponent} from "app/modules/qlkh-manager/bao-cao/bc-san-pham-chi-phi/bc-san-pham-chi-phi.component";
import {BcSanPhamDanhThuComponent} from "app/modules/qlkh-manager/bao-cao/bc-san-pham-danh-thu/bc-san-pham-danh-thu.component";
import {PhuongThucThanhToanComponent} from "app/modules/qlkh-manager/danh-muc/phuong-thuc-thanh-toan/phuong-thuc-thanh-toan.component";
import {InDonXuatComponent} from "app/modules/qlkh-manager/dl-xuat-hang/xuat-hang/in-don-xuat/in-don-xuat.component";
import {BcHoaDonBanHangComponent} from "app/modules/qlkh-manager/bao-cao/bc-hoa-don-ban-hang/bc-hoa-don-ban-hang.component";
import {BcHoaDonNhapHangComponent} from "app/modules/qlkh-manager/bao-cao/bc-hoa-don-nhap-hang/bc-hoa-don-nhap-hang.component";
import {ChiNhanhCuaHangComponent,} from "app/modules/qlkh-manager/danh-muc/chi-nhanh-cua-hang/chi-nhanh-cua-hang.component";
import {CongNoComponent} from "app/modules/qlkh-manager/cong-no/cong-no.component";

const routes: Routes = [
    {
        path: 'san-pham', component: SanPhamComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    },
    {
        path: 'loai-hang', component: LoaiHangComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    },
    {
        path: 'nha-cung-cap', component: NhaCungCapComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    }, {
        path: 'nhap-hang', component: NhapHangComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    }, {
        path: 'san-pham-da-nhap', component: SanPhamDaNhapComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    }, {
        path: 'xuat-hang', component: XuatHangComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    },
    {
        path: 'cong-no', component: CongNoComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    },
    {
        path: 'thanh-toan-cong-no', component: SanPhamDaXuatComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    }, {
        path: 'du-lieu-kho-hang', component: DuLieuKhoHangComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    }, {
        path: 'nhan-vien', component: ChiNhanhCuaHangComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    }, {
        path: 'khach-hang', component: KhachHangComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    }, {
        path: 'bc-san-pham-chi-phi', component: BcSanPhamChiPhiComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    }, {
        path: 'bc-san-pham-doanh-thu', component: BcSanPhamDanhThuComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    }, {
        path: 'phuong-thuc-thanh-toan', component: PhuongThucThanhToanComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    }, {
        path: 'in-don-xuat', component: InDonXuatComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    }, {
        path: 'bc-hoa-don-ban', component: BcHoaDonBanHangComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    },
    {
        path: 'bc-hoa-don-nhap', component: BcHoaDonNhapHangComponent,
        data: {
            pageTitle: "common.appParamBH",
        }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QlkhManagerRoutingModule {
}
