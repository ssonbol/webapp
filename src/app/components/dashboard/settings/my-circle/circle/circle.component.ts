import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.css']
})
export class CircleComponent implements OnInit {
  duration = {};
  json = {};
  isForever = false;
  index_data = {};
  // json={expiresIn:{"days": 0, "hours": 0, "minutes": 0, "months": 0, "years": 0},isForever:false}

  @Input() authorization = false;
  @Input() share = false;

  selectedDoc;
  search = '';
  faUserMd = faUserMd;
  faSync = faSync;
  selected_value = 0
  doctorsList = [];
  masterDoctorsList = [];
  authData: any = JSON.parse(localStorage.getItem("authData"));
  username: string = '';
  dropdownList = [
    { item_id: 1, item_text: 'One Week' },
    { item_id: 2, item_text: 'Two Weeks' },
    { item_id: 3, item_text: 'Permanent' },
  ];

  parameters = { "providerName": '', "sessionKey": this.authData.sessionKey, "offset": 0, "pageSize": 2000 }
  @ViewChild('f') loginForm: NgForm;

  constructor(
    private basicService: BasicService,
    private shareDataService: ShareDataService,
    private toastrService: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.share || !this.authorization) {
      this.getList();
    } else if (this.authorization) {
      this.getLinks()
    }
  }

  getList() {
    this.basicService.post('user/get-user-doctors', this.parameters)
      .subscribe((res: any) => {
        if (res.payload.length) {
          const data = res.payload;
          this.doctorsList = data;
          this.masterDoctorsList = data;
        }
      });
  }

  getLinks() {
    this.basicService.post('user/get-user-doctors', this.parameters)
      .subscribe((res: any) => {
        if (res.payload.length) {
          const data = res.payload;
          this.masterDoctorsList = data;
          this.basicService.post('/share/get-all-links', this.parameters)
            .subscribe((links: any) => {
              if (links.payload.length) {
                this.doctorsList = [];
                links.payload.filter((map) => {
                  for (let i in res.payload) {
                    if (map.doctor_id == res.payload[i].id) {
                      let json = {
                        'link': map,
                        'doctor': res.payload[i]
                      }
                      this.doctorsList.push(json)
                    }
                  }
                });
              }
            });
        }
      });
  }

  searchProvider() {
    if (this.search)
      this.doctorsList = this.masterDoctorsList.filter(map => map.fname.toUpperCase().includes(this.search.toUpperCase()) || map.lname.toUpperCase().includes(this.search.toUpperCase()));
    else
      this.doctorsList = this.masterDoctorsList;
  }

  profile(id) {
    this.router.navigate(['my-circle/contact'], { queryParams: { id: id } });
  }

  view(link) {
    window.open(link, "_blank");
  }

  updateExpiry() {
    this.basicService.post('share/update-expiry', this.json)
      .subscribe((res: any) => {
        document.getElementById("updateModal").click();
        this.toastrService.success('Expiry Updated');
        this.getLinks();
      }, err => {
        document.getElementById("updateModal").click();
        this.toastrService.error(err.error.errorMsg);
      });
  }

  delete() {
    let json = {
      linkId: this.index_data['link']['link_id'],
      sessionKey: this.parameters['sessionKey']
    }
    this.basicService.post('share/revoke-link', json)
      .subscribe((res: any) => {
        this.toastrService.success('Link deleted');
        document.getElementById("deleteModal").click();
        this.getLinks();
      });
  }

  edit(item) {
    this.basicService.post(`share/get-link`, {
      sessionKey: this.authData.sessionKey,
      linkId: item.link.link_id
    }).subscribe((resp: any) => {
      const shared_items = resp.payload.shared_items;
      let sortedObject: any = {};
      for (const key in shared_items) {
        if (Object.prototype.hasOwnProperty.call(shared_items, key)) {
          const element = shared_items[key];

          let item: any = { in: [] };
          if (element && element.in) {
            for (const data of element.in) {
              item['in'].push(data.id)
            }
          }
          sortedObject[key] = item;
        }
      }

      console.log(sortedObject);
      this.shareDataService.shared_data.next(sortedObject);
      this.router.navigate(['records'], { queryParams: { authorization: true, id: item.link.doctor_id, link: item.link.link_id } });
    });
  }

  durationSelect(event) {
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
      linkId: this.index_data['link']['link_id'],
      isForever: forever,
      expiresIn: { "days": days, "hours": 0, "minutes": 0, "months": 0, "years": 0 },
      sessionKey: this.parameters['sessionKey']
    }
  }

  getIndex(index) {
    this.index_data = index;
  }

  proceed() {
    let shareObject = {
      sharedItems: {},
      doctorIds: [this.selectedDoc],
      isForever: true,
      shareAllItems: true,
      expiresIn: { days: 0, hours: 0, minutes: 0, months: 0, years: 0 },
      sessionKey: this.authData.sessionKey
    }

    this.basicService.post('share/add-link', shareObject)
      .subscribe((res: any) => {
        this.toastrService.success('Shared Successfully');
        this.router.navigate(['/my-authorizations']);
      }, err => {
        this.toastrService.error(err.error.errorMsg);
      });
  }

  customize() {
    if (this.selectedDoc) {
      this.shareDataService.shared_data.next(null);

      this.shareDataService.to_share_data
        .next({
          allergies: {},
          conditions: {},
          documents: {},
          immunization: {},
          medications: {},
          notes: {},
          observations: {},
          results: {},
          visits: {},
        })

      this.router.navigate(['records'], { queryParams: { selected_doctors: this.selectedDoc } });
    } else {
      this.toastrService.error('Please select a doctor first!');
    }
  }

}

