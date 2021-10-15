import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {SERVER_API} from "app/shared/constants/api-resource.constants";
import {createRequestOption} from "app/shared/util/request-util";

@Injectable({
    providedIn: 'root'
})
export class PartnerService {

    currentPartner: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    currentPartnerContact: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    currentContract: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient) {
    }

    resetDataBeforeInsert() {
        this.currentPartner.next(null);
        this.currentPartnerContact.next(null);
        this.currentContract.next(null);
    }

    setCurrentPartner(partner: any) {
        this.currentPartner.next(partner);
    }

    setCurrentPartnerContact(partnerContact: any) {
        this.currentPartnerContact.next(partnerContact);
    }

    setCurrentContract(contract: any) {
        this.currentContract.next(contract);
    }

    search(body?: any, pageable?: any): Observable<any> {
        const options = createRequestOption(pageable);
        return this.http.post(`${SERVER_API}/partner/search`, body, {params: options, observe: 'response'});
    }

    searchPartnerContacts(req?: any): Observable<any> {
        const options = createRequestOption(req);
        return this.http.post(`${SERVER_API}/partner-contacts/search`, null, {params: options});
    }

    getAllCountries(): Observable<any> {
        return this.http.get(`${SERVER_API}/country/all`);
    }

    getAllAM(): Observable<any> {
        return this.http.get(`${SERVER_API}/partner/get-all-am`);
    }

    insertPartner(partner: any): Observable<any> {
        return this.http.post(`${SERVER_API}/partner/add`, partner);
    }

    updatePartner(partner: any): Observable<any> {
        return this.http.put(`${SERVER_API}/partner/update`, partner);
    }

    deletePartner(id: any) {
        return this.http.delete(`${SERVER_API}/partner/delete/${id}`);
    }

    insertPartnerContact(partnerContact: any) {
        return this.http.post(`${SERVER_API}/partner-contacts/add`, partnerContact);
    }

    updatePartnerContact(partnerContact: any) {
        return this.http.put(`${SERVER_API}/partner-contacts/update`, partnerContact);
    }

    deletePartnerContact(id: any) {
        return this.http.delete(`${SERVER_API}/partner-contacts/delete/${id}`);
    }

    getAllPartnerContractByPartnerId(req?: any): Observable<any> {
        const options = createRequestOption(req);
        return this.http.get(`${SERVER_API}/partner-contract/get-all-by-partner-id`, {params: options});
    }

    insertPartnerContract(partnerContract: any, file: any): Observable<any> {
        const formData = new FormData();
        formData.append('contract', JSON.stringify(partnerContract));
        Array.from(file).forEach((value: any) => formData.append('file', value));
        return this.http.post(`${SERVER_API}/partner-contract/add`, formData);
    }

    updatePartnerContract(partnerContract: any): Observable<any> {
        return this.http.put(`${SERVER_API}/partner-contract/update`, partnerContract);
    }

    insertPartnerContractDocs(partnerContractDocs: any): Observable<any> {
        const formData = new FormData();
        formData.append('docsType', partnerContractDocs.docsType);
        formData.append('contractId', partnerContractDocs.contractId);
        formData.append('documentCode', partnerContractDocs.documentCode);
        formData.append('documentName', partnerContractDocs.documentName);
        formData.append('description', partnerContractDocs.description);
        formData.append('signedDate', partnerContractDocs.signedDate);
        formData.append('startDate', partnerContractDocs.startDate);
        formData.append('endDate', partnerContractDocs.endDate);
        Array.from(partnerContractDocs.lstContractDocsAttachment).forEach((value: any) => formData.append('lstContractDocsAttachment', value));
        return this.http.post(`${SERVER_API}/partner-contract/add-contract-docs`, formData);
    }

    findAllCurrency(): Observable<any> {
        return this.http.get(`${SERVER_API}/currency/find-all`);
    }

    downloadAttachDocs(attachDocsId: any): Observable<any> {
        return this.http.get(`${SERVER_API}/partner-contract/download-attach-docs?attachDocsId=${attachDocsId}`, {responseType: 'arraybuffer'});
    }

    findAllNetworkElement(): Observable<any> {
        return this.http.get(`${SERVER_API}/partner-trunk/find-all-network-element`);
    }

    insertPartnerTrunk(partnerTrunk: any): Observable<any> {
        return this.http.post(`${SERVER_API}/partner-trunk/add`, partnerTrunk);
    }

    updatePartnerTrunk(partnerTrunk: any): Observable<any> {
        return this.http.put(`${SERVER_API}/partner-trunk/update`, partnerTrunk);
    }

    deletePartnerTrunk(id: any): Observable<any> {
        return this.http.delete(`${SERVER_API}/partner-trunk/delete/${id}`);
    }

    searchPartnerTrunk(options: any, pageable: any) {
        const params = createRequestOption(pageable);
        return this.http.post(`${SERVER_API}/partner-trunk/search`, options, {params: params});
    }

    insertOutGoingPrice(outGoingPrice: any): Observable<any> {
        return this.http.post(`${SERVER_API}/out-going-price/add`, outGoingPrice);
    }

    updateOutGoingPrice(outGoingPrice: any): Observable<any> {
        return this.http.put(`${SERVER_API}/out-going-price/update`, outGoingPrice);
    }

    deleteOutGoingPrice(id: any): Observable<any> {
        return this.http.delete(`${SERVER_API}/out-going-price/delete/${id}`);
    }

    searchOutGoingPrice(req: any, pageable: any): Observable<any> {
        const options = createRequestOption(pageable);
        return this.http.post(`${SERVER_API}/out-going-price/search`, req, {params: options});
    }

    insertInComingPrice(inComingPrice: any): Observable<any> {
        return this.http.post(`${SERVER_API}/in-coming-price/add`, inComingPrice);
    }

    updateInComingPrice(inComingPrice: any): Observable<any> {
        return this.http.put(`${SERVER_API}/in-coming-price/update`, inComingPrice);
    }

    deleteInComingPrice(id: any): Observable<any> {
        return this.http.delete(`${SERVER_API}/in-coming-price/delete/${id}`);
    }

    searchInComingPrice(req: any, pageable: any): Observable<any> {
        const options = createRequestOption(pageable);
        return this.http.post(`${SERVER_API}/in-coming-price/search`, req, {params: options});
    }

    findAllServices() {
        return this.http.get(`${SERVER_API}/commitment-price/find-all-service`);
    }

    findAllDestinationByPartnerId(partnerId: any) {
        return this.http.get(`${SERVER_API}/commitment-price/find-all-dest-by-partner?partnerId=${partnerId}`);
    }
}
