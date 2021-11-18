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
  exportNhanVien(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/nhanViens/exportNhanVien',data, {
      params: option,
      observe: "response"
    });
  }
  exportDanhGia(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/nhanViens/exportDanhGia',data, {
      params: option,
      observe: "response"
    });
  }
  searchDanhGia(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/nhanViens/danhGia',data, {
      params: option,
      observe: "response"
    });
  }
  searchDGKhenThuong(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/nhanVienKhenThuongs/search',data, {
      params: option,
      observe: "response"
    });
  }
  createDGKhenThuong(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/nhanVienKhenThuongs',data, {
      params: option,
      observe: "response"
    });
  }
  updateDGKhenThuong(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.put(this.resourceUrl + '/api/nhanVienKhenThuongs/update',data, {
      params: option,
      observe: "response"
    });
  }
  deleteDGKhenThuong(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.delete(this.resourceUrl + `/api/nhanVienKhenThuongs/${data.id}`, {
      params: option,
      observe: "response"
    });
  }
  searchDGKyLuat(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/nhanVienKyLuats/search',data, {
      params: option,
      observe: "response"
    });
  }
  createDGKyLuat(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/nhanVienKyLuats',data, {
      params: option,
      observe: "response"
    });
  }
  updateDGKyLuat(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.put(this.resourceUrl + '/api/nhanVienKyLuats/update',data, {
      params: option,
      observe: "response"
    });
  }
  deleteDGKyLuat(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.delete(this.resourceUrl + `/api/nhanVienKyLuats/${data.id}`, {
      params: option,
      observe: "response"
    });
  }
  searchBaoHiemNV(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/nhanVienBaoHiems/search',data, {
      params: option,
      observe: "response"
    });
  }
  createBaoHiemNV(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/nhanVienBaoHiems',data, {
      params: option,
      observe: "response"
    });
  }
  updateBaoHiemNV(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.put(this.resourceUrl + '/api/nhanVienBaoHiems/update',data, {
      params: option,
      observe: "response"
    });
  }
  deleteBaoHiemNV(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.delete(this.resourceUrl + `/api/nhanVienBaoHiems/${data.id}`, {
      params: option,
      observe: "response"
    });
  }
  searchPhongBan(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/phongBans/search',data, {
      params: option,
      observe: "response"
    });
  }
  createPhongBan(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/phongBans',data, {
      params: option,
      observe: "response"
    });
  }
  updatePhongBan(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.put(this.resourceUrl + '/api/phongBans/update',data, {
      params: option,
      observe: "response"
    });
  }
  deletePhongBan(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.delete(this.resourceUrl + `/api/phongBans/${data.id}`, {
      params: option,
      observe: "response"
    });
  }
  searchChucVu(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/chucVus/search',data, {
      params: option,
      observe: "response"
    });
  }
  createChucVu(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/chucVus',data, {
      params: option,
      observe: "response"
    });
  }
  updateChucVu(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.put(this.resourceUrl + '/api/chucVus/update',data, {
      params: option,
      observe: "response"
    });
  }
  deleteChucVu(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.delete(this.resourceUrl + `/api/chucVus/${data.id}`, {
      params: option,
      observe: "response"
    });
  }
  searchDMKyLuat(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/kyLuats/search',data, {
      params: option,
      observe: "response"
    });
  }
  createDMKyLuat(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/kyLuats',data, {
      params: option,
      observe: "response"
    });
  }
  updateDMKyLuat(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.put(this.resourceUrl + '/api/kyLuats/update',data, {
      params: option,
      observe: "response"
    });
  }
  deleteDMKyLuat(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.delete(this.resourceUrl + `/api/kyLuats/${data.id}`, {
      params: option,
      observe: "response"
    });
  }
  searchDMKhenThuong(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/khenThuongs/search',data, {
      params: option,
      observe: "response"
    });
  }
  createDMKhenThuong(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.post(this.resourceUrl + '/api/khenThuongs',data, {
      params: option,
      observe: "response"
    });
  }
  updateDMKhenThuong(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.put(this.resourceUrl + '/api/khenThuongs/update',data, {
      params: option,
      observe: "response"
    });
  }
  deleteDMKhenThuong(data?: any): Observable<any> {
    const option = createRequestOption(data);
    return this.http.delete(this.resourceUrl + `/api/khenThuongs/${data.id}`, {
      params: option,
      observe: "response"
    });
  }
}
