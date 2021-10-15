import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReadExelComponent } from './read-exel/read-exel.component';
import {InvoiceWebappSharedModule} from "app/shared/shared.module";
import {ReadExelRouting} from "app/modules/read-exel/read-exel-routing";



@NgModule({
  declarations: [ReadExelComponent],
  imports: [
    CommonModule,
    InvoiceWebappSharedModule,
    ReadExelRouting,
  ]
})
export class ReadExelModule { }
