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
  selector: "[jhiHasPermission]"
})
export class HasPermissionDirective implements OnInit {
  private _value: any;

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private commonService: CommonService
  ) {}

  @Input()
  set jhiHasPermission(value) {
    this._value = value;
    this.updateView(this._value);
  }

  private updateView(value) {
    if (this.commonService.havePermission(value[0])) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  ngOnInit(): void {}
}
