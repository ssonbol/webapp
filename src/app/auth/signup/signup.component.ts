import { Component, OnInit } from '@angular/core';
import { Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  constructor(private fb: FormBuilder,
    private basicService: BasicService,
    private toastrService: ToastrService,
    private router: Router) { }

  signupForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required,
      // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
    ]],
    confirm_password: ['', [Validators.required,
      // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
    ]],
    mobile: ['', [Validators.required,
      // Validators.pattern("^[0-9]*$"),
      // Validators.minLength(10), Validators.maxLength(10)
    ]],
    fname: ['', Validators.required],
    lname: ['', Validators.required],
    maiden_name: [''],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    postal_code: ['', Validators.required],
    dob: ['', Validators.required],
    photoUrl: "",
    ethnic_group: null,
    marital_status: null,
    user_type: "patient",
    device_type: "Web",
  })
  message = '';
  showAlert = 'd-none';
  copyRight: number = new Date().getFullYear();


  ngOnInit(): void {
  }
  onSubmit() {
    // let signup_json=this.signupForm.value;
    this.basicService.post('user/signup', this.signupForm.value)
      .subscribe((res: any) => {
        this.router.navigate(['/login']);
        this.toastrService.success('Succcessfully account created');
      });

    console.log(this.signupForm.value)
  }
}
