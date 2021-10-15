import { Injectable } from "@angular/core";
import { BaseService } from "app/core/services/base-service";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { SERVER_API } from "app/shared/constants/api-resource.constants";

@Injectable({
  providedIn: "root"
})
export class PartnerProfileManagementService extends BaseService {
  constructor(public http: HttpClient) {
    super(http);
  }

  save(body: any, file: File[]): Observable<HttpResponse<any>> {
    const formData: FormData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(body)], {
        type: "application/json"
      })
    );
    if (file) {
      for (let i = 0; i < file.length; i++) {
        formData.append("listFile", file[i]);
      }
    }

    return this.http.post(
      SERVER_API + "/partnerCapacityProfile/save",
      formData,
      {
        responseType: "blob",
        observe: "response"
      }
    );

    //return super.add(SERVER_API + '/partnerCapacityProfile/save', body, { observe: 'response' });
  }

  getOneById(id: number): Observable<any> {
    return super.get(SERVER_API + "/partnerCapacityProfile/getOneById", {
      id: id
    });
  }

  findAllSecurityCapacity(id: number): Observable<any> {
    return super.get(SERVER_API + "/security_capacity_info/findAll", {
      partnerCapacityProfileId: id
    });
  }

  findAllSimilarContract(id: number): Observable<any> {
    return super.get(SERVER_API + "/similar_contracts/findAll", {
      partnerCapacityProfileId: id
    });
  }

  getFinancialList(id: number): Observable<any> {
    return super.get(SERVER_API + "/financial_capacity/findAll", {
      partnerCapacityProfileId: id
    });
  }

  getPartnerResource(id: number): Observable<any> {
    return super.get(SERVER_API + "/partner_resources/findAll", {
      partnerCapacityProfileId: id
    });
  }

  getTotalProductPersonnel(id: number, type: number): Observable<any> {
    return super.get(SERVER_API + "/total_production_personnel/findAll", {
      partnerCapacityProfileId: id,
      typePersonnel: type
    });
  }

  getQualityCapacity(id: number): Observable<any> {
    return super.get(SERVER_API + "/quality_management_capacity/findAll", {
      partnerCapacityProfileId: id
    });
  }
}
