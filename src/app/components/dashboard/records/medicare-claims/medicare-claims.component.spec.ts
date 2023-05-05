import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicareClaimsComponent } from './medicare-claims.component';

describe('MedicareClaimsComponent', () => {
  let component: MedicareClaimsComponent;
  let fixture: ComponentFixture<MedicareClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicareClaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicareClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
