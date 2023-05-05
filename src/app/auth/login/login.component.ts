import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  message = '';
  showAlert = 'd-none';
  copyRight: number = new Date().getFullYear();
  @ViewChild('f') loginForm: NgForm;

  constructor(
    private basicService: BasicService,
    private shareDataService: ShareDataService,
    private toastrService: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void { }

  onSubmit() {
    this.basicService.post('user/login', this.loginForm.value)
      .subscribe((res: any) => {
        const payload = res.payload;
        this.shareDataService.settingUserData(payload);

        this.router.navigate(['/health']);
        this.toastrService.success('Succcessfully loged In');
      });
  }
}
