import {Injectable} from "@angular/core";
import {SERVER_API} from "../../../shared/constants/api-resource.constants";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {createRequestOption} from "../../../shared/util/request-util";

@Injectable({
    providedIn: "root"
})
export class AppParamsService {
    public resourceUrl = SERVER_API;

    authenticatedUser: BehaviorSubject<any>;

    constructor(private http: HttpClient) {
        this.authenticatedUser = new BehaviorSubject<any>(null);
    }

    setAuthenticatedUser(data) {
        this.authenticatedUser.next(data);
    }

    getAllAppParams(): Observable<HttpResponse<any>> {
        const options = createRequestOption();
        return this.http.get<[]>(this.resourceUrl + "/app-params/get-app-params", {
            params: options,
            observe: "response"
        });
    }

    getAllAppParamsConfig(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http.get<[]>(
            this.resourceUrl + "/app-params/get-app-params-config",
            {
                params: options,
                observe: "response"
            }
        );
    }

    /**
     * Update NamNv 16/5/2020
     * Find by code
     */
    getAllAppParamsByType(param: string): Observable<HttpResponse<any>> {
        return this.http.get<[]>(this.resourceUrl + "/app-param/findByParamType", {
            params: {
                paramType: param
            },
            observe: "response"
        });
    }

    /**
     * Create HungND 04/06/2020
     * Get parem by code
     */
    getParamByCode(param): Observable<HttpResponse<any>> {
        const options = createRequestOption().append("paramType", param);
        return this.http.get<[]>(SERVER_API + "/app-param/findByTypeLanguage", {
            params: options,
            observe: "response"
        });
    }

    search(body?: any): Observable<any> {
        const options = createRequestOption(body);
        return this.http.get<any>(SERVER_API + "/app-param", {params: options, observe: 'response'});
    }

    save(body?: any): Observable<any> {
        return this.http.post(`${SERVER_API}/app-param`, body, {observe: 'response'});
    }

    update(id?: any, body?: any): Observable<any> {
        return this.http.put(`${SERVER_API}/app-param/${id}`, body, {observe: 'response'});
    }

    delete(id?: any): Observable<any> {
        return this.http.delete(`${SERVER_API}/app-param/${id}`);
    }
}
