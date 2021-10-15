import { Injectable } from "@angular/core";
import { SERVER_API } from "app/shared/constants/api-resource.constants";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { createRequestOption } from "app/shared/util/request-util";

@Injectable({
  providedIn: "root"
})
export class OutsourcingInfomationReportService {
  public resourceUrl = SERVER_API + "/outsourcingInformationReport";
  public resourceUrlApp = SERVER_API;
  constructor(private http: HttpClient) {}

  searchOutsourcingProject(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<[]>(this.resourceUrl + "/outsourcing-project/search", {
      params: options,
      observe: "response"
    });
  }

  exportExcelOutsourcingProject(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get(
      this.resourceUrl + "/outsourcing-project/export-excel",
      {
        params: options,
        responseType: "blob",
        observe: "response"
      }
    );
  }

  searchProject(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<[]>(this.resourceUrl + "/project/search", {
      params: options,
      observe: "response"
    });
  }

  exportExcelProject(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get(this.resourceUrl + "/project/export-excel", {
      params: options,
      responseType: "blob",
      observe: "response"
    });
  }

  searchPartner(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<[]>(this.resourceUrl + "/partner/search", {
      params: options,
      observe: "response"
    });
  }

  exportExcelPartner(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get(this.resourceUrl + "/partner/export-excel", {
      params: options,
      responseType: "blob",
      observe: "response"
    });
  }

  searchContract(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<[]>(this.resourceUrl + "/contract/search", {
      params: options,
      observe: "response"
    });
  }

  exportExcelContract(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get(this.resourceUrl + "/contract/export-excel", {
      params: options,
      responseType: "blob",
      observe: "response"
    });
  }

  searchUserByName(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<[]>(this.resourceUrl + "/search-user", {
      params: options,
      observe: "response"
    });
  }

  getSignStatusOrContractStatus(type: any) {
    return this.http.get(
      this.resourceUrlApp + "/app_param/findByParamType?paramType=" + type
    );
  }

  getContractStatus(type: any) {
    return this.http.get(
      this.resourceUrlApp + "/app_param/findByType?paramType=" + type
    );
  }

  getDataAutoConplete(keySearch): Observable<any> {
    return this.http.get<any>(
      this.resourceUrl + "/getRegBusiness?keySearch=" + keySearch
    );
  }
}
