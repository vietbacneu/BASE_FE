import { Injectable } from "@angular/core";
import { SERVER_API } from "app/shared/constants/api-resource.constants";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { createRequestOption } from "app/shared/util/request-util";

@Injectable({
  providedIn: "root"
})
export class VersionManagementService {
  currentOutsourcePlan: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.currentOutsourcePlan = new BehaviorSubject<any>(null);
  }

  search(data): Observable<HttpResponse<any>> {
    const options = createRequestOption();
    return this.http.post<[]>(SERVER_API + "/version-management/search", data, {
      params: options,
      observe: "response"
    });
  }

  searchFunction(data): Observable<HttpResponse<any>> {
    const options = createRequestOption();
    return this.http.post<[]>(SERVER_API + "/function/doSearch", data, {
      params: options,
      observe: "response"
    });
  }

  searchNonFunction(data): Observable<HttpResponse<any>> {
    const options = createRequestOption();
    return this.http.post<[]>(SERVER_API + "/non-function/doSearch", data, {
      params: options,
      observe: "response"
    });
  }

  // get user list from sys_user
  getUserList(page, limit, keyWork): Observable<HttpResponse<any>> {
    const options = createRequestOption()
      .append("name", keyWork)
      .append("email", keyWork)
      .append("page", page)
      .append("size", limit);
    return this.http.get<[]>(SERVER_API + "/user/searchByEmailOrName", {
      params: options,
      observe: "response"
    });
  }

  getVersion(page, limit, keyWork): Observable<HttpResponse<any>> {
    const options = createRequestOption()
      .append("versionCode", keyWork)
      .append("versionName", keyWork)
      .append("page", page)
      .append("size", limit);
    return this.http.get<[]>(
      SERVER_API + "/version-management/searchByCodeOrName",
      {
        params: options,
        observe: "response"
      }
    );
  }

  saveVersionManagement(data): Observable<HttpResponse<any>> {
    //const options = createRequestOption();
    return this.http.post(SERVER_API + "/version-management/save", data, {
      observe: "response",
      responseType: "blob"
    });
  }

  saveFunction(data): Observable<HttpResponse<any>> {
    //const options = createRequestOption();
    return this.http.post(SERVER_API + "/function/save", data, {
      observe: "response"
    });
  }

  saveNonFunction(data): Observable<HttpResponse<any>> {
    //const options = createRequestOption();
    return this.http.post(SERVER_API + "/non-function/save", data, {
      observe: "response"
    });
  }

  deleteVersion(id): Observable<HttpResponse<any>> {
    const options = createRequestOption().append("id", id);
    return this.http.delete<[]>(SERVER_API + "/version-management/delete", {
      params: options,
      observe: "response"
    });
  }

  deleteFunction(id): Observable<HttpResponse<any>> {
    const options = createRequestOption().append("id", id);
    return this.http.delete<[]>(SERVER_API + "/function/deleteById", {
      params: options,
      observe: "response"
    });
  }

  deleteNonFunction(id): Observable<HttpResponse<any>> {
    const options = createRequestOption().append("id", id);
    return this.http.delete<[]>(SERVER_API + "/non-function/deleteById", {
      params: options,
      observe: "response"
    });
  }

  /**
   * Hungnd create 5/6/2020
   * check project code exist
   */
  checkStartDate(startDate, id): Observable<HttpResponse<any>> {
    const options = createRequestOption()
      .append("startDate", startDate)
      .append("id", id);
    return this.http.get<[]>(
      SERVER_API + "/version-management/checkStartDate",
      {
        params: options,
        observe: "response"
      }
    );
  }

  /**
   * Hungnd create 6/6/2020
   * navigative data
   */
  navigation(data) {
    this.currentOutsourcePlan.next(data);
  }

  downloadFileExcel(fileName?: any): Observable<any> {
    return this.http.get(
      SERVER_API +
        "/version-management/download-excel-template?fileName=" +
        fileName,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }
  downloadFileResultExcel(fileName?: any): Observable<any> {
    return this.http.get(
      SERVER_API +
        "/version-management/download-excel-result?fileName=" +
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
    return this.http.post(
      SERVER_API + "/version-management/import-excel",
      formData,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }

  doExport(data) {
    return this.http.post(
      SERVER_API + "/version-management/export-excel",
      data,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }
}
