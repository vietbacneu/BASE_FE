import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {FtpServerComponent} from "app/modules/ftp-server/ftp-server/ftp-server.component";

const routes: Routes = [
    {
        path: '', component: FtpServerComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FtpServerRouting {
}
