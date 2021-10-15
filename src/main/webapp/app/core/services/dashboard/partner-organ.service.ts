import { Injectable } from "@angular/core";
import { SERVER_API } from "app/shared/constants/api-resource.constants";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { createRequestOption } from "app/shared/util/request-util";

@Injectable({
  providedIn: "root"
})
export class PartnerOrganService {
  public resourceUrl = SERVER_API;
  constructor(private http: HttpClient) {}

  getAll(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this.http.get<[]>(
      this.resourceUrl + "/partner-organization-dashboard/get-list",
      { params: options, observe: "response" }
    );
  }

  getRentAll(search): Observable<any> {
    return this.http.get<any>(
      this.resourceUrl +
        "/partner-organization-dashboard/get-outsource-group?code=" +
        search
    );
  }
}
