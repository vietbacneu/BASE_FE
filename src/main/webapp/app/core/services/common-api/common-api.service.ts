import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { createRequestOption } from "app/shared/util/request-util";
import { SERVER_API_URL } from "app/app.constants";
import { SERVER_API } from "app/shared/constants/api-resource.constants";

@Injectable({
  providedIn: "root"
})
export class CommonApiService {
  public resourceUrl = SERVER_API;

  constructor(private http: HttpClient) {}

  getAppParam(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<[]>(
      this.resourceUrl + "/e-invoice/get-all-tenant-branch-by-user-for-search",
      {
        params: options,
        observe: "response"
      }
    );
  }

  /**
   * Create HungND 04/06/2020
   * Get Organization
   */
  getOrganizationList(page, limit, code): Observable<HttpResponse<any>> {
    const options = createRequestOption()
      .append("page", page)
      .append("limit", limit)
      .append("code", code);
    return this.http.get<[]>(SERVER_API + "/organization/getOrg", {
      params: options,
      observe: "response"
    });
  }

  /**
   * Create HungND 21/07/2020
   * Get list outsource org name
   */
  getListOutsourceOrg(ousourceUnitName): Observable<HttpResponse<any>> {
    const options = createRequestOption().append(
      "ousourceUnitName",
      ousourceUnitName
    );
    return this.http.get<[]>(
      SERVER_API + "/liabilities-partner-dashboard/getListOutsourceOrg",
      {
        params: options,
        observe: "response"
      }
    );
  }

  /**
   * @CreateBy: thanhnb 22/07/2020 auto-complete
   */
  getOutsourceOrganization(outSourceUnitName): Observable<HttpResponse<any>> {
    const options = createRequestOption().append(
      "outSourceUnitName",
      outSourceUnitName
    );
    return this.http.get<[]>(
      SERVER_API + "/partnerCapacityProfile/outsourceOrgs",
      {
        params: options,
        observe: "response"
      }
    );
  }
}
