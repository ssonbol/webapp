import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BloodPressureComponent } from './components/dashboard/blood-pressure/blood-pressure.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './components/dashboard/header/header.component';
import { HealthComponent } from './components/dashboard/health/health.component';
import { ProviderComponent } from './components/dashboard/provider/provider.component';
import { TemperatureComponent } from './components/dashboard/temperature/temperature.component';
import { WeightComponent } from './components/dashboard/weight/weight.component';
import { HeightComponent } from './components/dashboard/height/height.component';
import { BmiComponent } from './components/dashboard/bmi/bmi.component';
import { PulseComponent } from './components/dashboard/pulse/pulse.component';
import { RecordComponent } from './components/dashboard/records/record/record.component';
import { AllergiesComponent } from './components/dashboard/records/allergies/allergies.component';
import { MedicationsComponent } from './components/dashboard/records/medications/medications.component';
import { ImmunizationComponent } from './components/dashboard/records/immunization/immunization.component';
import { ConditionsComponent } from './components/dashboard/records/conditions/conditions.component';
import { LabResultsComponent } from './components/dashboard/records/lab-results/lab-results.component';
import { NotesComponent } from './components/dashboard/records/notes/notes.component';
import { DocumentsComponent } from './components/dashboard/records/documents/documents.component';
import { AsthmaComponent } from './components/dashboard/health/asthma/asthma.component';
import { HttpConfig } from './utils/httpconfig.interceptor';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BasicService } from './services/basic.service';
import { ShareDataService } from './services/share-data.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { StrokeComponent } from './components/dashboard/health/stroke/stroke.component';
import { CardiovascularComponent } from './components/dashboard/health/cardiovascular/cardiovascular.component';
import { VisitsComponent } from './components/dashboard/visits/visits.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ProfileComponent } from './components/dashboard/settings/profile/profile.component';
import { MyCircleComponent } from './components/dashboard/settings/my-circle/my-circle.component';
import { MyAuthorizationsComponent } from './components/dashboard/settings/my-authorizations/my-authorizations.component';
import { RemindersComponent } from './components/dashboard/settings/reminders/reminders.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { CircleComponent } from './components/dashboard/settings/my-circle/circle/circle.component';
import { OrganizationComponent } from './components/dashboard/settings/my-circle/organization/organization.component';
import { ContactComponent } from './components/dashboard/settings/my-circle/contact/contact.component';
import { AddEditReminderComponent } from './components/dashboard/settings/reminders/add-edit-reminder/add-edit-reminder.component';
import { PdfComponent } from './components/dashboard/visits/pdf/pdf.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MedicareClaimsComponent } from './components/dashboard/records/medicare-claims/medicare-claims.component';
import { RecoveryCodeComponent } from './auth/recovery-code/recovery-code.component';
import { ForgetChangePasswordComponent } from './auth/forget-change-password/forget-change-password.component';
import { AuthorizationControlsComponent } from './components/dashboard/settings/authorization-controls/authorization-controls.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShareComponent } from './components/dashboard/settings/share/share.component';
import { CallbackComponent } from './components/callback/callback.component';
import { PolicyComponent } from './policy/policy.component';
import { LicenseComponent } from './license/license.component';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,

    LoginComponent,
    HeaderComponent,
    HealthComponent,
    ProviderComponent,
    TemperatureComponent,
    WeightComponent,
    HeightComponent,
    BmiComponent,
    PulseComponent,
    BloodPressureComponent,
    RecordComponent,
    AllergiesComponent,
    MedicationsComponent,
    ImmunizationComponent,
    ConditionsComponent,
    LabResultsComponent,
    NotesComponent,
    DocumentsComponent,
    AsthmaComponent,
    DashboardComponent,
    StrokeComponent,
    CardiovascularComponent,
    VisitsComponent,
    SignupComponent,
    ForgetPasswordComponent,
    ProfileComponent,
    MyCircleComponent,
    MyAuthorizationsComponent,
    RemindersComponent,
    CircleComponent,
    OrganizationComponent,
    ContactComponent,
    AddEditReminderComponent,
    PdfComponent,
    MedicareClaimsComponent,
    RecoveryCodeComponent,
    ForgetChangePasswordComponent,
    AuthorizationControlsComponent,
    ShareComponent,
    CallbackComponent,
    PolicyComponent,
    LicenseComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PdfViewerModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot({
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    }),
    NgxGaugeModule
  ],
  providers: [
    ToastrService,
    BasicService,
    ShareDataService,

    { multi: true, provide: HTTP_INTERCEPTORS, useClass: HttpConfig },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
