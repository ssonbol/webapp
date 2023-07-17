import { Component, OnInit } from '@angular/core';
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-medications',
  templateUrl: './medications.component.html',
  styleUrls: ['./medications.component.css']
})
export class MedicationsComponent implements OnInit {

  medicationsList = [];
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
    this.basicService.post('patient/get-medications', this.parameters)
      .subscribe((res: any) => {
        let data = res.payload.payload;
        console.log(data);

        data.map(e => this.medicationsList.push({
          title: e.name,
          text: e.instructions
        }));

      }, err => {
        // this.toastrService.error(err.error.errorMsg);
        console.error("get-medications", err.error.errorMsg)
      });
  }

}
