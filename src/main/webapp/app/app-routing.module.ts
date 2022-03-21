import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {errorRoute} from "./layouts/error/error.route";
import {navbarRoute} from "./layouts/navbar/navbar.route";
import {DEBUG_INFO_ENABLED} from "app/app.constants";
import {LoginComponent} from "app/login/login.component";

const LAYOUT_ROUTES = [navbarRoute, ...errorRoute];

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: 'login',
                    component: LoginComponent
                },
                {
                    path: "home",
                    loadChildren: () =>
                        import("./home/home.module").then(m => m.InvoiceWebappHomeModule)
                },
                ...LAYOUT_ROUTES,
            ],
            // { enableTracing: DEBUG_INFO_ENABLED }
            // { useHash: false, enableTracing: DEBUG_INFO_ENABLED }
            {useHash: true}
        )
    ],
    exports: [RouterModule]
})
export class InvoiceWebappAppRoutingModule {
}
