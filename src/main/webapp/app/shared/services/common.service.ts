import {Injectable} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {ToastService} from "app/shared/services/toast.service";
import {FormStoringService} from "app/shared/services/form-storing.service";
import {STORAGE_KEYS} from "app/shared/constants/storage-keys.constants";
import {AUTHORITY_CODE} from "app/shared/constants/app-config.constants";
import {AppParamsService} from "app/core/services/common-api/app-params.service";
import {TranslateService} from "@ngx-translate/core";
import {STATUS_CODE} from "app/shared/constants/status-code.constants";
import {UserToken} from "app/core/models/user-token.model";

@Injectable({
    providedIn: "root"
})
export class CommonService {
    private static storage = localStorage;

    constructor(
        private toastService: ToastService,
        private formStoringService: FormStoringService,
        private appParamsService: AppParamsService,
        private translateService: TranslateService
    ) {
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({onlySelf: true});
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    getAppParams() {
        this.appParamsService.getAllAppParams().subscribe(res => {
            if (res && res.body && res.body.data) {
                // res.body.data.sort((a, b) => (a.parName > b.parName) ? 1 : -1);
                res.body.data.sort((a, b) => a.parName.localeCompare(b.parName)); // HopTQ sap xep theo tieng viet
                this.formStoringService.set(STORAGE_KEYS.APP_PARAMS, res.body.data);
            }
        });
    }

    getAppParamsConfig(key) {
        this.appParamsService
            .getAllAppParamsConfig({
                parType: key
            })
            .subscribe(res => {
                if (res && res.body && res.body.data) {
                    this.formStoringService.set(
                        STORAGE_KEYS.DECIMAL_PARAMS,
                        res.body.data
                    );
                }
            });
    }

    trimSpaceFormValue(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                const value = control.value;
                if (typeof value === "string") {
                    control.setValue(value.trim());
                }
            } else if (control instanceof FormGroup) {
                this.trimSpaceFormValue(control);
            }
        });
    }

    setValueIsNull(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                const value = control.value;
                if (value === "") {
                    control.setValue(null);
                }
            } else if (control instanceof FormGroup) {
                this.trimSpaceFormValue(control);
            }
        });
    }

    getPermissionCode(code: string): string {
        return AUTHORITY_CODE[code] || "";
    }

    havePermission(resourceCode: string): boolean {
        let permissionCode = resourceCode;
        //console.log(permissionCode);
        // if (permissionCode === '') {
        //   permissionCode = resourceCode;
        // }
        const userToken: UserToken = this.formStoringService.get(
            STORAGE_KEYS.CURRENT_USER
        );
        if (!userToken.id) {
            return false;
        }
        const userPermissionList = this.formStoringService.get(
            STORAGE_KEYS.USER_PERMISSION_LIST
        );
        if (userPermissionList == null || userPermissionList.length <= 0) {
            return false;
        }
        return userPermissionList.includes(permissionCode);
    }

    openToastMess(statusCode: any, search?: boolean, type?: any) {
        if (statusCode === STATUS_CODE.AUTH) {
            // if (!search) {
            this.toastService.openWarningToast(
                this.translateService.instant("common.toastr.messages.error.auth", {
                    type
                })
            );
            // }
        } else {
            if (!search) {
                this.toastService.openErrorToast(
                    this.translateService.instant("common.toastr.messages.error.action", {
                        type
                    })
                );
            } else {
                this.toastService.openErrorToast(
                    this.translateService.instant("common.toastr.messages.error.load")
                );
            }
        }
    }

    /**
     * Hungnd
     * format currentcy : xx.xxx.xxx,xx
     * @param input
     */
    formatCurrency(input: string) {
        if (input == null || input == undefined) return 0;
        const inputStr = input.toString();
        const split = inputStr.split(".");

        let output = "";
        if (split.length === 2) output = "," + split[1];

        const arr = split[0].split("");

        let index = 0;
        for (let i = split[0].length - 1; i >= 0; i--) {
            index++;
            if (arr[i] === "-") output = arr[i] + output;
            else {
                if (index % 3 === 1) {
                    if (index === 1) {
                        output = arr[i] + output;
                    } else {
                        output = arr[i] + "." + output;
                    }
                } else {
                    output = arr[i] + output;
                }
            }
        }

        return output;
    }

    public static getCurrentUser() {
        return this.storage.getItem(STORAGE_KEYS.CURRENT_USER) ? JSON.parse(this.storage.getItem(STORAGE_KEYS.CURRENT_USER)) : null;
    }
}
