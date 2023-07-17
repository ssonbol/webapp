import { Component, OnDestroy, OnInit } from '@angular/core';
import { faFlask } from '@fortawesome/free-solid-svg-icons';
import { faAllergies } from '@fortawesome/free-solid-svg-icons';
import { faPills } from '@fortawesome/free-solid-svg-icons';
import { faProcedures } from '@fortawesome/free-solid-svg-icons';
import { faVial } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
  selected_duration;
  json: any = {};
  faAngleRight = faAngleRight;
  faAllergies = faAllergies;
  faPills = faPills;
  faFlask = faFlask;
  faProcedures = faProcedures;
  faVial = faVial;
  faFileAlt = faFileAlt;
  faFile = faFile;

  authorization = false;
  shareWithDoctorID;

  dropdownList = [
    { item_id: 1, item_text: 'One Week' },
    { item_id: 2, item_text: 'Two Weeks' },
    { item_id: 3, item_text: 'Permanent' },
  ];
  doctor_id = '';
  link = '';
  records = [
    { count: 0, name: 'Allergies', icon: faAllergies, link: 'allergies' },
    { count: 0, name: 'Medications', icon: faPills, link: 'medications' },
    { count: 0, name: 'Immunization', icon: faFlask, link: 'immunization' },
    { count: 0, name: 'Conditions', icon: faProcedures, link: 'conditions' },
    { count: 0, name: 'Lab Results', icon: faVial, link: 'lab-results' },
    { count: 0, name: 'Notes', icon: faFileAlt, link: 'notes' },
    { count: 0, name: 'Documents', icon: faFile, link: 'documents' },
    { count: 0, name: 'Medicare Claims', icon: faPills, link: 'medicare-claims' },
  ];

  accessToken: any = JSON.parse(localStorage.getItem("authData"));
  parameters = { "providerName": '', "sessionKey": this.accessToken.sessionKey, "offset": 0, "pageSize": 2000 }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private basicService: BasicService,
    private shareDataService: ShareDataService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe((params: any) => {
        if ((params['authorization']) && (params['id']) && (params['link'])) {
          this.doctor_id = params['id']
          this.link = params['link'];
          this.authorization = params['authorization']
          this.getLinks()
        }
        if (params.selected_doctors) {
          this.getSelectedRecordsToShare();
          this.shareWithDoctorID = params.selected_doctors;
        }
      });
  }

  navigate(item) {
    if (this.authorization)
      this.router.navigate(['authorization-controls'], { queryParams: { type: item.link, id: this.doctor_id, link: this.link } });
    else if (this.shareWithDoctorID)
      this.router.navigate(['authorization-controls'], { queryParams: { type: item.link, shared_doc_id: this.shareWithDoctorID } });
    else
      this.router.navigate([`records/${item.link}`]);
  }

  getLinks() {
    this.shareDataService.shared_data
      .subscribe(resp => {
        if (resp) {
          for (let k in resp) {
            this.records.filter(item => {
              if (item.link == k) {
                item.count = resp[k].in ? resp[k].in.length : 0
              }
            })
          }
        } else {
          this.router.navigate(['/my-authorizations']);
        }
      })
  }

  getSelectedRecordsToShare() {
    this.shareDataService.to_share_data
      .subscribe(resp => {
        if (resp) {
          for (let k in resp) {
            this.records.filter(item => {
              if (item.link == k) {
                item.count = resp[k].in ? resp[k].in.length : 0
              }
            })
          }
        } else {
          this.router.navigate(['/my-authorizations']);
        }
      });
  }

  durationSelect(event) {
    this.selected_duration = event;
    let typeList;
    if (!this.shareWithDoctorID)
      this.shareDataService.shared_data.subscribe(resp => typeList = resp)
    else if (this.shareWithDoctorID)
      this.shareDataService.to_share_data.subscribe(resp => typeList = resp)

    let days = 0;
    let forever = false;
    if (event == 1) {
      days = 7
    }
    else if (event == 2) {
      days = 14
    }
    else if (event == 3) {
      forever = true
    }
    this.json = {
      link: this.link,
      isForever: forever,
      expiresIn: { "days": days, "hours": 0, "minutes": 0, "months": 0, "years": 0 },
      sessionKey: this.parameters['sessionKey'],
      sharedItems: typeList
    }
  }

  onSubmit() {
    // Add new
    if (this.shareWithDoctorID) {
      delete this.json.link;
      document.getElementById("updateModal").click();
      this.basicService.post('share/add-link', {
        ...this.json,
        shareAllItems: false,
        doctorIds: [this.shareWithDoctorID]
      }).subscribe(() => {
          this.resetSelection();
          this.toastrService.success('Data shared with doctor!');
          this.router.navigate(['/my-authorizations']);
        }, err => {
          // this.toastrService.error(err.error.errorMessage);
          console.error("add-link", err.error.errorMessage);
        });
    }
    // Update existing
    else {

      document.getElementById("updateModal").click();
      this.basicService.post('share/update-link', this.json)
        .subscribe(() => {
          this.resetSelection();
          this.toastrService.success('Expiry Updated');
          this.router.navigate(['/my-authorizations']);
        }, err => {
          // this.toastrService.error(err.error.errorMessage);
          console.error("update-link", err.error.errorMessage);
        });
    }
  }

  resetSelection() {
    this.shareDataService.to_share_data.next(null);
    this.shareDataService.shared_data.next(null);
  }

}
