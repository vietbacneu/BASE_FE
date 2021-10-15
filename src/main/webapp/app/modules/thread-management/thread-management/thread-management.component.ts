import {Component, OnInit} from '@angular/core';
import {HeightService} from "app/shared/services/height.service";
import {ThreadManagementService} from "app/core/services/thread-magement/thread-management.service";
import {Route, Router} from "@angular/router";

@Component({
    selector: 'jhi-thread-management',
    templateUrl: './thread-management.component.html',
    styleUrls: ['./thread-management.component.scss']
})
export class ThreadManagementComponent implements OnInit {
    height: any;
    lstThread: any[] = [];

    columns = [
        {name: 'app_param.orderNo', size: 'small'},
        {name: 'thread_management.name', size: 'medium'},
        {name: 'thread_management.state', size: 'medium'},
        {name: 'partner.action', size: 'medium'},
        {name: 'thread_management.setting', size: 'medium'},
        {name: 'thread_management.log', size: 'medium'},
    ];
    itemsPerPage: any;
    maxSizePage: any;
    page: any;
    totalItems: number = 0;

    constructor(private heightService: HeightService,
                private threadManagementService: ThreadManagementService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.getListThread();
    }

    getListThread() {
        this.threadManagementService.search().subscribe(res => {
            console.log('res', res);
            this.lstThread = res.body;
            this.totalItems = this.lstThread.length;
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

    turnOnThread(threadId: number) {
        this.threadManagementService.startThread(threadId).subscribe(res => {
            console.log('res', res);
            if (res.message === 'Done') {
                this.getListThread();
            }
        });
    }

    turnOffThread(threadId: number) {
        this.threadManagementService.stopThread(threadId).subscribe(res => {
            console.log('res', res);
            if (res.message === 'Done') {
                this.getListThread();
            }
        });
    }

    navigate() {
        // [routerLink]="['/thread-management/setting', item.threadId]"
        this.router.navigate(['thread-management', 'setting']);
    }
}
