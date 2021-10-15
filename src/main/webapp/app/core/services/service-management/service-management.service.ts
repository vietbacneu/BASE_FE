import {Injectable} from '@angular/core';
import {SERVER_API} from "app/shared/constants/api-resource.constants";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {createRequestOption} from "app/shared/util/request-util";

@Injectable({
    providedIn: 'root'
})
export class ServiceManagementService {

    public resourceUrl = SERVER_API;

    constructor(private http: HttpClient) {
    }


    findAll(): Observable<any> {
        return this.http.get(this.resourceUrl + '/api/service-management/findAll');
    }

    searchByParam(reg?: any): Observable<any> {
        const option = createRequestOption(reg);
        return this.http.get(this.resourceUrl + '/api/service-management', {params: option, observe: "response"});
    }

    save(body?: any): Observable<any> {
        return this.http.post(`${SERVER_API}/api/service-management`, body, {observe: 'response'});
    }

    update(id?: any, body?: any): Observable<any> {
        return this.http.put(`${SERVER_API}/api/service-management/${id}`, body, {observe: 'response'});
    }

    delete(id?: any): Observable<any> {
        return this.http.delete(`${SERVER_API}/api/service-management/${id}`);
    }
}
