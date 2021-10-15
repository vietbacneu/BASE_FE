import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'jhi-setting-time',
  templateUrl: './setting-time.component.html',
  styleUrls: ['./setting-time.component.scss']
})
export class SettingTimeComponent implements OnInit {
  @Input() formGroup;
  constructor() { }

  ngOnInit(): void {
  }

}
