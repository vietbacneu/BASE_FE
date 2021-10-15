import {Injectable} from '@angular/core';
import {SERVER_API} from "app/shared/constants/api-resource.constants";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ReadExelService {

    public resourceUrl = SERVER_API;

    constructor(private http: HttpClient) {
    }

    importFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(this.resourceUrl + '/api/uploadFile', formData);
    }
}
