import { SERVER_API } from "../../../shared/constants/api-resource.constants";
import { AppParamModel } from "../../models/profile-management/app-param.model";
import { HttpClient, HttpResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { createRequestOption } from "app/shared/util/request-util";
import { BehaviorSubject, Observable } from "rxjs";
import { PofileManagementModel } from "app/core/models/profile-management/profile-management.model";

@Injectable({
  providedIn: "root"
})
export class ProfileAppraisalService {
  public resourceUrl = SERVER_API;

  currentProfile: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.currentProfile = new BehaviorSubject<any>(null);
  }

  changeProfile(profile) {
    this.currentProfile.next(profile);
  }
  getProfileById(id): Observable<HttpResponse<any>> {
    const options = createRequestOption();
    return this.http.get<[]>(
      SERVER_API + "/profile-appraisal/findById?id=" + id,
      {
        params: options,
        observe: "response"
      }
    );
  }
  search(searchForm?: any): Observable<any> {
    return this.http.post<any>(
      this.resourceUrl + "/profile-appraisal/findAll",
      searchForm
    );
  }

  searchFunctionEffort(searchForm?: any): Observable<any> {
    return this.http.post<any>(
      this.resourceUrl + "/function_effort/search",
      searchForm
    );
  }

  getHistoryProfileAppraisal(id): Observable<any> {
    const param = new HttpParams().set("id", id);
    return this.http.get<[AppParamModel]>(
      this.resourceUrl + "/profile-appraisal/historyById",
      { params: param, observe: "response" }
    );
  }

  deleteProfileAppraisal(id: any): Observable<any> {
    return this.http.post<any>(
      this.resourceUrl + "/profile-appraisal/deleteById",
      id,
      {
        observe: "response"
      }
    );
  }

  exportFileExcel(id: any): Observable<any> {
    const options = createRequestOption(id);
    return this.http.get(this.resourceUrl + "/profile-appraisal/exportExcel", {
      responseType: "blob",
      params: options,
      observe: "response"
    });
  }

  // thanhnb IIST 11/06/2020
  downloadTemplateFileExcel(excelType: string): Observable<any> {
    return this.http.get(
      this.resourceUrl +
        "/profile-appraisal/download-excel-template?type=" +
        excelType,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }

  /**
   * thanhnb IIST 11/06/2020
   * upload file
   * @param file
   */
  doImport(file: File): Observable<HttpResponse<any>> {
    const formData: FormData = new FormData();
    formData.append("file", file);
    return this.http.post(
      this.resourceUrl + "/profile-appraisal/import-excel-async",
      formData,
      {
        //responseType: 'blob',
        observe: "response"
      }
    );
  }

  //ThucDV-IIST modifi start 29/06/2020
  checkPartnerCodeIsExist(code): Observable<HttpResponse<any>> {
    return this.http.get<[]>(
      this.resourceUrl +
        "/profile-appraisal/check-exist-code?partnerCode=" +
        code,
      { observe: "response" }
    );
  }

  getEmployeeOfPartner(searchForm?: any) {
    const options = createRequestOption(searchForm);
    return this.http.get<[]>(
      this.resourceUrl + "/ready-employee-of-partner/get-list",
      { params: options, observe: "response" }
    );
  }
  //ThucDV-IIST modifi end 29/06/2020

  doExport(data) {
    return this.http.post(
      SERVER_API + "/profile-appraisal/export-excel",
      data,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }

  checkProcessTaskAsyncImport(id: number): Observable<any> {
    return this.http.get(
      this.resourceUrl +
        "/profile-appraisal/check-process-async-task?taskId=" +
        id,
      {
        //responseType: 'blob',
        observe: "response"
      }
    );
  }

  downloadFileImport(id: number): Observable<any> {
    return this.http.get(
      this.resourceUrl + "/profile-appraisal/download-file-result?taskId=" + id,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }
  // them moi
  save(data): Observable<HttpResponse<any>> {
    //const options = createRequestOption();
    return this.http.post(SERVER_API + "/profile-appraisal/save", data, {
      observe: "response",
      responseType: "blob"
    });
  }

  checkProfileAppraisal(data): Observable<HttpResponse<any>> {
    //const options = createRequestOption();
    return this.http.post(
      SERVER_API + "/profile-appraisal/check-profile-appraisal",
      data,
      {
        observe: "response",
        responseType: "blob"
      }
    );
  }
}
