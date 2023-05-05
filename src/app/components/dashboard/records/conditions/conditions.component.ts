import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ShareDataService } from 'src/app/services/share-data.service';
import { BasicService } from 'src/app/services/basic.service';
@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.css']
})
export class ConditionsComponent implements OnInit {
  conditionsList = [];
  accessToken: any = JSON.parse(localStorage.getItem("authData"));
  parameters = { "sessionKey": this.accessToken.sessionKey };

  constructor(
    private basicService: BasicService,
    private shareDataService: ShareDataService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.basicService.post('patient/get-problems', this.parameters)
      .pipe(map(res => { return res as any }))
      .subscribe(
        res => {
          var data = res.payload.payload;
          data.map(e => this.conditionsList.push({ title: e.name, text: e.description }));
          return true;
        });
  }

}
