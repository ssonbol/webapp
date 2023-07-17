import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { BloodPressureComponent } from './components/dashboard/blood-pressure/blood-pressure.component';
import { TemperatureComponent } from './components/dashboard/temperature/temperature.component';
import { HealthComponent } from './components/dashboard/health/health.component';
import { BmiComponent } from './components/dashboard/bmi/bmi.component';
import { HeightComponent } from './components/dashboard/height/height.component';
import { PulseComponent } from './components/dashboard/pulse/pulse.component';
import { ProviderComponent } from './components/dashboard/provider/provider.component';
import { WeightComponent } from './components/dashboard/weight/weight.component';
import { RecordComponent } from './components/dashboard/records/record/record.component';
import { AllergiesComponent } from './components/dashboard/records/allergies/allergies.component';
import { MedicationsComponent } from './components/dashboard/records/medications/medications.component';
import { ImmunizationComponent } from './components/dashboard/records/immunization/immunization.component';
import { ConditionsComponent } from './components/dashboard/records/conditions/conditions.component';
import { LabResultsComponent } from './components/dashboard/records/lab-results/lab-results.component';
import { NotesComponent } from './components/dashboard/records/notes/notes.component';
import { DocumentsComponent } from './components/dashboard/records/documents/documents.component';
import { AsthmaComponent } from './components/dashboard/health/asthma/asthma.component';
import { AuthGuard } from './utils/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StrokeComponent } from './components/dashboard/health/stroke/stroke.component';
import { CardiovascularComponent } from './components/dashboard/health/cardiovascular/cardiovascular.component';
import { VisitsComponent } from './components/dashboard/visits/visits.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { MyAuthorizationsComponent } from './components/dashboard/settings/my-authorizations/my-authorizations.component';
import { MyCircleComponent } from './components/dashboard/settings/my-circle/my-circle.component';
import { ProfileComponent } from './components/dashboard/settings/profile/profile.component';
import { RemindersComponent } from './components/dashboard/settings/reminders/reminders.component';
import { ContactComponent } from './components/dashboard/settings/my-circle/contact/contact.component';
import { AddEditReminderComponent } from './components/dashboard/settings/reminders/add-edit-reminder/add-edit-reminder.component';
import { PdfComponent } from './components/dashboard/visits/pdf/pdf.component';
import { MedicareClaimsComponent } from './components/dashboard/records/medicare-claims/medicare-claims.component';
import { RecoveryCodeComponent } from './auth/recovery-code/recovery-code.component';
import { ForgetChangePasswordComponent } from './auth/forget-change-password/forget-change-password.component';
import { AuthorizationControlsComponent } from './components/dashboard/settings/authorization-controls/authorization-controls.component';
import { ShareComponent } from './components/dashboard/settings/share/share.component';
import { CallbackComponent } from './components/callback/callback.component';
import { PolicyComponent } from './policy/policy.component';
import { LicenseComponent } from './license/license.component';

const routes: Routes = [
  { path: '', redirectTo: '/health', pathMatch: 'full' },
  { path: '', component: HealthComponent },
  { path: 'callback', component: CallbackComponent},
  { path: 'policy', component: PolicyComponent},
  { path: 'license', component: LicenseComponent},

  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgetPasswordComponent },
  {
    path: 'forgot-password',
    children: [
      { path: 'code', component: RecoveryCodeComponent },
      { path: 'change', component: ForgetChangePasswordComponent },
    ]
  },
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'temperature', component: TemperatureComponent },
      { path: 'bodyMassIndex', component: BmiComponent },
      { path: 'height', component: HeightComponent },
      { path: 'bloodPressure', component: BloodPressureComponent },
      { path: 'pulse', component: PulseComponent },
      { path: 'weight', component: WeightComponent },
      { path: 'pdf-view/:id', component: PdfComponent },

      // setting routes
      { path: 'my-authorizations', component: MyAuthorizationsComponent },
      { path: 'share', component: ShareComponent },
      { path: 'my-circle', component: MyCircleComponent },
      { path: 'share', component: ShareComponent },
      { path: 'authorization-controls', component: AuthorizationControlsComponent },

      // Circle Routes
      {
        path: 'my-circle',
        children: [
          { path: 'contact', component: ContactComponent },
        ]
      },
      { path: 'profile', component: ProfileComponent },
      { path: 'reminders', component: RemindersComponent },
      {
        path: 'reminders',
        children: [
          { path: 'add-edit-reminder', component: AddEditReminderComponent }
        ]
      },
      // header menus
      { path: 'health', component: HealthComponent, },
      { path: 'provider', component: ProviderComponent },
      { path: 'records', component: RecordComponent },
      { path: 'visits', component: VisitsComponent },
      // Dashboard Routes
      {
        path: 'health',
        children: [
          { path: 'asthma', component: AsthmaComponent },
          { path: 'stroke', component: StrokeComponent },
          { path: 'cardiovascular', component: CardiovascularComponent },
        ]
      },
      {
        path: 'records',
        children: [
          { path: 'allergies', component: AllergiesComponent },
          { path: 'medications', component: MedicationsComponent },
          { path: 'immunization', component: ImmunizationComponent },
          { path: 'conditions', component: ConditionsComponent },
          { path: 'lab-results', component: LabResultsComponent },
          { path: 'notes', component: NotesComponent },
          { path: 'documents', component: DocumentsComponent },
          { path: 'documents/:providerId/:visitReferenceId', component: DocumentsComponent },
          { path: 'medicare-claims', component: MedicareClaimsComponent },
        ]
      },
    ],
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
