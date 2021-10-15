import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonUtils} from "app/shared/util/common-utils.service";
import {TranslateService} from "@ngx-translate/core";
import {UploadFileComponent} from "app/shared/components/upload-file/upload-file.component";
import {ReadExelService} from "app/core/services/read-exel/read-exel.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'jhi-read-exel',
    templateUrl: './read-exel.component.html',
    styleUrls: ['./read-exel.component.scss']
})
export class ReadExelComponent implements OnInit {
    @ViewChild("deleteFileElem", {static: false}) deleteFileElem: ElementRef;
    file: File;
    exceedMaxSize = false;
    uploadSuccess = false;
    resultImportTrue = false;
    resultImportFalse = false;
    fileNotChoose = false;
    importResult = false;
    errImport = false;
    successImport = false;
    successMessage;
    errMessage;
    validMaxSize = 5;

    constructor(private translateService: TranslateService,
                private readExelService: ReadExelService,
                private toastrService: ToastrService) {
    }

    ngOnInit(): void {
    }

    uploadFile() {
        // if (!this.file) {
        //     // this.toastrService.warning('', this.translate.instant('select_file_upload'));
        //     // return;
        // }
        this.readExelService.importFile(this.file).subscribe(res => {
            // if (res.status === 202) {
            this.toastrService.success('Success');
            // }
        }, error => {
            // this.toastrService.error(error.error.errorCodeConfig);
            console.log(error);
        });
    }

    onChangeFile(event: any) {
        console.log('file', event);
        this.file = event.target.files[0];
        console.log('file1',  event.target.files[0]);
    }


    onError(event) {
        if (event === "") {
            this.errImport = false;
            this.successImport = true;
            this.successMessage = this.translateService.instant(
                "common.import.success.upload"
            );
        } else {
            this.errImport = true;
            this.successImport = false;
            this.errMessage = event;
        }
    }
}
