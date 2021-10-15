import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpXsrfTokenExtractor
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

import * as CryptoJS from "crypto-js";

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  constructor(
    private tokenExtractor: HttpXsrfTokenExtractor,
    private router: Router,
    private http: HttpClient
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headerName = "X-XSRF-TOKEN";
    // const token = this.tokenExtractor.getToken();
    // if (token !== null && !request.headers.has(headerName)) {
    //   request = request.clone({ headers: request.headers.set(headerName, token) });
    // }

    const varEncrypt = new Date().toString();
    const token = CryptoJS.AES.encrypt(varEncrypt, "QLDT").toString();
    request = request.clone({
      headers: request.headers.set(headerName, token)
    });

    return next.handle(request);
  }
}
