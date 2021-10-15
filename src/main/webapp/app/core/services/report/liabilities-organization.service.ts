import { Injectable } from "@angular/core";
import { SERVER_API } from "app/shared/constants/api-resource.constants";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { createRequestOption } from "app/shared/util/request-util";

@Injectable({
  providedIn: "root"
})
export class LiabilitiesOrganizationService {
  public resourceUrl = SERVER_API;
  constructor(private http: HttpClient) {}

  getAllReport(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<[]>(
      this.resourceUrl + "/liability-organ-use-report/get-list",
      { params: options, observe: "response" }
    );
  }
  exportExcel(data): Observable<any> {
    return this.http.get(
      this.resourceUrl + "/liability-organ-use-report/export-excel",
      {
        params: data,
        responseType: "blob",
        observe: "response"
      }
    );
  }
}
