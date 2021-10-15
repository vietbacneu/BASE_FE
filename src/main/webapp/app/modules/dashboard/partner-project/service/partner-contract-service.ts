import { Injectable } from "@angular/core";
import { SERVER_API } from "app/shared/constants/api-resource.constants";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { createRequestOption } from "app/shared/util/request-util";

@Injectable({
  providedIn: "root"
})
export class PartnerContractService {
  public resourceUrl = SERVER_API;

  constructor(private _http: HttpClient) {}

  fetchDataDk(dataSearch?: string): Observable<any> {
    if (dataSearch) {
      return this._http.get<any>(
        this.resourceUrl + "/dashboard/partner-dk?dataSearch=" + dataSearch
      );
    }
    return this._http.get<any>(
      this.resourceUrl + "/dashboard/partner-dk?dataSearch="
    );
  }

  fetchDataCk(dataSearch?: string): Observable<any> {
    if (dataSearch) {
      return this._http.get<any>(
        this.resourceUrl + "/dashboard/partner-ck?dataSearch=" + dataSearch
      );
    }
    return this._http.get<any>(
      this.resourceUrl + "/dashboard/partner-ck?dataSearch="
    );
  }

  getData(type?: string): Observable<any> {
    return this._http.get<any>(this.resourceUrl + "/dashboard/get-data");
  }

  getContractStatus(type: any) {
    return this._http.get(
      this.resourceUrl + "/app_param/findByParamType?paramType=" + type
    );
  }

  search(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this._http.get<[]>(this.resourceUrl + "/dashboard/search", {
      params: options,
      observe: "response"
    });
  }

  getdataTotal(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this._http.get<[]>(this.resourceUrl + "/dashboard/data-total", {
      params: options,
      observe: "response"
    });
  }
}
