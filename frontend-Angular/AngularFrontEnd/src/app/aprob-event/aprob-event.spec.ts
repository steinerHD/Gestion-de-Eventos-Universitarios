import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobEvent } from './aprob-event';

describe('AprobEvent', () => {
  let component: AprobEvent;
  let fixture: ComponentFixture<AprobEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprobEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprobEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
