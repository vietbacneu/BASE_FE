import { Injectable } from "@angular/core";
import { SERVER_API } from "app/shared/constants/api-resource.constants";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { createRequestOption } from "app/shared/util/request-util";

@Injectable({
  providedIn: "root"
})
export class LiabilitiesOrganizationProjectPartnerService {
  constructor(private http: HttpClient) {}

  getAllReport(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<[]>(
      SERVER_API + "/report/liability-org-prj-partner-page",
      {
        params: options,
        observe: "response"
      }
    );
  }

  exportExcel(data): Observable<any> {
    return this.http.post(
      SERVER_API + "/report/liability-org-prj-partner-excel",
      data,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }
}
