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
import { ShareDataService } from 'src/app/services/share-data.service';
import { BasicService } from 'src/app/services/basic.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  markers: ApexMarkers
};
@Component({
  selector: 'app-pulse',
  templateUrl: './pulse.component.html',
  styleUrls: ['./pulse.component.css'],
  providers: [DatePipe]
})
export class PulseComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  accessToken: any = JSON.parse(localStorage.getItem("authData"));
  vitals = { "vitals": ["pulse"], "sessionKey": this.accessToken.sessionKey };
  latestDate;
  latestRecord;
  highestDate;
  highestRecord;
  lowestDate;
  lowestRecord;
  record = [];
  date;

  constructor(
    private basicService: BasicService,
    private datePipe: DatePipe,
    private shareDataService: ShareDataService,
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

          var record = data.map(e => e.value);
          this.record = Array.from(record.reduce((m, t) => m.set(t, t), new Map()).values());
          //date = date.reduce(e=> e);
          this.latestDate = new Date(Math.max(...data.map(e => new Date(e.record_date))));
          var latestRec = data.filter(e => { var d = new Date(e.record_date); return d.getTime() == this.latestDate.getTime(); })[0];
          this.latestRecord = latestRec.value + " " + latestRec.unit;

          var highestRecord = Math.max.apply(Math, data.map(function (o) { return o.value; }))
          var higestDate = data.filter(e => { var d = e.value; return d == highestRecord })[0];
          this.highestDate = higestDate.record_date;
          this.highestRecord = highestRecord + " " + higestDate.unit;

          var lowestRecord = Math.min.apply(Math, data.map(function (o) { return o.value; }))
          var lowestDate = data.filter(e => { var d = e.value; return d == lowestRecord })[0];
          this.lowestDate = lowestDate.record_date;
          this.lowestRecord = lowestRecord + " " + lowestDate.unit;


          this.chartOptions = {
            series: [
              {
                name: "Pulse",
                data: this.record
              }
            ],
            chart: {
              height: 450,
              type: "line"
            },
            title: {
              text: "Pulse"
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
}
