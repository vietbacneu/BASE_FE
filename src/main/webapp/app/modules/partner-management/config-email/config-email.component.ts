import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: 'jhi-config-email',
    templateUrl: './config-email.component.html',
    styleUrls: ['./config-email.component.scss']
})
export class ConfigEmailComponent implements OnInit, OnChanges {
    @Input() isSaving: boolean;
    @Input() disable = true;
    isShow = false;
    height: any;
    itemsPerPage: any;
    maxSizePage: any;
    page: any;
    totalItems: number = 0;
    formGroup: FormGroup = this.fb.group({
        emailType: new FormControl(null),
        senderEmail: new FormControl(null),
        mailSubject: new FormControl(null),
        partnerAttachment: new FormControl(null),
        senderSelector: new FormControl(null),
        mailSubjectSelector: new FormControl(null),
        partnerSelector: new FormControl(null)
    });
    columns = [
        {name: 'partner.orderNo', size: 'small'},
        {name: 'partner.emailConfig.senderEmail', size: 'medium'},
        {name: 'partner.emailConfig.senderSelector', size: 'medium'},
        {name: 'partner.emailConfig.mailSubject', size: 'medium'},
        {name: 'partner.emailConfig.mailSubjectSelector', size: 'medium'},
        {name: 'partner.emailConfig.partnerAttachment', size: 'medium'},
        {name: 'partner.emailConfig.partnerSelector', size: 'medium'},
    ]

    constructor(private fb: FormBuilder) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.disable.currentValue && changes.isSaving.currentValue) {
            this.formGroup.disable();
        } else {
            this.formGroup.enable();
        }
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
