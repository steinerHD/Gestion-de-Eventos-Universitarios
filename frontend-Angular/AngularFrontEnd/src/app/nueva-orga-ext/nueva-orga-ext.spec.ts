import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaOrgaExt } from './nueva-orga-ext';

describe('NuevaOrgaExt', () => {
  let component: NuevaOrgaExt;
  let fixture: ComponentFixture<NuevaOrgaExt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaOrgaExt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaOrgaExt);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
