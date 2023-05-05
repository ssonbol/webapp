import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizationControlsComponent } from './authorization-controls.component';

describe('AuthorizationControlsComponent', () => {
  let component: AuthorizationControlsComponent;
  let fixture: ComponentFixture<AuthorizationControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizationControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizationControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
