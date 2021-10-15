import { Injectable } from "@angular/core";
import { SERVER_API } from "app/shared/constants/api-resource.constants";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { createRequestOption } from "app/shared/util/request-util";

@Injectable({
  providedIn: "root"
})
export class LiabilitiesPartnerService {
  public resourceUrl = SERVER_API;
  constructor(private http: HttpClient) {}

  getAll(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<[]>(
      this.resourceUrl + "/liability-partner-report/get-list",
      {
        params: options,
        observe: "response"
      }
    );
  }

  exportExcel(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get(
      this.resourceUrl + "/liability-partner-report/export-excel",
      {
        params: options,
        responseType: "blob",
        observe: "response"
      }
    );
  }

  getTotalMM(data, signStatus: any): Observable<HttpResponse<any>> {
    let options = null;
    if (signStatus == null) {
      options = createRequestOption(data);
    } else {
      options = createRequestOption(data).append("signStatus", signStatus);
    }

    return this.http.get<[]>(
      this.resourceUrl + "/liability-partner-report/totalMM",
      {
        params: options,
        observe: "response"
      }
    );
  }
}
