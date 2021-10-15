import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'jhi-price-out-management',
    templateUrl: './price-out-management.component.html',
    styleUrls: ['./price-out-management.component.scss']
})
export class PriceOutManagementComponent implements OnInit {
    @Input() isSaving: boolean;
    @Input() disable = true;

    isShow = false;

    constructor(private router: Router) {
    }

    ngOnInit(): void {
    }

    toggle() {
        this.isShow = !this.isShow;
    }

    navigateToPriceOutForm() {
        void this.router.navigateByUrl(`/partner-management/price-out-management`);
    }
}
