import { Injectable } from '@angular/core';
import {SERVER_API} from "app/shared/constants/api-resource.constants";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {createRequestOption} from "app/shared/util/request-util";
import {ExchangeRateModel} from "app/core/models/exchange-rate-management/exchange-rate.model";

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateManagementService {

  public resourceUrl = SERVER_API;

  constructor(private http: HttpClient) {
  }

  searchByParam(reg?: any): Observable<any> {
    const option = createRequestOption(reg);
    return this.http.get(this.resourceUrl + '/api/exchange-rate', {params: option, observe: "response"});
  }

  save(body?: ExchangeRateModel): Observable<any> {
    return this.http.post(`${SERVER_API}/api/exchange-rate`, body, {observe: 'response'});
  }

  update(id?: any, body?: ExchangeRateModel): Observable<any> {
    return this.http.put(`${SERVER_API}/api/exchange-rate/${id}`, body, {observe: 'response'});
  }

  delete(id?: any): Observable<any> {
    return this.http.delete(`${SERVER_API}/api/exchange-rate/${id}`);
  }
}
