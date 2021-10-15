import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CurrencyManagementService} from "app/core/services/currency-management/currency-management.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "app/shared/services/toast.service";
import {ExchangeRateManagementService} from "app/core/services/exchange-rate-management/exchange-rate-management.service";
import * as moment from 'moment';
import {DatePipe} from "@angular/common";

@Component({
    selector: 'jhi-exchange-rate-management-form',
    templateUrl: './exchange-rate-management-form.component.html',
    styleUrls: ['./exchange-rate-management-form.component.scss']
})
export class ExchangeRateManagementFormComponent implements OnInit {

    selectedExchange: any;
    lstCurrency: any[] = [];
    createForm: FormGroup = this.fb.group({
        id: [null],
        billingPeriod: [null,[Validators.required]],
        currencyId: [null,[Validators.required]],
        rateType: [null,[Validators.required]],
        rate: [null,[Validators.required]]
    });

    constructor(private fb: FormBuilder,
                private currencyManagementService: CurrencyManagementService,
                private exchangeRateManagementService: ExchangeRateManagementService,
                public activeModal: NgbActiveModal,
                private translate: TranslateService,
                private toastr: ToastService,
                private datePipe: DatePipe,
    ) {
    }

    ngOnInit(): void {
        if (this.selectedExchange) {
            this.selectedExchange.billingPeriod = moment(this.selectedExchange.billingPeriod).toDate();
            this.createForm.patchValue(this.selectedExchange);
        }
    }

    save() {
        this.createForm.markAllAsTouched();
        if (this.createForm.invalid) {
            return;
        }
        const data = this.createForm.getRawValue();
        data.billingPeriod = this.datePipe.transform(data.billingPeriod,'yyyy-mm-dd');
        console.log('data', data);
        if (this.selectedExchange) {
          this.exchangeRateManagementService.update(this.selectedExchange.id, data).subscribe(res => {
            this.activeModal.close(res);
          })
        } else {
          this.exchangeRateManagementService.save(data).subscribe(res => {
            this.activeModal.close(res);
          },error => {
            this.toastr.openErrorToast(error.error.message);
          })
        }
    }

    cancel() {
        this.activeModal.close();
    }

    displayFieldHasError(field: string) {
        return {
            "has-error": this.isFieldValid(field)
        };
    }

    isFieldValid(field: string) {
        return !this.createForm.get(field).valid && this.createForm.get(field).touched;
    }

}
