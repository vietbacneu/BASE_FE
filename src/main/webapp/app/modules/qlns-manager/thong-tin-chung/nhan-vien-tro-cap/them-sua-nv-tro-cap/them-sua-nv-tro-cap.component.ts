import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {ShareDataFromProjectService} from "app/core/services/outsourcing-plan/share-data-from-project";
import {HeightService} from "app/shared/services/height.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import {CommonService} from "app/shared/services/common.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ThongTinNhanSuApiService} from "app/core/services/QLNS-api/thong-tin-nhan-su-api.service";
import {ToastService} from "app/shared/services/toast.service";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'jhi-them-sua-nv-tro-cap',
    templateUrl: './them-sua-nv-tro-cap.component.html',
    styleUrls: ['./them-sua-nv-tro-cap.component.scss']
})
export class ThemSuaNvTroCapComponent implements OnInit {


    @Input() public selectedData;
    @Input() type;
    @Output() response = new EventEmitter<any>();


    form: FormGroup;
    height: number;
    itemsPerPage: any;
    maxSizePage: any;
    routeData: any;
    page: number;
    totalItems: any;
    previousPage: any;
    predicate: any;
    formValue;
    reverse: any;
    listNhanVien: any;
    listDanhGia: any;

    constructor(
        public translateService: TranslateService,
        private shareDataFromProjectService: ShareDataFromProjectService,
        private heightService: HeightService,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        protected router: Router,
        protected commonService: CommonService,
        public activeModal: NgbActiveModal,
        private thongTinNhanSuApiService: ThongTinNhanSuApiService,
        private toastService: ToastService,
        private datePipe: DatePipe
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.maxSizePage = MAX_SIZE_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            if (data && data.pagingParams) {
                this.page = data.pagingParams.page;
                this.previousPage = data.pagingParams.page;
                this.reverse = data.pagingParams.ascending;
                this.predicate = data.pagingParams.predicate;
            } else {
                this.page = 1;
            }
        });
    }


    ngOnInit(): void {
        this.buildForm()
        this.loadDanhGia()
        this.loadNhanVien()
    }


    buildForm() {
        this.form = this.formBuilder.group({
            idNhanVien: [null, Validators.required],
            troCap: [null, Validators.required],
            denNgay: [null, Validators.required],
            tuNgay: [null, Validators.required],
            mieuTa: [null],
            mucTroCap: [null],
        });
        if (this.selectedData) {
            let temp = JSON.parse(JSON.stringify(this.selectedData));
            this.form.patchValue(this.selectedData);
            this.form.get("denNgay").setValue(this.getDateYYYYMM(temp.denNgay))
            this.form.get("tuNgay").setValue(this.getDateYYYYMM(temp.tuNgay))
        }
    }

    changePageSize(size) {
        this.itemsPerPage = size;
    }

    changeTC(item){
        this.form.get("mucTroCap").setValue(item.mucTroCap)
    }

    trimSpace(element) {
        const value = this.getValueOfField(element);
        if (value) {
            this.setValueToField(element, value.trim());
        }
    }

    getValueOfField(item) {
        return this.form.get(item).value;
    }

    setValueToField(item, data) {
        this.form.get(item).setValue(data);
    }

    onCancel() {
        this.form.reset();
        this.activeModal.dismiss(true);
    }

    sort() {
        const result = [this.predicate + "," + (this.reverse ? "asc" : "desc")];
        if (this.predicate !== "sysUserId") {
            result.push("sysUserId");
        }
        return result;
    }

    onSubmit() {
        if (this.form.invalid) {
            this.commonService.validateAllFormFields(this.form);
            return;
        }
        this.spinner.show();
        const data = {
            id: '',
            idNhanVien: this.form.value.idNhanVien,
            troCap: this.form.value.troCap,
            tuNgay: this.form.value.tuNgay ? this.getDdMMyyy(new Date(this.form.value.tuNgay)) : '',
            denNgay: this.form.value.denNgay ? this.getDdMMyyy(new Date(this.form.value.denNgay)) : '',
            mieuTa: this.form.value.mieuTa || '',
            mucTroCap: this.form.value.mucTroCap || '',
        };
        if (this.type === "add") {
            this.thongTinNhanSuApiService
                .createNVTroCap(data).subscribe(
                res => {
                    this.spinner.hide();
                    this.toastService.openSuccessToast(
                        "Thêm mới thành công"
                    );
                    this.response.emit(true)
                    this.onCloseModal();
                },
                error => {
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                    this.response.emit(false)
                    this.spinner.hide();
                }
            );
        }
        if (this.type === "update") {
            if (this.selectedData !== undefined) data.id = this.selectedData.id;
            this.thongTinNhanSuApiService
                .updateNVTroCap(data).subscribe(
                res => {
                    this.spinner.hide();
                    this.toastService.openSuccessToast(
                        "Cập nhập thành công"
                    );
                    this.response.emit(true)
                    this.onCloseModal();
                },
                error => {
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                    this.response.emit(false)
                    this.spinner.hide();
                }
            );
        }
    }

    onCloseModal() {
        this.form.reset();
        this.activeModal.dismiss(true);
    }

    getDateYYYYMM(input: string) {
        return input.substring(6) + '-' + input.substring(3, 5) ;
    }

    getDdMMyyy(date: Date) {
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var date1 = ('0' + date.getDate()).slice(-2);
        var year = date.getFullYear();
        var shortDate = date1 + '/' + month + '/' + year;
        return shortDate
    }

    getMMMMYY(date: Date) {
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var date1 = ('0' + date.getDate()).slice(-2);
        var year = date.getFullYear();
        var shortDate = year + '-' + month;
        return shortDate
    }

    onResize() {
        this.height = this.heightService.onResizeWithoutFooter();
    }

    formatPreShow(content: string) {
        if (content.length > 60) return content.substring(0, 60) + "...";
        else return content;
    }

    isFieldValid(field: string) {
        return !this.form.get(field).valid && this.form.get(field).touched;
    }

    get formControl() {
        return this.form.controls;
    }

    loadNhanVien() {
        this.thongTinNhanSuApiService
            .searchNhanVien({})
            .subscribe(
                res => {
                    this.listNhanVien = res.body.content
                },
                err => {
                    this.spinner.hide();
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                }
            );
    }

    loadDanhGia() {
        this.thongTinNhanSuApiService
            .searchDMTroCap({})
            .subscribe(
                res => {
                    this.listDanhGia = res.body.content
                },
                err => {
                    this.spinner.hide();
                    this.toastService.openErrorToast(
                        this.translateService.instant("common.toastr.messages.error.load")
                    );
                }
            );
    }
}
