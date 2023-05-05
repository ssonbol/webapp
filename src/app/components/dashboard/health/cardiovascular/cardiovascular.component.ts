import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import StaticData from 'src/app/constants/StaticData';
import { ShareDataService } from 'src/app/services/share-data.service';
import { RiskPrediction } from 'src/app/utils/RiskCalculator';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-cardiovascular',
  templateUrl: './cardiovascular.component.html',
  styleUrls: ['./cardiovascular.component.css']
})
export class CardiovascularComponent implements OnInit {
  gaugeValue = 0;

  guageConfig = {
    '0': { color: 'red' },
    '31': { color: 'orange' },
    '61': { color: 'green' }
  };

  cardiovascularForm = this.fb.group({
    gender: this.fb.control(null, Validators.required),
    hdl: this.fb.control(null, Validators.required),
    cholesterol: this.fb.control(null, Validators.required),
    bloodPressure: this.fb.control(null, Validators.required),
    bloodPressureTreated: this.fb.control(null, Validators.required),
    smoker: this.fb.control(null, Validators.required),
    diabetes: this.fb.control(null, Validators.required),
  })

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
    return this.cardiovascularForm.get(controlName).value;
  }

  onSubmit() {
    if (this.cardiovascularForm.valid) {
      const percentage = RiskPrediction.FRS({ ...this.cardiovascularForm.value, age: this.shareDataService.getAge() }).percentage;

      this.gaugeValue = +percentage;
    } else {
      this.toastrService.error('Please fill the required fileds');
    }
  }

  bindForm() {
    this.cardiovascularForm.patchValue({
      gender: '',
      hdl: 0,
      cholesterol: 0,
      bloodPressure: 0,

      bloodPressureTreated: false,
      smoker: false,
      diabetes: false,
    });
    this.gaugeValue = 0;
  }

}
