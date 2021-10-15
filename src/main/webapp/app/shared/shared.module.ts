import {forwardRef, NgModule} from "@angular/core";
import {DatePipe} from "@angular/common";
import {NG_VALUE_ACCESSOR, NgControl} from "@angular/forms";
import {NgbDateAdapter, NgbDateNativeAdapter, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {InvoiceWebappSharedLibsModule} from "./shared-libs.module";
import {FindLanguageFromKeyPipe} from "./language/find-language-from-key.pipe";
import {DecodeHtmlPipe} from "app/shared/pipes/decode-html.pipe";
import {JhiAlertComponent} from "./alert/alert.component";
import {JhiAlertErrorComponent} from "./alert/alert-error.component";
import {JhiLoginModalComponent} from "./login/login.component";
import {NgbDatePickerFormatter} from "app/shared/util/datepicker-formatter";
import {PageSizeComponent} from "app/shared/components/page-size/page-size.component";
import {ErrorMessagesComponent} from "app/shared/components/error-messages/error-messages.component";
import {SpinnerComponent} from "app/shared/components/spinner/spinner.component";
import {DatePickerComponent} from "app/shared/components/date-picker/date-picker.component";
import {DateTimePickerComponent} from "app/shared/components/date-time-picker/date-time-picker.component";
import {DateRangePickerComponent} from "app/shared/components/date-range-picker/date-range-picker.component";
import {UploadFileComponent} from "app/shared/components/upload-file/upload-file.component";
import {ConfirmModalComponent} from "./components/confirm-modal/confirm-modal.component";
import {CommonService} from "app/shared/services/common.service";
import {DataFormatService} from "app/shared/services/data-format.service";
import {RegexInputDirective} from "app/shared/directives/regex-input.directive";
import {AutoFocusFieldDirective} from "app/shared/directives/auto-focus-field.directive";
import {NotificationComponent} from "./components/notification/notification.component";
import {ModalDragDirective} from "app/shared/directives/modal-drag.directive";
import {HasPermissionDirective} from "app/shared/directives/has-permission.directive";
import {HasMultiPermissionDirective} from "app/shared/directives/has-multi-permission.directive";
import {MonthYearPickerComponent} from "app/shared/components/month-year-picker/month-year-picker/month-year-picker.component";
import {DatePickerPopupComponent} from "app/shared/components/date-picker-popup/date-picker-popup.component";
import {PageSizePopupComponent} from "app/shared/components/page-size-popup/page-size-popup.component";
import {InputTrimDirective} from "app/shared/directives/input-trim.directive";
import {InlineMessageComponent} from "app/shared/components/inline-message/inline-message.component";
import {OnlyDoubleDirective} from "app/shared/directives/only-double.directive";
import {ValueToTextPipe} from "app/shared/pipes/value-to-text.pipe";
import {NgBootstrapDatetimeAngularComponent, NgBootstrapDatetimeAngularModule} from "ng-bootstrap-datetime-angular";

// import { HighchartsChartComponent } from 'highcharts-angular';
@NgModule({
    imports: [InvoiceWebappSharedLibsModule, NgBootstrapDatetimeAngularModule],
    declarations: [
        ValueToTextPipe,
        FindLanguageFromKeyPipe,
        DecodeHtmlPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        JhiLoginModalComponent,
        SpinnerComponent,
        ErrorMessagesComponent,
        DatePickerComponent,
        DateTimePickerComponent,
        DateRangePickerComponent,
        PageSizeComponent,
        UploadFileComponent,
        RegexInputDirective,
        AutoFocusFieldDirective,
        ConfirmModalComponent,
        ModalDragDirective,
        NotificationComponent,
        HasPermissionDirective,
        HasMultiPermissionDirective,
        MonthYearPickerComponent,
        DatePickerPopupComponent,
        PageSizePopupComponent,
        InputTrimDirective,
        // HighchartsChartComponent
        InlineMessageComponent,
        OnlyDoubleDirective,
    ],
    entryComponents: [
        JhiLoginModalComponent,
        ConfirmModalComponent,
        NotificationComponent
    ],
    exports: [
        InvoiceWebappSharedLibsModule,
        NgBootstrapDatetimeAngularModule,
        FindLanguageFromKeyPipe,
        DecodeHtmlPipe,
        JhiAlertComponent,
        JhiAlertErrorComponent,
        JhiLoginModalComponent,
        SpinnerComponent,
        ErrorMessagesComponent,
        DatePickerComponent,
        DateTimePickerComponent,
        DateRangePickerComponent,
        PageSizeComponent,
        UploadFileComponent,
        RegexInputDirective,
        ModalDragDirective,
        AutoFocusFieldDirective,
        NotificationComponent,
        HasPermissionDirective,
        HasMultiPermissionDirective,
        MonthYearPickerComponent,
        DatePickerPopupComponent,
        PageSizePopupComponent,
        InputTrimDirective,
        InlineMessageComponent,
        OnlyDoubleDirective,
        ValueToTextPipe,
    ],
    providers: [
        CommonService,
        DataFormatService,
        DatePipe,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerPopupComponent),
            multi: true
        },
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => DateRangePickerComponent)
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateTimePickerComponent),
            multi: true
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PageSizeComponent),
            multi: true
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UploadFileComponent),
            multi: true
        },
        {provide: NgbDateAdapter, useClass: NgbDateNativeAdapter},
        {provide: NgbDateParserFormatter, useClass: NgbDatePickerFormatter},
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MonthYearPickerComponent),
            multi: true
        }
    ]
})
export class InvoiceWebappSharedModule {
}
