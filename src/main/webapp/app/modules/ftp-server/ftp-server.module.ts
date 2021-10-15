import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FtpServerComponent} from './ftp-server/ftp-server.component';
import {FtpServerRouting} from "app/modules/ftp-server/ftp-server-routing";
import { FtpServerFormComponent } from './ftp-server/ftp-server-form/ftp-server-form.component';
import {InvoiceWebappSharedModule} from "app/shared/shared.module";


@NgModule({
    declarations: [FtpServerComponent, FtpServerFormComponent],
    imports: [
        CommonModule,
        InvoiceWebappSharedModule,
        FtpServerRouting
    ],
    entryComponents:[FtpServerFormComponent]
})
export class FtpServerModule {
}
