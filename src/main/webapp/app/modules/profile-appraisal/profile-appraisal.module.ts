import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProfileAppraisalComponent } from "./profile-appraisal/profile-appraisal.component";
import { ProfileAppraisalRoutingModule } from "app/modules/profile-appraisal/profile-appraisal-routing.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { InvoiceWebappSharedModule } from "app/shared/shared.module";
import { AutoThousandPipe } from "../../shared/pipes/auto-thousand.pipe";
import { ImportExcelComponent } from "./profile-appraisal/import-excel/import-excel.component";
import { AddProfileAppraisalComponent } from "app/modules/profile-appraisal/add-profile-appraisal/add-profile-appraisal.component";
import { ProfileAppraisalHistoryComponent } from "app/modules/profile-appraisal/profile-appraisal-history/profile-appraisal-history.component";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [
    ProfileAppraisalComponent,
    AddProfileAppraisalComponent,
    AutoThousandPipe,
    ImportExcelComponent,
    ProfileAppraisalHistoryComponent
  ],
  imports: [
    CommonModule,
    ProfileAppraisalRoutingModule,
    PerfectScrollbarModule,
    InvoiceWebappSharedModule,
    ModalModule.forRoot()
  ],
  exports: [],
  entryComponents: [ImportExcelComponent, ProfileAppraisalHistoryComponent]
})
export class ProfileAppraisalModule {}
