import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BasicService } from 'src/app/services/basic.service';

@Component({
  selector: 'app-medicare-claims',
  templateUrl: './medicare-claims.component.html',
  styleUrls: ['./medicare-claims.component.css']
})
export class MedicareClaimsComponent implements OnInit {

  medicareList = [];
  accessToken: any = JSON.parse(localStorage.getItem("authData"));
  parameters = { "sessionKey": this.accessToken.sessionKey, "page_number": 1, "page_size": 2000 }

  constructor(
    private basicService: BasicService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.basicService.post('share/get-user-claims-mobile', this.parameters)
      .subscribe((res: any) => {
        let data = res.payload.userClaims;
        console.log(data);

        data.map(e => this.medicareList.push({
          title: e.claim_reference_id,
          type: e.claim_type,
          period_start: e.billable_period_start,
          price: e.payment_value,
        }));

      }, err => {
        this.toastrService.error(err.error.errorMsg);
      });
  }
}
