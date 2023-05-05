import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import StaticData from 'src/app/constants/StaticData';
import { ShareDataService } from 'src/app/services/share-data.service';
import { RiskPrediction } from 'src/app/utils/RiskCalculator';

@Component({
  selector: 'app-stroke',
  templateUrl: './stroke.component.html',
  styleUrls: ['./stroke.component.css']
})
export class StrokeComponent implements OnInit {
  gaugeValue = 0;
  gaugePrepend = '<';

  guageConfig = {
    '0': { color: 'red' },
    '31': { color: 'orange' },
    '61': { color: 'green' }
  };

  strokeForm = this.fb.group({
    education: this.fb.control(null),
    gender: this.fb.control(null),
    renalDisease: this.fb.control(null),
    diabetes: this.fb.control(null),
    congestiveHeartFailure: this.fb.control(null),
    peripheralArterialDisease: this.fb.control(null),
    highBloodPressure: this.fb.control(null),
    ischemicHeartDisease: this.fb.control(null),
    smoking: this.fb.control(null),
    formerSmoker: this.fb.control(null),
    alcoholicDrinks: this.fb.control(null),
    formerDrinker: this.fb.control(null),
    physicalActivity: this.fb.control(null),
    indicatorsOfAnger: this.fb.control(null),
    depression: this.fb.control(null),
    anxiety: this.fb.control(null),
  })

  Genders = StaticData.gender;
  Education = StaticData.educationList;

  constructor(
    private fb: FormBuilder,
    private shareDataService: ShareDataService,
    ) { }

  ngOnInit(): void {
    this.bindForm();
  }

  getFormControlValue(controlName: string): string {
    return this.strokeForm.get(controlName).value;
  }

  onSubmit() {
    const percentage = RiskPrediction.strokeRS({ ...this.strokeForm.value, age: this.shareDataService.getAge() }).percentage;
    this.gaugeValue = percentage.value;
    this.gaugePrepend = percentage.symbol;
  }

  bindForm() {
    this.strokeForm.patchValue({
      education: '',
      gender: '',
      renalDisease: false,
      diabetes: false,
      congestiveHeartFailure: false,
      peripheralArterialDisease: false,
      highBloodPressure: false,
      ischemicHeartDisease: false,
      smoking: false,
      formerSmoker: false,
      alcoholicDrinks: 0,
      formerDrinker: false,
      physicalActivity: 0,
      indicatorsOfAnger: false,
      depression: false,
      anxiety: false,
    });
    this.gaugeValue = 0;
  }


}
