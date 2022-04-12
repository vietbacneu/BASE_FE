import { Injectable } from '@angular/core';
import {SERVER_API} from "app/shared/constants/api-resource.constants";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {createRequestOption} from "app/shared/util/request-util";

@Injectable({
  providedIn: 'root'
})
export class NhapXuatApiService {

  public resourceUrl = SERVER_API;

  constructor(private http: HttpClient) {
  }
  searchNhapHang(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/nhapHangs/search',data, {
      params: option,
      observe: "response"
    });
  }
  createNhapHang(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/nhapHangs',data, {
      params: option,
      observe: "response"
    });
  }
  updateNhapHang(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.put(this.resourceUrl + '/api/nhapHangs/update',data, {
      params: option,
      observe: "response"
    });
  }
  deleteNhapHang(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.delete(this.resourceUrl + `/api/nhapHangs/${data.id}`, {
      params: option,
      observe: "response"
    });
  }
  createBanHang(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/banHangs',data, {
      params: option,
      observe: "response"
    });
  }
  updateBanHang(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.put(this.resourceUrl + '/api/banHangs/update',data, {
      params: option,
      observe: "response"
    });
  }
  deleteBanHang(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.delete(this.resourceUrl + `/api/banHangs/${data.id}`, {
      params: option,
      observe: "response"
    });
  }


  searchXuatHang(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/xuatHangs/search',data, {
      params: option,
      observe: "response"
    });
  }
  createXuatHang(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/xuatHangs',data, {
      params: option,
      observe: "response"
    });
  }
  updateXuatHang(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.put(this.resourceUrl + '/api/xuatHangs/update',data, {
      params: option,
      observe: "response"
    });
  }
  deleteXuatHang(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.delete(this.resourceUrl + `/api/xuatHangs/${data.id}`, {
      params: option,
      observe: "response"
    });
  }
}
