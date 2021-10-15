import { Injectable } from "@angular/core";
import { SERVER_API } from "app/shared/constants/api-resource.constants";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class StatisticsPartnerContractService {
  public resourceUrl = SERVER_API;

  constructor(private _http: HttpClient) {}

  fetchData(value?: number): Observable<any> {
    if (value) {
      return this._http.get<any>(
        this.resourceUrl +
          "/statistics-partner-contract/chart?totalMMOwed=" +
          value
      );
    }
    return this._http.get<any>(
      this.resourceUrl + "/statistics-partner-contract/chart?totalMMOwed="
    );
  }

  // lấy dữ liệu cho drop down đơn vị thuê ngoài
  fetchDataOutsourcedUnit(): Observable<any> {
    return this._http.get(
      this.resourceUrl + "/partnerCapacityProfile/findAllNoPage"
    );
  }

  // lấy dữ liệu cho drop down loại đối tác
  fetchDataPartnerCategory(): Observable<any> {
    return this._http.get(
      this.resourceUrl + "/datacategories/findAllByAppParam?paramCode=DL_LDT"
    );
  }

  search(searchData): Observable<any> {
    return this._http.post<any>(
      this.resourceUrl + "/statistics-partner-contract/search",
      searchData
    );
  }
}
