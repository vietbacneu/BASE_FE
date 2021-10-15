import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ReadExelComponent} from "app/modules/read-exel/read-exel/read-exel.component";

const routes: Routes = [
    {
        path: '', component: ReadExelComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReadExelRouting {
}
