import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AppParamComponent} from "app/modules/app-param/app-param/app-param.component";

const routes: Routes = [
    {
        path: '', component: AppParamComponent,
        data: {
            pageTitle: "common.appParam",
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppParamRouting {
}
