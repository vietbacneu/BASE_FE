import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InvoiceWebappSharedModule} from "app/shared/shared.module";
import {ThreadManagementComponent} from './thread-management/thread-management.component';
import {ThreadManagementRouting} from "app/modules/thread-management/thread-management-routing";
import { ViewLogsComponent } from './view-logs/view-logs.component';
import { SettingThreadComponent } from './setting-thread/setting-thread.component';
import { SettingComponent } from './setting/setting.component';
import { SettingTimeComponent } from './setting-time/setting-time.component';
import { SettingEmailComponent } from './setting-email/setting-email.component';
import { SettingFtpComponent } from './setting-ftp/setting-ftp.component';


@NgModule({
    declarations: [ThreadManagementComponent, ViewLogsComponent, SettingThreadComponent, SettingComponent, SettingTimeComponent, SettingEmailComponent, SettingFtpComponent],
    imports: [
        CommonModule,
        InvoiceWebappSharedModule,
        ThreadManagementRouting
    ]
})
export class ThreadManagementModule {
}
