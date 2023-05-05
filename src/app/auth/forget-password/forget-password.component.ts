import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';
import { ShareDataService } from 'src/app/services/share-data.service';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private basicService: BasicService,
    private shareDataService: ShareDataService,
    private toastrService: ToastrService,
    private router: Router) { }

  copyRight: number = new Date().getFullYear();
  forgetForm = this.fb.group({
    userName: ['', Validators.required]
  })

  ngOnInit(): void {
  }

  onSubmit() {
    this.basicService.post('user/reset-password', this.forgetForm.value)
      .subscribe(() => {
        this.shareDataService.forgotUserEmail.next(this.forgetForm.value.userName);

        this.router.navigate(['/forgot-password/code']);
        this.toastrService.success('Please check you email');
      });

  }
}
