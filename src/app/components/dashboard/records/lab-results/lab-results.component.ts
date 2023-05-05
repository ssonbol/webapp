import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Record } from 'src/app/Record';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { BasicService } from 'src/app/services/basic.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-lab-results',
  templateUrl: './lab-results.component.html',
  styleUrls: ['./lab-results.component.css']
})
export class LabResultsComponent implements OnInit {

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
  };

  dropdownList = new BehaviorSubject([]);
  masterLabResults = []
  selectedItems = [];
  labList = [];
  cus = new Record();
  Object = Object;
  accessToken: any = JSON.parse(localStorage.getItem("authData"));
  search = ''
  sortedArray = {};

  constructor(
    private basicService: BasicService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    let parameters = {
      sessionKey: this.accessToken.sessionKey
    }

    this.basicService.post('patient/get-result-categories', parameters)
      .subscribe((res: any) => {
        this.labList = res.payload.payload;
        this.settingSortedArray(this.labList);

        const dropdownList = [];

        for (let index = 0; index < this.labList.length; index++) {
          const element = this.labList[index];
          dropdownList.push({
            item_id: index + 1,
            item_text: element
          });
        }
        // this.getData(this.labList);

        this.selectedItems = dropdownList;
        this.dropdownList.next(dropdownList);
      }, err => {
        this.toastrService.error(err.error.errorMsg);
      });
  }

  getData(category: Array<string>) {
    let parameters = {
      sessionKey: this.accessToken.sessionKey,
      categories: category
    }

    this.basicService.post('patient/get-results', parameters)
      .subscribe((res: any) => {
        if (res.payload.payload) {
          let data = res.payload.payload[0];
          this.masterLabResults = data
          this.setCUS(data)
        }
      }, err => {
        this.toastrService.error(err.error.errorMsg);
      });
  }

  onItemSelect(items: any) {
    let categories = [];
    if (items.length) {
      categories = this.sortOutSelectedCategories(items);

      this.settingSortedArray(categories);
      this.getData(categories)
    }
  }

  sortOutSelectedCategories(items) {
    let categories = [];
    for (let index = 0; index < items.length; index++) {
      const element = items[index]['item_text'];
      categories.push(element);
    }
    return categories;
  }

  updateFilters() {
    let searchCase = this.search.toLowerCase()

    if (searchCase) {
      var results = this.masterLabResults.filter((map) => {
        return ((map.category.toLowerCase().includes(searchCase)) || (map.name.toLowerCase().includes(searchCase)) || (map.value.toLowerCase().includes(searchCase)))
      });
      this.sortedArray = {};
      this.settingSortedArray(this.sortOutSelectedCategories(this.selectedItems));
      this.setCUS(results)
    } else {
      this.sortedArray = {};
      this.settingSortedArray(this.sortOutSelectedCategories(this.selectedItems));
      this.setCUS(this.masterLabResults)
    }
  }

  setCUS(data) {
    for (const result of data) {
      this.sortedArray[result.category].push({
        title: result.name,
        record: result.record_date,
        value: result.value,
      })
    }

    this.cus = new Record();
    for (const key in this.sortedArray) {
      if (Object.prototype.hasOwnProperty.call(this.sortedArray, key)) {
        const element = this.sortedArray[key];
        this.cus.set(key, element);
      }
    }
  }

  settingSortedArray(labList) {
    this.sortedArray = {};
    for (const labCat of labList) {
      this.sortedArray[labCat] = [];
    }
  }

}
