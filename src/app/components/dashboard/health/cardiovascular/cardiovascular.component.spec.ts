import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardiovascularComponent } from './cardiovascular.component';

describe('CardiovascularComponent', () => {
  let component: CardiovascularComponent;
  let fixture: ComponentFixture<CardiovascularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardiovascularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardiovascularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
