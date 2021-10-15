import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'app-inline-message',
  templateUrl: './inline-message.component.html',
  styleUrls: ['./inline-message.component.scss']
})
export class InlineMessageComponent implements OnInit {
  @Input() formName: FormControl;
  @Input() message;

  constructor() {
  }

  ngOnInit(): void {
  }

}
