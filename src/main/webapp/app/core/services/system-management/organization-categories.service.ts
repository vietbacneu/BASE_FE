import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { createRequestOption } from "app/shared/util/request-util";
import {
  HttpClient,
  HttpClientModule,
  HttpResponse
} from "@angular/common/http";
import { SERVER_API } from "app/shared/constants/api-resource.constants";

@Injectable({
  providedIn: "root"
})
export class OrganizationCategoriesService {
  private baseUri = SERVER_API;

  constructor(private _http: HttpClient) {}

  search(searchForm: any): Observable<any> {
    return this._http.post<any>(
      this.baseUri + "/organization/doSearch",
      searchForm
    );
  }
  getAllCodeOrName(req?: any) {
    const options = createRequestOption(req);
    return this._http.get(this.baseUri + "/organization/findByNameLikeCode", {
      params: options,
      observe: "response"
    });
  }

  save(data): Observable<any> {
    return this._http.post<any>(
      this.baseUri + "/organization/insertOrUpdate",
      data
    );
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this._http.get<any>(this.baseUri + "/organization/delete/" + id);
  }

  checkDelete(id: number): Observable<HttpResponse<any>> {
    return this._http.get<any>(
      this.baseUri + "/organization/checkDelete/" + id
    );
  }

  getParentsUpdate(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this._http.get<[]>(this.baseUri + "/organization/getParentsUpdate", {
      params: options,
      observe: "response"
    });
  }

  getParents(parenName): Observable<any> {
    return this._http.get<any>(
      this.baseUri + "/organization/getParents?parenName=" + parenName
    );
  }

  getGroups(): Observable<any> {
    return this._http.get<any>(this.baseUri + "/organization/getGroups");
  }

  checkCodeAdd(req?: any): Observable<HttpResponse<any>> {
    const options = createRequestOption(req);
    return this._http.get<[]>(this.baseUri + "/organization/checkCode", {
      params: options,
      observe: "response"
    });
  }

  downloadFileExcel(fileName?: any): Observable<any> {
    return this._http.get(
      this.baseUri +
        "/organization/download-excel-template?fileName=" +
        fileName,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }

  doImport(file: File): Observable<HttpResponse<any>> {
    const formData: FormData = new FormData();
    formData.append("file", file);
    return this._http.post(
      this.baseUri + "/organization/import-excel",
      formData,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }
}
