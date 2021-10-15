import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InvoiceWebappSharedModule} from "app/shared/shared.module";
import {AppParamComponent} from './app-param/app-param.component';
import {AppParamRouting} from "app/modules/app-param/app-param-routing";
import {AppParamFormComponent} from './app-param/app-param-form/app-param-form.component';


@NgModule({
    declarations: [AppParamComponent, AppParamFormComponent],
    imports: [
        CommonModule,
        InvoiceWebappSharedModule,
        AppParamRouting
    ],
    entryComponents: [AppParamFormComponent]
})
export class AppParamModule {
}
