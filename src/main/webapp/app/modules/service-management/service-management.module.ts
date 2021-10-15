import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InvoiceWebappSharedModule} from "app/shared/shared.module";
import {ServiceManagementRouting} from "app/modules/service-management/service-management-routing";
import {ServiceManagementFormComponent} from './service-management/service-management-form/service-management-form.component';
import {ServiceManagementComponent} from "app/modules/service-management/service-management/service-management.component";


@NgModule({
    declarations: [ServiceManagementComponent, ServiceManagementFormComponent],
    imports: [
        CommonModule,
        InvoiceWebappSharedModule,
        ServiceManagementRouting
    ],
    entryComponents: [ServiceManagementFormComponent]
})
export class ServiceManagementModule {
}
