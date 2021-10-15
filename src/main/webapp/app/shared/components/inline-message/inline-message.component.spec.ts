import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineMessageComponent } from './inline-message.component';

describe('InlineMessageComponent', () => {
  let component: InlineMessageComponent;
  let fixture: ComponentFixture<InlineMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InlineMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
