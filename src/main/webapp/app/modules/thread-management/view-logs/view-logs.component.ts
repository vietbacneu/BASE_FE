import {Component, OnInit} from '@angular/core';
import {HeightService} from "app/shared/services/height.service";
import {ActivatedRoute} from "@angular/router";
import {ThreadManagementService} from "app/core/services/thread-magement/thread-management.service";

@Component({
    selector: 'jhi-view-logs',
    templateUrl: './view-logs.component.html',
    styleUrls: ['./view-logs.component.scss']
})
export class ViewLogsComponent implements OnInit {
    height: any;
    itemsPerPage: any;
    maxSizePage: any;
    page: any;
    totalItems: number = 0;
    id: any;
    lstLog: any[] = [];
    columns = [
        {name: 'thread_management.level', size: 'medium'},
        {name: 'thread_management.date', size: 'medium'},
        {name: 'thread_management.message', size: 'large'},
    ];

    constructor(private heightService: HeightService,
                private route: ActivatedRoute,
                private threadService: ThreadManagementService) {
    }

    ngOnInit() {
        this.id = this.route.snapshot.params.id;
        this.viewLog(this.id);
    }

    // onPageChange(event) {
    //   this.config.currentPage = event;
    // }
    viewLog(id: number) {
        this.threadService.viewLog(id).subscribe(data => {
            // this.threadLogs = data.data;
            console.log('data', data);
            this.lstLog = data.body.data;
            this.totalItems = this.lstLog.length;
        });
    }

    loadPage(page: any) {

    }

    changePageSize($event: any) {

    }

    onEdit(item: any) {

    }

    onDelete(item: any) {

    }

    viewDetail(item: any) {

    }

    onResize() {
        this.height = this.heightService.onResizeWithoutFooter();
    }
}
