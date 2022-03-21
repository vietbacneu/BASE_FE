import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonService} from "app/shared/services/common.service";

@Component({
    selector: 'jhi-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    @Input() public selectedData;
    @Input() type;
    @Output() response = new EventEmitter<any>();

    form: FormGroup;
    loginCheck: boolean = false;

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                protected commonService: CommonService,
    ) {

    }


    ngOnInit(): void {
        let tmp = this.get("loginOk")
        if (tmp.length>0){
            this.router.navigate(["/nhan-vien"]);
        }
        this.buildForm()
    }

    login() {
        if (this.form.invalid) {
            this.commonService.validateAllFormFields(this.form);
            return;
        }
        if (this.form.get("user").value == 'admin' && this.form.get("pass").value == 'admin') {
            this.set("loginOk", "oke")
            this.router.navigate(["/nhan-vien"]);
        } else {
            this.loginCheck = true
        }
    }

    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    get(key) {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : "";
    }

    isFieldValid(field: string) {
        return !this.form.get(field).valid && this.form.get(field).touched;
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            user: [null, Validators.required],
            pass: [null, Validators.required],
        });
    }


    setValueToField(item, data) {
        this.form.get(item).setValue(data);
    }

    get formControl() {
        return this.form.controls;
    }

    getValueOfField(item) {
        return this.form.get(item).value;
    }

    trimSpace(element) {
        const value = this.getValueOfField(element);
        if (value) {
            this.setValueToField(element, value.trim());
        }
    }

}
