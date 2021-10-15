import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ThreadManagementComponent} from "app/modules/thread-management/thread-management/thread-management.component";
import {SettingThreadComponent} from "app/modules/thread-management/setting-thread/setting-thread.component";
import {ViewLogsComponent} from "app/modules/thread-management/view-logs/view-logs.component";
import {SettingTimeComponent} from "./setting-time/setting-time.component";

const routes: Routes = [
    {
        path: '', component: ThreadManagementComponent,
        data: {
            pageTitle: "partner.threadManagement",
        }
    },
    {
        path: 'settings', component: SettingThreadComponent,
        data: {
            pageTitle: "partner.threadManagement",
        }
    },
    {
        path: 'viewLog/:id', component: ViewLogsComponent,
        data: {
            pageTitle: "partner.threadManagement",
        }

    },
    {
        path: 'setting-time', component: SettingTimeComponent,
        data: {
            pageTitle: "partner.threadManagement",
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ThreadManagementRouting {
}
