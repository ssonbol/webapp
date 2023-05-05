import { Component, OnInit, } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-forget-change-password',
  templateUrl: './forget-change-password.component.html',
  styleUrls: ['./forget-change-password.component.css']
})
export class ForgetChangePasswordComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private basicService: BasicService,
    private shareDataService: ShareDataService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  copyRight: number = new Date().getFullYear();
  username = ''
  forgetForm = this.fb.group({
    password: ['', [Validators.required,
      // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
    ]],
    confirm_password: ['', [Validators.required,
      // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
    ]]
  })

  ngOnInit(): void {
    this.shareDataService.forgotUserEmail.subscribe(email => {
      if (email)
        this.username = email;
      else
        this.router.navigate(['/forgot-password']);
    })
  }

  onSubmit() {
    let forget_json = {
      sendingOption: "1",
      userName: this.username,
      password: this.forgetForm.value.password
    }
    this.basicService.post('user/reset-password-confirmation-2', forget_json)
      .subscribe((res: any) => {
        this.router.navigate(['/login']);
        this.toastrService.success('Password reset successfully');
      });
  }

}
