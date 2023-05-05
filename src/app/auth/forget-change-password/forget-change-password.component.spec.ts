import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetChangePasswordComponent } from './forget-change-password.component';

describe('ForgetChangePasswordComponent', () => {
  let component: ForgetChangePasswordComponent;
  let fixture: ComponentFixture<ForgetChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgetChangePasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
