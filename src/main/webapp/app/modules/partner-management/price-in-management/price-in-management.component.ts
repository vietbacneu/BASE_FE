import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'jhi-price-in-management',
    templateUrl: './price-in-management.component.html',
    styleUrls: ['./price-in-management.component.scss']
})
export class PriceInManagementComponent implements OnInit {
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

    navigateToPriceInForm() {
        void this.router.navigateByUrl(`/partner-management/price-in-management`);
    }
}
