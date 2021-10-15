import { Injectable } from "@angular/core";
import { SERVER_API } from "app/shared/constants/api-resource.constants";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { createRequestOption } from "app/shared/util/request-util";

@Injectable({
  providedIn: "root"
})
export class LiabilitiesOutPartnerService {
  public resourceUrl = SERVER_API;
  constructor(private http: HttpClient) {}

  search(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<[]>(
      this.resourceUrl + "/liabilities-partner-dashboard/search",
      { params: options, observe: "response" }
    );
  }

  getDataChart(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<[]>(
      this.resourceUrl + "/liabilities-partner-dashboard/getDataChart",
      { params: options, observe: "response" }
    );
  }
}
