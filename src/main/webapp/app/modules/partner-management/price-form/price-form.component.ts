import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'jhi-price-form',
    templateUrl: './price-form.component.html',
    styleUrls: ['./price-form.component.scss']
})
export class PriceFormComponent implements OnInit {
    @Input() isSaving: boolean;
    @Input() disable = true;
    isShow = false;

    constructor() {
    }

    ngOnInit(): void {
    }

    toggle() {
        this.isShow = !this.isShow;
    }
}
