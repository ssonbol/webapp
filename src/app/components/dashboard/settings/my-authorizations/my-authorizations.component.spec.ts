import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAuthorizationsComponent } from './my-authorizations.component';

describe('MyAuthorizationsComponent', () => {
  let component: MyAuthorizationsComponent;
  let fixture: ComponentFixture<MyAuthorizationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAuthorizationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAuthorizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
