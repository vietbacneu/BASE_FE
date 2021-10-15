import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpClientModule,
  HttpEvent,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { DataCategoryModel } from "app/modules/system-categories/data-categories/models/DataCategory.model";
import { BehaviorSubject, Observable } from "rxjs";
import { DataCategoryTypeModel } from "app/modules/system-categories/data-categories/models/DataCategoryType.model";
import { SERVER_API } from "app/shared/constants/api-resource.constants";
import { createRequestOption } from "app/shared/util/request-util";

@Injectable({
  providedIn: "root"
})
export class DataCategoryService {
  public resourceUrl = SERVER_API;

  _dataCategory = new BehaviorSubject<DataCategoryModel[]>([]);
  currentDataCategory = this._dataCategory.asObservable();

  constructor(private _http: HttpClient) {}

  changeDataCategory(dataCategory: DataCategoryModel[]) {
    this._dataCategory.next(dataCategory);
  }

  /**
   *
   * @param searchData
   */
  fetchAll(searchData: any): Observable<any> {
    return this._http.post<any>(
      this.resourceUrl + "/datacategories/findAll",
      searchData
    );
  }

  /**
   *
   * @param paramTYpe
   */
  fetchAllDataCategoryType(paramTYpe: string): Observable<any> {
    return this._http.get<DataCategoryTypeModel[]>(
      this.resourceUrl + "/datacategories/findAllType?paramType=" + paramTYpe
    );
  }

  /**
   *
   * @param paramCode
   */
  findCategoryByParamCode(paramTYpe: string): Observable<any> {
    return this._http.get<DataCategoryTypeModel[]>(
      this.resourceUrl +
        "/datacategories/findCategoryByParamCode?paramType=" +
        paramTYpe
    );
  }
  /**
   *
   * @param dataCategory
   */
  save(dataCategory: DataCategoryModel): Observable<HttpResponse<any>> {
    return this._http.post<DataCategoryModel>(
      this.resourceUrl + "/datacategories/add",
      dataCategory,
      {
        observe: "response"
      }
    );
  }

  /**
   *
   * @param id
   */
  delete(id: number): Observable<HttpResponse<any>> {
    return this._http.get<[]>(
      this.resourceUrl + "/datacategories/delete/" + id,
      { observe: "response" }
    );
  }

  checkUsed(id: number): Observable<HttpResponse<any>> {
    return this._http.get<[]>(
      this.resourceUrl + "/datacategories/check-used-before-delete/" + id,
      { observe: "response" }
    );
  }

  /**
   * upload file
   * @param file
   */
  doImport(file: File): Observable<HttpResponse<any>> {
    const formData: FormData = new FormData();
    formData.append("file", file);
    return this._http.post(
      this.resourceUrl + "/datacategories/import-excel",
      formData,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }

  /**
   *
   * @param fileName
   */
  downloadFileExcel(fileName?: any): Observable<any> {
    // return this._http.get<any>(this.resourceUrl + '/datacategories/download-excel-template?fileName=' + fileName, {
    //   params: options,
    //   responseType: 'blob',
    //   observe: 'response
    //
    // });
    return this._http.get(
      this.resourceUrl +
        "/datacategories/download-excel-template?fileName=" +
        fileName,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }

  checkDataCategoryCodeExist(
    code?: any,
    id?: any
  ): Observable<HttpResponse<any>> {
    let urlCallApi =
      this.resourceUrl +
      "/datacategories/check-dataCategory-exist?code=" +
      code;
    if (id !== null && id !== "") {
      urlCallApi += "&id=" + id;
    }
    return this._http.get<[]>(urlCallApi, { observe: "response" });
  }

  checkProcessTaskAsyncImport(id: number): Observable<any> {
    return this._http.get(
      this.resourceUrl +
        "/datacategories/check-process-async-task?taskId=" +
        id,
      {
        //responseType: 'blob',
        observe: "response"
      }
    );
  }

  downloadFileImport(id: number): Observable<any> {
    return this._http.get(
      this.resourceUrl + "/datacategories/download-file-result?taskId=" + id,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }

  doImportAsync(file: File): Observable<HttpResponse<any>> {
    const formData: FormData = new FormData();
    formData.append("file", file);
    return this._http.post(
      this.resourceUrl + "/datacategories/import-async",
      formData,
      {
        //responseType: 'blob',
        observe: "response"
      }
    );
  }
}
