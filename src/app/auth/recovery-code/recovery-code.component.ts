import { Component, OnInit } from '@angular/core';
import { Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-recovery-code',
  templateUrl: './recovery-code.component.html',
  styleUrls: ['./recovery-code.component.css']
})
export class RecoveryCodeComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private basicService: BasicService,
    private toastrService: ToastrService,
    private router: Router,
    private shareDataService: ShareDataService,
  ) { }
  copyRight: number = new Date().getFullYear();
  forgetForm = this.fb.group({
    code: ['', Validators.required],
    userName: ''
  })
  ngOnInit(): void {
    this.shareDataService.forgotUserEmail.subscribe(email => {
      if (email) {
        const username = email;
        this.forgetForm.patchValue({ 'userName': username })
      }
      else
        this.router.navigate(['/forgot-password']);
    })
  }
  onSubmit() {
    // let signup_json=this.signupForm.value;
    this.basicService.post('user/reset-password-confirmation-1', this.forgetForm.value)
      .subscribe((res: any) => {
        this.router.navigate(['/forgot-password/change']);
        this.toastrService.success('Create new password');
      });

    console.log(this.forgetForm.value)
  }
}
