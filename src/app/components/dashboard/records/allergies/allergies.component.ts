import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ShareDataService } from 'src/app/services/share-data.service';
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-allergies',
  templateUrl: './allergies.component.html',
  styleUrls: ['./allergies.component.css'],
})
export class AllergiesComponent implements OnInit {
  allergiesList = [];
  accessToken: any = JSON.parse(localStorage.getItem("authData"));
  parameters = { "sessionKey": this.accessToken.sessionKey };

  constructor(
    private shareDataService: ShareDataService,
    private basicService: BasicService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.basicService.post('patient/get-allergies', this.parameters)
      .pipe(map(res => { return res as any }))
      .subscribe(
        res => {
          var data = res.payload.payload;
          data.map(e => this.allergiesList.push({ title: e.name ? e.name : "No name available", text: e.allergen_name ?  e.allergen_name : 'N/A' }));
          return true;
        })
  }
}
