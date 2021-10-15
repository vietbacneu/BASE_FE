import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ToastService} from "app/shared/services/toast.service";
import {HeightService} from "../../../shared/services/height.service";
import {TranslateService} from "@ngx-translate/core";
import {NgxSpinnerService} from "ngx-spinner";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'jhi-setting-thread',
    templateUrl: './setting-thread.component.html',
    styleUrls: ['./setting-thread.component.scss']
})
export class SettingThreadComponent implements OnInit {
    height: any;
    lstThread: { value: number, label: string }[] = [
        {value: 0, label: 'email'},
        {value: 1, label: 'ftp'},
        {value: 2, label: 'cdr'},
    ];
    selected: any;
    selectForm: FormGroup;
    triggerForm:FormGroup = this.fb.group({
        test:[null]
    })
    constructor(private heightService: HeightService,
                private fb: FormBuilder,
                private translateService: TranslateService,
                private spinner: NgxSpinnerService,
                private toastService: ToastService,
                private modalService: NgbModal,) {
    }

    ngOnInit(): void {
        this.selectForm =  this.fb.group({
            selected: new FormControl(this.lstThread[0].value),
        })
        this.onResize();
    }

    onResize() {
        this.height = this.heightService.onResizeWithoutFooter();
    }

    change(event: any) {
        console.log(event)
    }

    save() {
        console.log(this.triggerForm.getRawValue());
    }
}
