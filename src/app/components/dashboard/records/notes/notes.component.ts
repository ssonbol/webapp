import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BasicService } from 'src/app/services/basic.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  search = '';
  faAngleRight = faAngleRight;
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
  };

  dropdownList = [
    { item_id: 1, item_text: 'Enhanced Note' },
    { item_id: 2, item_text: 'Subsequent evaluation note' },
    { item_id: 3, item_text: 'Consultation Note' },
    { item_id: 4, item_text: 'Consultation Note Generic' },
    { item_id: 5, item_text: 'Progress Note Generic' },
  ];

  selectedItems = [
    'Enhanced Note',
    'Subsequent evaluation note',
    'Consultation Note',
    'Consultation Note Generic',
    'Progress Note Generic',
  ];
  labList = [];
  notesList = [];
  masterNotes = []
  authData: any = JSON.parse(localStorage.getItem("authData"));
  @ViewChild('f') notesForm: NgForm;

  constructor(
    private basicService: BasicService,
  ) { }

  ngOnInit(): void {
    this.getData('');
  }

  getData(categories) {
    let parameters = {
      sessionKey: this.authData.sessionKey,
      categories: categories
    };
    this.basicService.post('patient/get-notes', parameters)
      .subscribe((res: any) => {
        var data = res.payload.payload[0];
        this.masterNotes = data
        data.map(e => this.notesList.push({
          doc_id: e.documents[0].id,
          title: e.title,
          doctor_name: e.doctor_name,
          record: e.effective_date,
          description: e.text,
        }));
      });
  }

  onItemSelect(items: any) {
    let allData = [];

    if (items.length) {
      for (let index = 0; index < items.length; index++) {
        var results = this.masterNotes.filter((map) => {
          return ((map.category == items[index]['item_text']))
        });
        allData = [...results, ...allData];
        this.notesList = allData
      }
    } else {
      this.notesList = this.masterNotes;
    }
  }

  updateFilters() {
    let searchCase = this.search.toLowerCase();
    if (searchCase) {
      var results = this.masterNotes.filter((map) => {
        return (
          (map.doctor_name?.toLowerCase().includes(searchCase)) || (map.text.toLowerCase().includes(searchCase)) ||
          (map.entry_date.toLowerCase().includes(searchCase)) || (map.title.toLowerCase().includes(searchCase)))
      });

      this.notesList = results
    } else {
      this.notesList = this.masterNotes;
    }

  }


}
