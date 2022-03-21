import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import "./vendor";
import {InvoiceWebappSharedModule} from "app/shared/shared.module";
import {InvoiceWebappCoreModule} from "app/core/core.module";
import {InvoiceWebappAppRoutingModule} from "./app-routing.module";
// jhipster-needle-angular-add-module-import JHipster will add new module here
import {JhiMainComponent} from "./layouts/main/main.component";
import {NavbarComponent} from "./layouts/navbar/navbar.component";
import {FooterComponent} from "./layouts/footer/footer.component";
import {PageRibbonComponent} from "./layouts/profiles/page-ribbon.component";
import {ActiveMenuDirective} from "./layouts/navbar/active-menu.directive";
import {ErrorComponent} from "./layouts/error/error.component";
import {SidebarComponent} from "app/layouts/sidebar/sidebar.component";
import {AppComponent} from "app/app.component";
import {InvoiceWebappMainModule} from "app/layouts/main/main.module";
import {CustomerManagementModule} from "app/modules/customer-management/customer-management.module";
import {ChartsModule} from "ng2-charts";
// import { CanvasJS  } from 'canvasjs';
import {IConfig, NgxMaskModule} from "ngx-mask";
import {LoginComponent} from "app/login/login.component";

export const options: Partial<IConfig> = {
    thousandSeparator: "."
};

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        InvoiceWebappSharedModule,
        InvoiceWebappCoreModule,
        // InvoiceWebappHomeModule,n
        // jhipster-needle-angular-add-module JHipster will add new module here
        // InvoiceWebappEntityModule,
        InvoiceWebappMainModule,
        InvoiceWebappAppRoutingModule,
        CustomerManagementModule,
        ChartsModule,
        NgxMaskModule.forRoot(options)
    ],
    declarations: [
        AppComponent,
        JhiMainComponent,
        NavbarComponent,
        LoginComponent,
        SidebarComponent,
        ErrorComponent,
        PageRibbonComponent,
        ActiveMenuDirective,
        FooterComponent,
    ],
    exports: [
        ActiveMenuDirective
    ],
    bootstrap: [AppComponent]
})
export class InvoiceWebappAppModule {
}
