import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'jhi-partner-emails',
    templateUrl: './partner-emails.component.html',
    styleUrls: ['./partner-emails.component.scss']
})
export class PartnerEmailsComponent implements OnInit {
    @Input() isSaving: boolean;
    @Input() disable = true;
    isShow = false;
    height: any;
    itemsPerPage: any;
    maxSizePage: any;
    page: any;
    totalItems: number = 0;
    columns = [
        {name: 'partner.orderNo', size: 'small'},
        {name: 'partner.emailConfig.sender', size: 'medium'},
        {name: 'partner.emailConfig.receiver', size: 'medium'},
        {name: 'partner.emailConfig.receiverDate', size: 'medium'},
        {name: 'partner.emailConfig.subject', size: 'medium'},
        {name: 'partner.emailConfig.fileName', size: 'medium'},
        {name: 'partner.emailConfig.type', size: 'medium'},
        {name: 'partner.emailConfig.processTime', size: 'medium'},
        {name: 'partner.emailConfig.isValid', size: 'medium'},
        {name: 'partner.status', size: 'medium'},
    ]

    unDoneColumns = [
        {name: 'partner.orderNo', size: 'small'},
        {name: 'partner.emailConfig.sender', size: 'medium'},
        {name: 'partner.emailConfig.receiver', size: 'medium'},
        {name: 'partner.emailConfig.receiverDate', size: 'medium'},
        {name: 'partner.emailConfig.subject', size: 'medium'},
        {name: 'partner.emailConfig.fileName', size: 'medium'},
        {name: 'partner.emailConfig.type', size: 'medium'},
        {name: 'partner.emailConfig.processTime', size: 'medium'},
        {name: 'partner.emailConfig.isValid', size: 'medium'},
        {name: 'partner.status', size: 'medium'},
        {name: 'partner.emailConfig.errCode', size: 'medium'},
        {name: 'partner.action', size: 'medium'},
    ]

    constructor() {
    }

    ngOnInit(): void {
    }

    toggle() {
        this.isShow = !this.isShow;
    }

    save() {

    }

    loadPage(page: number) {
        console.log('page', page);
        const pageable = {};
        this.page = page;
        pageable[`page`] = page - 1;
        pageable[`size`] = this.itemsPerPage;
        pageable[`sort`] = ['modified_date,desc'];
    }

    changePageSize(event: any) {
        if (!event) return;
        this.itemsPerPage = event;
        const pageable = {};
        pageable[`page`] = this.page - 1;
        pageable[`size`] = this.itemsPerPage;
        pageable[`sort`] = ['modified_date,desc'];
    }
}
