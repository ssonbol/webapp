import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import StaticData from 'src/app/constants/StaticData';
import { ShareDataService } from 'src/app/services/share-data.service';
import { RiskPrediction } from 'src/app/utils/RiskCalculator';

@Component({
  selector: 'app-asthma',
  templateUrl: './asthma.component.html',
  styleUrls: ['./asthma.component.css']
})
export class AsthmaComponent implements OnInit {
  gaugeValue = 0;

  guageConfig = {
    '0': { color: 'red' },
    '31': { color: 'orange' },
    '61': { color: 'green' }
  };

  ashtmaForm = this.fb.group({
    race: this.fb.control(null, Validators.required),
    gender: this.fb.control(null, Validators.required),
    BMI: this.fb.control(null, Validators.required),
    oralContraceptives: this.fb.control(null),
  })

  Races = StaticData.raceList;
  Genders = StaticData.gender;

  constructor(
    private shareDataService: ShareDataService,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.bindForm();
  }

  getFormControlValue(controlName: string): string {
    return this.ashtmaForm.get(controlName).value;
  }

  onSubmit() {
    if (this.ashtmaForm.valid) {
      console.log(this.ashtmaForm.value);
      const percentage = RiskPrediction.asthmaRS({ ...this.ashtmaForm.value, age: this.shareDataService.getAge() }).percentage;
      console.log(percentage);
      this.gaugeValue = +percentage;
    } else {
      this.toastrService.error('Please fill the required fileds');
    }
  }

  bindForm() {
    this.ashtmaForm.patchValue({
      race: '',
      gender: '',
      BMI: 0,
      oralContraceptives: false,
    });
    this.gaugeValue = 0;
  }

}
