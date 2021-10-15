import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ExchangeRateManagementService} from "app/core/services/exchange-rate-management/exchange-rate-management.service";
import {HeightService} from "app/shared/services/height.service";
import {TranslateService} from "@ngx-translate/core";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastService} from "app/shared/services/toast.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import {CurrencyManagementService} from "app/core/services/currency-management/currency-management.service";
import {ITEMS_PER_PAGE, MAX_SIZE_PAGE} from "app/shared/constants/pagination.constants";
import {finalize} from "rxjs/operators";
import {HTTP_STATUS} from "app/app.constants";
import {ExchangeRateManagementFormComponent} from "app/modules/exchange-rate-management/exchange-rate-management/exchange-rate-management-form/exchange-rate-management-form.component";
import {ConfirmModalComponent} from "app/shared/components/confirm-modal/confirm-modal.component";
import {FtpServerService} from "app/core/services/ftp-service/ftp-server.service";
import {FtpServerFormComponent} from "app/modules/ftp-server/ftp-server/ftp-server-form/ftp-server-form.component";

@Component({
  selector: 'jhi-ftp-server',
  templateUrl: './ftp-server.component.html',
  styleUrls: ['./ftp-server.component.scss']
})
export class FtpServerComponent implements OnInit {

  height: any;
  lstFtps: any[] = [];
  lstProtocol :{name:string,value:string}[]=[
    {name: this.translateService.instant('common.select.option.all'), value: ''},
      {name:'FTP',value:'FTP'},
      {name:'SFTP',value:'SFTP'}
  ];
  columns = [
    {name: 'app_param.orderNo', size: 'small'},
    {name: 'ftp_server.host', size: 'medium'},
    {name: 'ftp_server.port', size: 'medium'},
    {name: 'ftp_server.protocol', size: 'medium'},
    {name: 'ftp_server.username', size: 'medium'},
    {name: 'ftp_server.settingName', size: 'medium'},
    {name: 'partner.action', size: 'medium'},
  ];
  itemsPerPage: any;
  maxSizePage: any;
  page: any;
  totalItems: number = 0;
  formGroup: FormGroup = this.fb.group({
    host: [null],
    port: [null],
    protocol: [''],
    name: [null],
    username: [null]
  });
  lstCurency: any[] = [];
  lstRateType: any;

  constructor(
      private ftpServerService: FtpServerService,
      private heightService: HeightService,
      private fb: FormBuilder,
      private translateService: TranslateService,
      private spinner: NgxSpinnerService,
      private toastService: ToastService,
      private modalService: NgbModal,
      private datePipe: DatePipe,
      private currencyManagementService: CurrencyManagementService
  ) {
  }

  ngOnInit(): void {
    this.currencyManagementService.findAll().subscribe(res => {
      this.lstCurency = res;
    })
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.maxSizePage = MAX_SIZE_PAGE;
    this.page = 0;
    this.search();
    this.onResize()

  }

  onResize() {
    this.height = this.heightService.onResizeWithoutFooter();
  }

  search() {
    const pageable = {};
    pageable[`page`] = this.page > 0 ? this.page - 1 : this.page;
    pageable[`size`] = this.itemsPerPage;
    this.onSearch(pageable);
  }

  onSearch(pageable: any) {
    this.showSpinner();
    const value = this.formGroup.getRawValue();
    value.billingPeriod = this.datePipe.transform(value.billingPeriod, 'yyyy-MM-dd');
    // moment('',).toDate()
    console.log('value', value)
    const rawValues = {...value, ...pageable};
    console.log('value', rawValues);
    this.ftpServerService.searchByParam(rawValues).pipe(finalize(() => this.hideSpinner()))
        .subscribe((next: any) => {
          console.log('next', next);
          if (HTTP_STATUS.OK === next.status) {
            console.log('page', this.page);
            this.lstFtps = next.body.content;
            this.totalItems = next.body.totalElements;
          } else this.showUnknownErr();
        }, () => this.showUnknownErr());
  }

  loadPage(page: number) {
    console.log('page', page);
    const pageable = {};
    this.page = page;
    pageable[`page`] = page - 1;
    pageable[`size`] = this.itemsPerPage;
    this.onSearch(pageable);
  }

  changePageSize(event: any) {
    if (!event) return;
    this.itemsPerPage = event;
    const pageable = {};
    pageable[`page`] = this.page - 1;
    pageable[`size`] = this.itemsPerPage;
    this.onSearch(pageable);
  }

  onDeleteSuccess(param: any) {
    this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.delete",
        {paramName: param}));
  }

  showUnknownErr() {
    this.toastService.openErrorToast(this.translateService.instant('common.toastr.title.error'));
  }

  viewDetail(item: any) {

  }

  onEdit(item: any) {
    console.log('item', item);
    const dialogRef = this.modalService.open(FtpServerFormComponent, {
      size: "xl",
      backdrop: "static",
      centered: true,
    });
    dialogRef.componentInstance.selectedRow = item;
    dialogRef.componentInstance.lstProtocol = this.lstProtocol;
    dialogRef.componentInstance.action = 'Edit';
    dialogRef.result.then(value => {
      if (value) {
        this.onUpdateSuccess(this.translateService.instant('ftp_server.configuration'));
        this.search();
      }
    });
  }

  onDelete(item: any) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: "static",
      size: "sm"
    });
    modalRef.componentInstance.type = "delete";
    modalRef.componentInstance.param = '';
    modalRef.componentInstance.onCloseModal.subscribe(value => {
      console.log(value);
      if (value) {
        this.ftpServerService.delete(item.id).subscribe(
            () => {
              this.onDeleteSuccess(this.translateService.instant('ftp_server.configuration'));
              this.search();
            },
            (err) => {
              console.log(err);
              if (err && err.error.message === 'using') {
                this.toastService.openErrorToast(this.translateService.instant('common.toastr.messages.error.partnerIsUsing', {param: item.code}));
                return;
              }
              this.showUnknownErr();
            });
      }
    });
  }

  openDialog() {
    const dialogRef = this.modalService.open(FtpServerFormComponent, {
      size: "xl",
      backdrop: "static",
      centered: true,
    });
    dialogRef.componentInstance.lstProtocol = this.lstProtocol;
    dialogRef.componentInstance.action = 'Add';
    dialogRef.result.then(value => {
      if (value) {
        this.onSaveSuccess(this.translateService.instant('ftp_server.configuration'));
        this.search();
      }
    });
  }

  showSpinner() {
    this.spinner.show();
  }

  hideSpinner() {
    this.spinner.hide();
  }

  onSaveSuccess(param: any) {
    this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.add",
        {paramName: param}));
  }

  onUpdateSuccess(param: any) {
    this.toastService.openSuccessToast(this.translateService.instant("common.toastr.messages.success.update",
        {paramName: param}));
  }

}
