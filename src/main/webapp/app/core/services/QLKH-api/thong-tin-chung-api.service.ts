import {Injectable} from '@angular/core';
import {SERVER_API} from "app/shared/constants/api-resource.constants";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {createRequestOption} from "app/shared/util/request-util";

@Injectable({
    providedIn: 'root'
})
export class ThongTinChungApiService {

    public resourceUrl = SERVER_API;

    constructor(private http: HttpClient) {
    }

    searchDanhMuc(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/danhMucs/search', data, {
            params: option,
            observe: "response"
        });
    }

    searchNCC(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/nhaCungCaps/search', data, {
            params: option,
            observe: "response"
        });
    }

    searchTonKho(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/sanPhams/searchTon', data, {
            params: option,
            observe: "response"
        });
    }

    searchSpChiPhi(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/sanPhams/searchTongChiPhi', data, {
            params: option,
            observe: "response"
        });
    }

    download(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.get(this.resourceUrl + '/api/sanPhams/download', {
            params: option,
            observe: "response"
        });
    }

    searchSpDoanhThu(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/sanPhams/searchTongDoanhThu', data, {
            params: option,
            observe: "response"
        });
    }

    searchNhapHang(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/nhapHangs/search', data, {
            params: option,
            observe: "response"
        });
    }

    searchXuatHang(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/xuatHangs/search', data, {
            params: option,
            observe: "response"
        });
    }


    exportTonKho(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/sanPhams/exportTonKho', data, {
            params: option,
            observe: "response"
        });
    }

    exportSpChiPhi(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/sanPhams/exportChiPhi', data, {
            params: option,
            observe: "response"
        });
    }

    exportSpDoanhThu(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/sanPhams/exportDoanhThu', data, {
            params: option,
            observe: "response"
        });
    }

    createDanhMuc(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/danhMucs', data, {
            params: option,
            observe: "response"
        });
    }

    updateDanhMuc(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.put(this.resourceUrl + '/api/danhMucs/update', data, {
            params: option,
            observe: "response"
        });
    }

    deleteDanhMuc(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.delete(this.resourceUrl + `/api/danhMucs/${data.id}`, {
            params: option,
            observe: "response"
        });
    }

    searchSanPham(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/sanPhams/search', data, {
            params: option,
            observe: "response"
        });
    }

    createSanPham(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/sanPhams', data, {
            params: option,
            observe: "response"
        });
    }

    updateSanPham(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.put(this.resourceUrl + `/api/sanPhams/update/`, data, {
            params: option,
            observe: "response"
        });
    }

    deleteSanPham(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.delete(this.resourceUrl + `/api/sanPhams/${data.id}`, {
            params: option,
            observe: "response"
        });
    }

    searchChiNhanh(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/cuaHangs/search', data, {
            params: option,
            observe: "response"
        });
    }

    sanPhamXuat(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/sanPhams/sanPhamXuat', data, {
            params: option,
            observe: "response"
        });
    }

    sanPhamNhap(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/sanPhams/sanPhamNhap', data, {
            params: option,
            observe: "response"
        });
    }

    createChiNhanh(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/cuaHangs', data, {
            params: option,
            observe: "response"
        });
    }

    updateChiNhanh(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.put(this.resourceUrl + '/api/cuaHangs/update', data, {
            params: option,
            observe: "response"
        });
    }

    deleteChiNhanh(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.delete(this.resourceUrl + `/api/cuaHangs/${data.id}`, {
            params: option,
            observe: "response"
        });
    }

    searchKhachHang(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/khachHangs/search', data, {
            params: option,
            observe: "response"
        });
    }

    createKhachHang(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/khachHangs', data, {
            params: option,
            observe: "response"
        });
    }

    updateKhachHang(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.put(this.resourceUrl + '/api/khachHangs/update', data, {
            params: option,
            observe: "response"
        });
    }

    deleteKhachHang(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.delete(this.resourceUrl + `/api/khachHangs/${data.id}`, {
            params: option,
            observe: "response"
        });
    }

    createNhaCungCap(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.post(this.resourceUrl + '/api/nhaCungCaps', data, {
            params: option,
            observe: "response"
        });
    }

    updateNhaCungCap(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.put(this.resourceUrl + '/api/nhaCungCaps/update', data, {
            params: option,
            observe: "response"
        });
    }

    deleteNhaCungCap(data?: any): Observable<any> {
        const option = createRequestOption(data);
        return this.http.delete(this.resourceUrl + `/api/nhaCungCaps/${data.id}`, {
            params: option,
            observe: "response"
        });
    }
}
