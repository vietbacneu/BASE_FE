import { Injectable } from "@angular/core";
import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { DataCategoryService } from "app/modules/system-categories/data-categories/services/data-category.service";

@Injectable({
  providedIn: "root"
})
export class CustomValidationService {
  constructor(private dataCategoryService: DataCategoryService) {}

  static validFieldNotJustContainSpace(
    control: AbstractControl
  ): ValidationErrors | null {
    if ((control.value as string).trim().length <= 0) {
      return { cannotJustContainSpace: true };
    }
    return null;
  }

  static validMaxLength(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (value !== "" && value !== null) {
      if (value.trim().length > 20) {
        return { validMaxLength: true };
      }
    }
    return null;
  }

  static validMaxLength250(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (value !== "" && value !== null) {
      if (value.trim().length > 250) {
        return { validMaxLength250: true };
      }
    }
    return null;
  }

  static validMaxLength255(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (value !== "" && value !== null) {
      if (value.trim().length > 255) {
        return { validMaxLength255: true };
      }
    }
    return null;
  }
}
