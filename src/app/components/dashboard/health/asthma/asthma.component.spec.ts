import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsthmaComponent } from './asthma.component';

describe('AsthmaComponent', () => {
  let component: AsthmaComponent;
  let fixture: ComponentFixture<AsthmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsthmaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsthmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
