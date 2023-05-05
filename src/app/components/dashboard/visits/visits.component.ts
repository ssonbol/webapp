import { Component, OnInit, ViewChild } from '@angular/core';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { map } from 'rxjs/operators';
import { BasicService } from 'src/app/services/basic.service';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css']
})
export class VisitsComponent implements OnInit {
  faAngleRight = faAngleRight;
  providerList = [];
  message = '';
  showAlert = 'd-none';
  providerName = "";
  accessToken: any = JSON.parse(localStorage.getItem("authData"));
  parameters = { "providerName": this.providerName, "sessionKey": this.accessToken.sessionKey, "offset": 0, "pageSize": 2000 }
  username: string = '';
  @ViewChild('f') loginForm: NgForm;

  constructor(
    private basicService: BasicService,
  ) { this.getList(); }

  ngOnInit(): void { }

  getList() {
    this.basicService.post('patient/get-visits', this.parameters,)
      .pipe(
        map((res) => {
          return res as any;
        })
      ).subscribe(
        (res) => {
          if (res.payload.payload.length)
            this.providerList = res.payload.payload;

        });
  }

  getSessionKey() {

  }


}

