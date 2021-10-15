import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { SERVER_API } from "app/shared/constants/api-resource.constants";
import { createRequestOption } from "app/shared/util/request-util";

@Injectable({
  providedIn: "root"
})
export class FileAttachmentService {
  constructor(private http: HttpClient) {}

  deleteFile(id): Observable<HttpResponse<any>> {
    const options = createRequestOption().append("id", id);
    return this.http.delete<[]>(SERVER_API + "/attachmentFile/delete-file", {
      params: options,
      observe: "response"
    });
  }

  downloadFile(pathFile?: any): Observable<any> {
    return this.http.get(
      SERVER_API + "/attachmentFile/download-file?pathFile=" + pathFile,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }
}
