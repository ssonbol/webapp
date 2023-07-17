import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { BasicService } from 'src/app/services/basic.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  faAngleRight = faAngleRight;
  documentNamesList: Array<string>;
  providerId: string;
  visitReferenceId: string;

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
  };
  @ViewChild('f') documentForm: NgForm;

  dropdownList: BehaviorSubject<Array<{ item_id: string, item_text: string }>> = new BehaviorSubject([]);

  selectedItems = [];
  authData: any = JSON.parse(localStorage.getItem("authData"));

  parameters = {
    sessionKey: this.authData.sessionKey
  };

  masterDocuments = []
  documentsList = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private basicService: BasicService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getDocumentNames();
    this.activatedRoute.params
      .subscribe((map: any) => {
        this.providerId = map.providerId;
        this.visitReferenceId = map.visitReferenceId;
      })
  }

  getDocumentNames() {
    this.basicService.post('patient/get-document-names', this.parameters)
      .subscribe((res: any) => {
        this.documentNamesList = res.payload.success ? res.payload.payload : [];
        this.selectedItems = this.documentNamesList;
        if (this.providerId && this.visitReferenceId)
          this.getVisitDocuments();
        else
          this.getDocumentIds();

        let dropdownList = [];
        for (const item of this.documentNamesList) {
          dropdownList.push({
            item_id: item,
            item_text: item,
          })
        }
        this.dropdownList.next(dropdownList);

      });
  }

  getDocumentIds() {
    let parameters = {
      ...this.parameters,
      names: this.documentNamesList,
    }
    this.basicService.post('patient/get-document-ids', parameters)
      .subscribe((res: any) => {
        var data = res.payload.payload;

        this.masterDocuments = data;
        this.documentsList = data;
      });
  }

  getVisitDocuments() {
    let parameters = {
      ...this.parameters,
      names: this.documentNamesList,
      providerId: this.providerId,
      visitReferenceId: this.visitReferenceId,
    }
    this.basicService.post('patient/get-visit-documents', parameters)
      .subscribe((res: any) => {

        var data = res.payload.payload;
        if (data) {
          this.masterDocuments = data;
          this.documentsList = data;
        } else {
          // this.toastrService.error(res.payload.message)
          console.error("getVisitDocuments", res.payload.message)
        }

      });
  }

  updateFilters(search: string) {
    if (search) {
      let searchCase = search.toLowerCase()
      var results = this.masterDocuments.filter((map) => {
        return ((map.name?.toLowerCase().includes(searchCase)) || (map.auther?.toLowerCase().includes(searchCase)) || (map.provider_name?.toLowerCase().includes(searchCase)))
      });
      this.documentsList = results
    } else {
      this.documentsList = this.masterDocuments;
    }
  }

  onItemSelect(items: Array<any>) {
    if (items && items.length) {
      let allData = [];
      for (let index = 0; index < items.length; index++) {
        var results = this.masterDocuments.filter((map) => {
          return ((map.name == items[index]['item_text']))
        });
        allData = [...results, ...allData];
      }
      this.documentsList = allData;
    } else {
      this.documentsList = [];
    }
  }

  onSelectAll(items: any) {
    console.log(items);
  }



}

