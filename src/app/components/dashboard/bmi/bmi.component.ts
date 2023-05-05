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

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  markers: ApexMarkers
};
@Component({
  selector: 'app-bmi',
  templateUrl: './bmi.component.html',
  styleUrls: ['./bmi.component.css'],
  providers: [DatePipe]
})
export class BmiComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  accessToken: any = JSON.parse(localStorage.getItem("authData"));
  vitals = { "vitals": ["bmi"], "sessionKey": this.accessToken.sessionKey };
  latestRecord;
  latestDate;
  highestDate;
  highestRecord;
  lowestRecord;
  lowestDate;
  record = [];
  date;

  constructor(
    private basicService: BasicService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.basicService.post('patient/get-vitals', this.vitals)
      .pipe(map(res => { return res as any }))
      .subscribe(
        res => {
          var data = res.payload.payload;
          var date = data.map(e => this.datePipe.transform(e.record_date, 'dd-MMM-yyyy'));
          this.date = Array.from(date.reduce((m, t) => m.set(t, t), new Map()).values());

          let record = data.map(e => this.removeString(e));
          this.record = Array.from(record.reduce((m, t) => m.set(t, t), new Map()).values());
          //date = date.reduce(e=> e);
          this.latestDate = new Date(Math.max(...data.map(e => new Date(e.record_date))));
          var latestRec = data.filter(e => { var d = new Date(e.record_date); return d.getTime() == this.latestDate.getTime(); })[0];
          this.latestRecord = latestRec.value + " " + latestRec.unit;
          var highestRecord = Math.max.apply(Math, record.map(o => o))
          let higestDate = data.filter(e => { let d = this.removeString(e); return d == highestRecord })[0];
          this.highestDate = higestDate.record_date;
          this.highestRecord = highestRecord + " " + higestDate.unit;
          var lowestRecord = Math.min.apply(Math, record.map(o => o))
          let lowestDate = data.filter(e => { let d = this.removeString(e); return d == lowestRecord })[0];
          this.lowestDate = lowestDate.record_date;
          this.lowestRecord = lowestRecord + " " + lowestDate.unit;

          this.chartOptions = {
            series: [
              {
                name: "BMI",
                data: this.record
              }
            ],
            chart: {
              height: 450,
              type: "line"
            },
            title: {
              text: "Body Mass Index"
            },
            xaxis: {
              categories: this.date
            },
            markers: {
              size: 7,
            }
          };

          return true;

        })
  }


  removeString(e) {
    let element = e.value;
    if (isNaN(+element))
      return element.replace(/[^0-9]/g, "");
    else
      return element;
  }
}
