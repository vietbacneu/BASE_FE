export interface ExchangeRateModel {
     id?:number;

    billingPeriod?:Date;

    currencyId:number;

    rateType:number;

    rate:number;

    status?:number;

}