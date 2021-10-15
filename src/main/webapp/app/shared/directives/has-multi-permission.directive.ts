import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from "@angular/core";
import { CommonService } from "app/shared/services/common.service";

@Directive({
  selector: "[jhiHasMultiPermission]"
})
export class HasMultiPermissionDirective implements OnInit {
  private _value: any;

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private commonService: CommonService
  ) {}

  @Input()
  set jhiHasMultiPermission(value) {
    this._value = value;
    this.updateView(this._value);
  }

  private updateView(value) {
    if (this.commonService.havePermission(value[0])) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
    for (let i = 1; i < value.length; i++) {
      if (!value[i]) {
        this.viewContainer.clear();
      }
    }
  }

  ngOnInit(): void {}
}
