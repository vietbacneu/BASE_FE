import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {QlnsManagerRoutingModule} from './qlns-manager-routing.module';
import {NhanVienComponent} from './thong-tin-chung/nhan-vien/nhan-vien.component';
import {ThemSuaNhanVienComponent} from './thong-tin-chung/nhan-vien/them-sua-nhan-vien/them-sua-nhan-vien.component';
import {InvoiceWebappSharedModule} from "app/shared/shared.module";


@NgModule({
  declarations: [
      NhanVienComponent,
      ThemSuaNhanVienComponent
  ],
    imports: [
        CommonModule,
        QlnsManagerRoutingModule,
        InvoiceWebappSharedModule
    ],
    entryComponents: [
        ThemSuaNhanVienComponent,
    ]
})
export class QlnsManagerModule { }
