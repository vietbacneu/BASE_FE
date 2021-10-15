import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {TranslateModule} from "@ngx-translate/core";
import {TextMaskModule} from "angular2-text-mask";
import {ScriptService} from "app/shared/services/script.service";
import {ClickOutsideModule} from "ng-click-outside";
import {NgJhipsterModule} from "ng-jhipster";
import {CKEditorModule} from "ng2-ckeditor";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {NgxCaptchaModule} from "ngx-captcha";
import {CountdownModule} from "ngx-countdown";
import {NgxImageCompressService} from "ngx-image-compress";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {
    PerfectScrollbarConfigInterface,
    PerfectScrollbarModule,
    PERFECT_SCROLLBAR_CONFIG
} from "ngx-perfect-scrollbar";
import {NgxSpinnerModule} from "ngx-spinner";
import {ToastrModule} from "ngx-toastr";
import {TreeviewModule} from "ngx-treeview";
import {
    BsDatepickerConfig,
    BsDatepickerModule
} from "ngx-bootstrap/datepicker";
import {ThemeService} from "ng2-charts";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: false
};

export function getDatepickerConfig(): BsDatepickerConfig {
    return Object.assign(new BsDatepickerConfig(), {
        dateInputFormat: "DD-MM-YYYY"
    });
}

@NgModule({
    imports: [
        NgSelectModule,
        ToastrModule.forRoot(),
        NgxSpinnerModule,
        CKEditorModule,
        TreeviewModule.forRoot(),
        PerfectScrollbarModule,
        TextMaskModule,
        PdfViewerModule,
        NgxCaptchaModule,
        ClickOutsideModule,
        CountdownModule,
        BsDatepickerModule.forRoot()
    ],
    exports: [
        FormsModule,
        CommonModule,
        NgbModule,
        NgJhipsterModule,
        InfiniteScrollModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        TranslateModule,
        NgSelectModule,
        ToastrModule,
        NgxSpinnerModule,
        CKEditorModule,
        TreeviewModule,
        PerfectScrollbarModule,
        TextMaskModule,
        PdfViewerModule,
        NgxCaptchaModule,
        ClickOutsideModule,
        CountdownModule,
        BsDatepickerModule
    ],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        NgxImageCompressService,
        ScriptService,
        {provide: BsDatepickerConfig, useFactory: getDatepickerConfig},
        ThemeService
    ]
})
export class InvoiceWebappSharedLibsModule {
}
