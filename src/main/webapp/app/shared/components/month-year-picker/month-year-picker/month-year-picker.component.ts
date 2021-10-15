import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from "@angular/core";

import { DataFormatService } from "app/shared/services/data-format.service";
import { isFunction } from "rxjs/internal-compatibility";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl
} from "@angular/forms";
import { noop } from "rxjs";
import createAutoCorrectedDatePipe from "text-mask-addons/dist/createAutoCorrectedDatePipe";
import * as textMask from "vanilla-text-mask/dist/vanillaTextMask.js";
import { DatePipe } from "@angular/common";
import {
  BsDatepickerConfig,
  BsDatepickerViewMode
} from "ngx-bootstrap/datepicker";

@Component({
  selector: "jhi-month-year-picker",
  templateUrl: "./month-year-picker.component.html",
  styleUrls: ["./month-year-picker.component.scss"],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      useExisting: forwardRef(() => MonthYearPickerComponent),
      multi: true
    }
  ]
})
export class MonthYearPickerComponent
  implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input() dateString: string;
  @Input() className: string;
  @Input() text: string;
  @Input() isRequired: boolean;
  @Output() onChooseDate = new EventEmitter<any>();
  @Input() isDisabled = false;
  @Input() touched = 0;
  @Input() msgError: string;
  @ViewChild("input", { read: ViewContainerRef, static: true }) public input;

  onTouched: (_: any) => void = noop;
  onChange: (_: any) => void = noop;

  selectedValue;
  isError = false;
  ngControl: NgControl;
  mask = [/\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/];
  autoCorrectedDatePipe = createAutoCorrectedDatePipe("mm/yyyy");
  maskedInputController;
  firstTimeAssign = true;
  minDate = new Date();
  month_element = document.querySelector(
    ".bs-datepicker-body .months .ng-star-inserted>span"
  );

  constructor(
    private cdr: ChangeDetectorRef,
    private dataFormatService: DataFormatService,
    private renderer: Renderer2,
    private inj: Injector
  ) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.maskedInputController = textMask.maskInput({
        inputElement: this.input.element.nativeElement,
        mask: this.mask,
        pipe: this.autoCorrectedDatePipe,
        keepCharPositions: true
      });
    });
  }
  ngOnInit() {
    this.ngControl = this.inj.get(NgControl);
    this.minDate.setFullYear(1000);
  }

  ngOnDestroy() {
    if (this.maskedInputController) {
      this.maskedInputController.destroy();
    }
  }

  onInputChange(event) {
    if (event !== null && event !== "") {
      this.selectedValue = this.dataFormatService.formatMonth(event);
      const tem = event.getFullYear();
      if (tem >= 1000 && tem <= 9999) {
        if (isFunction(this.onChange)) {
          this.onChange(this.dataFormatService.formatMonth(event));
          this.onChooseDate.emit(this.selectedValue);
        }
        this.onChooseDate.next(this.selectedValue);
      } else {
        this.selectedValue = event.toString().replace(event, "");
        this.onChooseDate.emit(this.selectedValue);
      }
    } else {
      this.onChooseDate.emit(null);
    }
  }

  setDisabledState?(isDisabled: boolean): void {}

  writeValue(val: string) {
    if (typeof val === "string") {
      this.selectedValue = val ? new Date(val) : "";
    } else if (typeof val === "number") {
      this.selectedValue = val ? new Date(val) : "";
    } else {
      this.selectedValue = val ? val : "";
    }
    this.selectedValue = val ? val : "";
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode("month");
  }
  onChangeBlur() {
    this.touched
      ? (this.isError =
          this.selectedValue.toString() === null ||
          this.selectedValue.toString() === "")
      : (this.isError = false);
  }
}
