import { Injectable } from '@angular/core';
import {SERVER_API} from "app/shared/constants/api-resource.constants";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {createRequestOption} from "app/shared/util/request-util";

@Injectable({
  providedIn: 'root'
})
export class ThongTinNhanSuApiService {

  public resourceUrl = SERVER_API;

  constructor(private http: HttpClient) {
  }
  searchNhanVien(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/nhanViens/search',data, {
      params: option,
      observe: "response"
    });
  }
  createNhanVien(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/nhanViens',data, {
      params: option,
      observe: "response"
    });
  }
  updateNhanVien(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.put(this.resourceUrl + '/api/nhanViens/update',data, {
      params: option,
      observe: "response"
    });
  }
  deleteNhanVien(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.delete(this.resourceUrl + `/api/nhanViens/${data.id}`, {
      params: option,
      observe: "response"
    });
  }
}
