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
  markers: ApexMarkers;
};
@Component({
  selector: 'app-blood-pressure',
  templateUrl: './blood-pressure.component.html',
  styleUrls: ['./blood-pressure.component.css'],
  providers: [DatePipe]
})
export class BloodPressureComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  accessToken: any = JSON.parse(localStorage.getItem("authData"));
  lowParameters = { "vitals": ["diastolic"], "sessionKey": this.accessToken.sessionKey };
  highParameters = { "vitals": ["systolic"], "sessionKey": this.accessToken.sessionKey };
  message = "";
  showAlert = "d-none";
  latestDate;
  latestRecord;
  getChart;
  high = [];
  low = [];
  date;

  constructor(
    private basicService: BasicService,
    private datePipe: DatePipe
  ) {
    this.getVitalsLowParameters();
    this.getVitalsHighParameters();
  }

  ngOnInit(): void {

    this.getChart = () => {
      this.chartOptions = {
        series: [
          {
            name: "High",
            data: this.high
          },
          {
            name: "Low",
            data: this.low
          }
        ],
        chart: {
          height: 450,
          type: "line"
        },
        title: {
          text: "Blood Pressure"
        },
        xaxis: {
          categories: this.date
        },
        markers: {
          size: 7,
        }
      };
    }
  }

  getVitalsLowParameters() {
    this.basicService.post('patient/get-vitals', this.lowParameters)
      .pipe(
        map((res) => {
          return res as any;
        })
      ).subscribe((res: any) => {
        if (!res.errorCode) {
          var data = res.payload.payload;
          var date = data.map(e => this.datePipe.transform(e.record_date, 'dd-MMM-yyyy'));
          this.date = Array.from(date.reduce((m, t) => m.set(t, t), new Map()).values());

          var record = data.map(e => e.value);
          this.low = Array.from(record.reduce((m, t) => m.set(t, t), new Map()).values());

          this.latestDate = new Date(Math.max(...data.map(e => new Date(e.record_date))));
          var latestRec = data.filter(e => { var d = new Date(e.record_date); return d.getTime() == this.latestDate.getTime(); })[0];
          if (this.latestRecord) {
            this.latestRecord = this.latestRecord + "/" + latestRec.value;
          } else {
            this.latestRecord = latestRec.value;
          }
        } else {
          this.showAlert = "d-block";
          this.message = res.errorMsg;
        }
        return true;
      },
        err => {
          this.showAlert = "d-block";
          this.message = err.error.errorMsg;

        },
        () => { this.getChart(); });
  }

  getVitalsHighParameters() {
    this.basicService.post('patient/get-vitals', this.highParameters)
      .pipe(
        map((res) => {
          return res as any;
        })
      ).subscribe((res: any) => {
        if (!res.errorCode) {
          var data = res.payload.payload;

          var record = data.map(e => e.value);
          this.high = Array.from(record.reduce((m, t) => m.set(t, t), new Map()).values());

          this.latestDate = new Date(Math.max(...data.map(e => new Date(e.record_date))));
          var latestRec = data.filter(e => { var d = new Date(e.record_date); return d.getTime() == this.latestDate.getTime(); })[0];
          if (this.latestRecord) {
            this.latestRecord = this.latestRecord + "/" + latestRec.value;
          } else {
            this.latestRecord = latestRec.value;
          }

        } else {
          this.showAlert = "d-block";
          this.message = res.errorMsg;
        }
        return true;
      },
        err => {
          this.showAlert = "d-block";
          this.message = err.error.errorMsg;
        },
        () => { this.getChart(); });
  }

}

