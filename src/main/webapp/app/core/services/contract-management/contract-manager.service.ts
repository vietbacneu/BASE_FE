import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { createRequestOption } from "../../../shared/util/request-util";
import { ContractManagerModel } from "../../../core/models/contract-manager/contract-manager.model";
import { SERVER_API_URL } from "../../../app.constants";
import { SERVER_API } from "../../../shared/constants/api-resource.constants";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ContractManagerService {
  public resourceUrl = SERVER_API;
  //trangnc cho hiển thị xem
  currentInvoice: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    //trangnc cho hiển thị xem
    this.currentInvoice = new BehaviorSubject<any>(null);
  }

  query(dataSearch?: any) {
    const options = createRequestOption(dataSearch);
    return this.http.get<any>(
      this.resourceUrl + "/outsourcingContract/findByField",
      dataSearch
    );
  }

  deleteById(id?: any) {
    const options = createRequestOption(id);
    return this.http.delete<any>(
      this.resourceUrl + "/outsourcingContract/delete/" + id
    );
  }

  deleteByActual(id?: any) {
    return this.http.get<any>(
      this.resourceUrl + "/actual-effort/deleteByOutSourcingId?id=" + id
    );
  }

  findByField(dataSearch?: any) {
    const options = createRequestOption(dataSearch);
    return this.http.post<any>(
      this.resourceUrl + "/outsourcingContract/findByField",
      dataSearch
    );
  }

  fetchAll(searchData: any) {
    return this.http.post<any>(
      this.resourceUrl + "/outsourcingContract/findByField",
      searchData
    );
  }

  getSignStatusOrContractStatus(type: any) {
    return this.http.get(
      this.resourceUrl + "/app_param/findByParamType?paramType=" + type
    );
  }

  getAllPartnerCode(code: any) {
    return this.http.get(
      this.resourceUrl + "/partnerCapacityProfile/getAllEntity?code=" + code
    );
  }

  // trangnc autocomplete cho ma dự án
  getAllProjectCode(code: any) {
    return this.http.get(
      this.resourceUrl + "/project-management/getAllEntity?code=" + code
    );
  }

  getAllProjectCodeOrName(code: any) {
    return this.http.get(
      this.resourceUrl + "/project-management/find-by-name-or-code?code=" + code
    );
  }

  // trangnc get all plan theo planstatus = 'phê duyệt'
  async getAllPlanFollowApprove(projectId) {
    return await this.http
      .get(
        this.resourceUrl +
          "/outsourcing-plan/getAllEntity?idProject=" +
          projectId
      )
      .toPromise();
  }

  //Trangnc insert Data
  doInsertData(data: any) {
    return this.http.post<any>(
      this.resourceUrl + "/outsourcingContract/insertOrUpdate",
      data
    );
  }

  // Trangnc get data by Email or Name (Đầu mối đề nghị hợp tác)
  doSearchEmailOrName(search: any) {
    return this.http.get<any>(
      this.resourceUrl + "/user/getAllEntity?code=" + search
    );
  }

  //trangnc lay don vi kinh doanh,dau moi kinh doanh, don vi san xuat, dau moi ky thuat theo ke hoach thue ngoai
  getBusiness(khtn: any) {
    return this.http.get<any>(
      this.resourceUrl + "/project-management/getbusiness?khtn=" + khtn
    );
  }

  // trangnc save thong tin no luc thuc te
  doInsertDataTNLTT(data: any) {
    return this.http.post<any>(
      this.resourceUrl + "/actual-effort/insertOrUpdate",
      data
    );
  }

  //trangnc cho hiển thị xem
  changeInvoice(invoice) {
    this.currentInvoice.next(invoice);
  }

  //trangnc lấy danh sách thông tin nỗ lực sử dụng thực tế theo contractID
  getListBycontractID(id: any) {
    return this.http.get<any>(
      this.resourceUrl + "/actual-effort/findByContractCode?code=" + id
    );
  }

  //trangnc
  getPartnerCodeById(id: any) {
    return this.http.get<any>(
      this.resourceUrl + "/partnerCapacityProfile/getById?id=" + id
    );
  }

  // trangnc delete thong tin no luc thuc te
  doDeleteDataTNLTT(id: any) {
    return this.http.get<any>(
      this.resourceUrl + "/actual-effort/deleteById?id=" + id
    );
  }

  // QuangHN Start

  downloadTempFileExcel(excelType: string): Observable<any> {
    return this.http.get(
      this.resourceUrl +
        "/outsourcingContract/download-excel-template?excelType=" +
        excelType,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }
  // QuangHN End

  // trangnc lấy danh sách đơn vị kinh doanh và đơn vị sản xuất
  doGetListDVKDAndDVSX(code?: any) {
    return this.http.get<any>(
      this.resourceUrl + "/organization/getListOrganizaByGroup?code=" + code
    );
  }

  // QuangHN Start
  /**
   * upload file
   * @param file
   */
  doImport(file: File): Observable<HttpResponse<any>> {
    const formData: FormData = new FormData();
    formData.append("file", file);
    return this.http.post(
      this.resourceUrl + "/outsourcingContract/import-excel-async",
      formData,
      {
        //responseType: 'blob',
        observe: "response"
      }
    );
  }
  // QuangHN End
  // get Project Manager By Id
  doGetPMById(id?: number) {
    return this.http.get<any>(
      this.resourceUrl + "/project-management/getEnById?id=" + id
    );
  }

  //getEntitById App_Param
  dogetEntitById(id?: number) {
    return this.http.get<any>(
      this.resourceUrl + "/app_param/findById?id=" + id
    );
  }

  // trangnc lấy đơn vị thuê ngoài trong list đối tác tham gia
  // doGetDVTN(namePartner?: string) {
  //   return this.http.get<any>(this.resourceUrl + '/partnerCapacityProfile/searchDVTN?namePartner=' + namePartner);
  // }
  doGetDVTN(codeOrNameOrg?: string) {
    return this.http.get<any>(
      this.resourceUrl +
        "/organization/searchDVTN?codeOrNameOrg=" +
        codeOrNameOrg
    );
  }
  // trangnc insert dữ liệu vào trong bảng đối tác tham gia
  doInsertDataToPartnerJoin(data) {
    return this.http.post<any>(
      this.resourceUrl + "/partnerContract/insertOrUpdate",
      data
    );
  }

  // trangnc tìm kiếm số hợp đồng trong bảng hợp đồng thuê ngoài
  doSearchNumContract(numContract: any, id?: number) {
    return this.http.get<any>(
      this.resourceUrl +
        "/outsourcingContract/searchNumContract?numContract=" +
        numContract +
        "&id=" +
        id
    );
  }

  // trangnc get don vi kinh doanh,dau moi kinh doanh, don vi san xuat, dau moi ky thuat theo mã dự án
  getbusinessByProjectId(projectId?: number) {
    return this.http.get<any>(
      this.resourceUrl +
        "/project-management/getbusinessByProjectId?projectId=" +
        projectId
    );
  }

  //trangnc lấy danh sách đối tác tham gia theo contractID
  getListPartJoinBycontractID(id: any) {
    return this.http.get<any>(
      this.resourceUrl + "/partnerContract/findByContractCode?code=" + id
    );
  }

  // xóa dữ liệu bảng đối tác tham gia
  deleteByJoinPartner(id?: any) {
    return this.http.get<any>(
      this.resourceUrl + "/partnerContract/deleteByOutSourcingId?id=" + id
    );
  }

  // search doi tac cho phan tim kiem hop dong thue ngoai
  doSearchByCodeorNameorShortName(id?: any) {
    return this.http.get<any>(
      this.resourceUrl +
        "/partnerCapacityProfile/searchByCodeorNameorShortName?key=" +
        id
    );
  }

  //get info by danh sách Kế hoạch và mã dự án
  doInfoByLstPlanCode(lstPlanCode?: any, projectId?: any) {
    return this.http.get<any>(
      this.resourceUrl +
        "/outsourcing-plan/getInfoByPlanCode?lstPlanCode=" +
        lstPlanCode +
        "&projectId=" +
        projectId
    );
  }

  //get info by danh sách id Kế hoạch và mã dự án
  doInfoByLstPlanId(lstPlanId?: any, projectId?: any) {
    return this.http.get<any>(
      this.resourceUrl +
        "/outsourcing-plan/getInfoByPlanId?lstPlanId=" +
        lstPlanId +
        "&projectId=" +
        projectId
    );
  }

  checkProcessTaskAsyncImport(id: number): Observable<any> {
    return this.http.get(
      this.resourceUrl +
        "/outsourcingContract/check-process-async-task?taskId=" +
        id,
      {
        //responseType: 'blob',
        observe: "response"
      }
    );
  }

  downloadFileImport(id: number): Observable<any> {
    return this.http.get(
      this.resourceUrl +
        "/outsourcingContract/download-file-result?taskId=" +
        id,
      {
        responseType: "blob",
        observe: "response"
      }
    );
  }

  getAllProject() {
    return this.http.get<any>(
      this.resourceUrl + "/outsourcingContract/getAllProject"
    );
  }

  getPlanApprove() {
    return this.http.get<any>(
      this.resourceUrl + "/outsourcingContract/getOutsourcingPlanApprove"
    );
  }
}
