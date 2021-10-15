import {Injectable} from '@angular/core';
import {SERVER_API} from "app/shared/constants/api-resource.constants";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {createRequestOption} from "app/shared/util/request-util";

@Injectable({
    providedIn: 'root'
})
export class ThreadManagementService {
    public resourceUrl = SERVER_API;

    constructor(private http: HttpClient) {
    }

    search(): Observable<any> {
        return this.http.get<any>(SERVER_API + "/list-thread", {observe: 'response'});
    }

    startThread(id: any,body?:any): Observable<any> {
        return this.http.post<any>(SERVER_API + `/startThread/${id}`, body);
    }

    stopThread(id: any): Observable<any> {
        return this.http.post<any>(SERVER_API + `/stopThread/${id}`, {});
    }

    viewLog(id: any): Observable<any> {
        return this.http.get<any>(SERVER_API + `/viewLog/${id}`,{observe:"response"});
    }

    viewDetail(id: any): Observable<any> {
        return this.http.get<any>(SERVER_API + `/view/${id}`,{observe:"response"});
    }

    setting(data: any): Observable<any> {
        return this.http.post<any>(SERVER_API + `/setting`, data);
    }
}
