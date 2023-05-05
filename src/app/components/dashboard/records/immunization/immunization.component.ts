import { Component, OnInit } from '@angular/core';
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-immunization',
  templateUrl: './immunization.component.html',
  styleUrls: ['./immunization.component.css']
})
export class ImmunizationComponent implements OnInit {

  immunizationList = [];
  accessToken: any = JSON.parse(localStorage.getItem("authData"));
  parameters = { "sessionKey": this.accessToken.sessionKey };

  constructor(
    private basicService: BasicService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.basicService.post('patient/get-immunizations', this.parameters)
      .subscribe((res: any) => {
        let data = res.payload.payload;
        console.log(data);

        data.map(e => this.immunizationList.push({
          title: e.name,
          text: e.status
        }));

      }, err => {
        this.toastrService.error(err.error.errorMsg);
      });
  }

}
