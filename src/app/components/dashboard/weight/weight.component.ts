import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexMarkers
} from "ng-apexcharts";
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  markers: ApexMarkers
};
@Component({
  selector: 'app-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.css'],
  providers: [DatePipe]
})
export class WeightComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  accessToken: any = JSON.parse(localStorage.getItem("authData"));
  vitals = { "vitals": ["weight"], "sessionKey": this.accessToken.sessionKey };
  latestDate;
  latestRecord
  highestDate;
  highestRecord;
  lowestDate;
  lowestRecord;
  record = [];
  date;

  constructor(
    private tosterService: ToastrService,
    private basicService: BasicService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.basicService.post('patient/get-vitals', this.vitals)
      .subscribe((res: any) => {
        let data = res.payload.payload;
        if (data.length) {

          let date = data.map(e => this.datePipe.transform(e.record_date, 'dd-MMM-yyyy'));
          this.date = Array.from(date.reduce((m, t) => m.set(t, t), new Map()).values());

          let record = data.map(e => this.removeString(e));
          this.record = Array.from(record.reduce((m, t) => m.set(t, t), new Map()).values());

          this.latestDate = new Date(Math.max(...data.map(e => new Date(e.record_date))));
          let latestRec = data.filter(e => { let d = new Date(e.record_date); return d.getTime() == this.latestDate.getTime(); })[0];
          this.latestRecord = latestRec.value + " " + latestRec.unit;

          let highestRecord = Math.max.apply(Math, record.map(o => o))
          let higestDate = data.filter(e => { let d = this.removeString(e); return d == highestRecord })[0];
          this.highestDate = higestDate.record_date;
          this.highestRecord = highestRecord + " " + higestDate.unit;

          let lowestRecord = Math.min.apply(Math, record.map(o => o))
          let lowestDate = data.filter(e => { let d = this.removeString(e); return d == lowestRecord })[0];
          this.lowestDate = lowestDate.record_date;
          this.lowestRecord = lowestRecord + " " + lowestDate.unit;


          this.chartOptions = {
            series: [
              {
                name: "Weight",
                data: this.record
              }
            ],
            chart: {
              height: 450,
              type: "line"
            },
            title: {
              text: "Weight"
            },
            xaxis: {
              categories: this.date
            },
            markers: {
              size: 7,
            }
          };
          return true;
        } else {
          this.tosterService.error('No record found');
          return false;
        }
      });
  }

  removeString(e) {
    let element = e.value;
    if (isNaN(+element))
      return element.replace(/[^0-9]/g, "");
    else
      return element;
  }

}
