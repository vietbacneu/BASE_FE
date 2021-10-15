import { Directive, ElementRef, HostListener, Inject, Input, Optional, Renderer2 } from '@angular/core';
import { COMPOSITION_BUFFER_MODE, ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'input[type="text"], textarea[]',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: InputTrimDirective, multi: true }]
})
export class InputTrimDirective implements ControlValueAccessor {
  // Get a value of the trim attribute if it was set.
  @Input() trim: string;

  @Input()
  set type(value: string) {
    this._type = value || 'text';
  }

  /**
   * Keep the type of input element in a cache.
   *
   */
  private _type = 'text';

  /**
   * Keep the value of input element in a cache.
   *
   */
  private _value: string;

  // Source services to modify elements.
  private _sourceRenderer: Renderer2;
  private _sourceElementRef: ElementRef;

  /**
   * Updates the value on the blur event.
   */
  @HostListener('blur', ['$event.type', '$event.target.value'])
  onBlur(event: string, value: string): void {
    this.updateValue(event, value.trim());
    this.onTouched();
  }

  /**
   * Updates the value on the input event.
   */
  @HostListener('input', ['$event.type', '$event.target.value'])
  onInput(event: string, value: string): void {
    this.updateValue(event, value);
  }

  onChange = (_: any) => {};

  onTouched = () => {};

  constructor(
    @Inject(Renderer2) renderer: Renderer2,
    @Inject(ElementRef) elementRef: ElementRef,
    @Optional() @Inject(COMPOSITION_BUFFER_MODE) compositionMode: boolean
  ) {
    this._sourceRenderer = renderer;
    this._sourceElementRef = elementRef;
  }

  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }

  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  /**
   * Writes a new value to the element based on the type of input element.
   *
   */
  public writeValue(value: any): void {
    //
    // The Template Driven Form doesn't automatically convert undefined values to null. We will do,
    // keeping an empty string as string because the condition `'' || null` returns null what
    // could change the initial state of a model.
    // The Reactive Form does it automatically during initialization.
    //
    // SEE: https://github.com/anein/angular2-trim-directive/issues/18
    //
    this._value = value;

    this._sourceRenderer.setProperty(this._sourceElementRef.nativeElement, 'value', this._value);

    // a dirty trick (or magic) goes here:
    // it updates the element value if `setProperty` doesn't set a new value for some reason.
    //
    // SEE: https://github.com/anein/angular2-trim-directive/issues/9
    //
    if (this._type !== 'text') {
      this._sourceRenderer.setAttribute(this._sourceElementRef.nativeElement, 'value', this._value);
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this._sourceRenderer.setProperty(this._sourceElementRef.nativeElement, 'disabled', isDisabled);
  }

  /**
   * Trims an input value, and sets it to the model and element.
   *
   */
  private updateValue(event: string, value: string): void {
    // check if the user has set an optional attribute, and Trimmmm!!! Uhahahaha!
    value = this.trim !== '' && event !== this.trim ? value : value.trim();

    const previous = this._value;

    // write value to the element.
    this.writeValue(value);

    // Update the model only on getting new value, and prevent firing
    // the `dirty` state when click on empty fields.
    //
    // SEE:
    //    https://github.com/anein/angular2-trim-directive/issues/17
    //    https://github.com/anein/angular2-trim-directive/issues/35
    //    https://github.com/anein/angular2-trim-directive/issues/39
    //
    if ((this._value || previous) && this._value.trim() !== previous) {
      this.onChange(this._value);
    }
  }
}
