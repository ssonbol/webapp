import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { BasicService } from 'src/app/services/basic.service';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-authorization-controls',
  templateUrl: './authorization-controls.component.html',
  styleUrls: ['./authorization-controls.component.css']
})
export class AuthorizationControlsComponent implements OnInit {

  typeList;
  skillsForm: FormGroup;
  doctor_id;
  all = false;
  name = '';
  type = '';
  shared_doc_id = '';
  values = []
  dataList = [];
  link;
  CategorizedData;

  toShareData;

  json = {};
  dropdownList = [
    { item_id: 'Rheumatology Consulation', item_text: 'Rheumatology Consulation', state: false },
    { item_id: 'Rheumatology Consulation', item_text: 'Progress Note Generic', state: true },
    { item_id: 'Rheumatology Consulation', item_text: 'Depart Summary', state: false },
    { item_id: 'Rheumatology Consulation', item_text: 'Admission Note Physician', state: true }
  ];
  accessToken: any = JSON.parse(localStorage.getItem("authData"));
  parameters = { "sessionKey": this.accessToken.sessionKey };

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private basicService: BasicService,
    private router: Router,
    private shareDataService: ShareDataService,
  ) { }

  ngOnInit(): void {
    this.shareDataService.shared_data.subscribe(resp => {
      if (resp) {
        this.typeList = resp;
        this.CategorizedData = resp;
      }
    })

    this.activatedRoute.queryParams
      .subscribe((params: any) => {

        // First IF is for authorization or you can say updating a shared record
        if ((params['type']) && (params['id']) && (params['link'])) {
          if (this.CategorizedData) {
            this.doctor_id = params['id'];
            this.type = params['type'];
            this.link = params['link'];
            try {
              this.CategorizedData[this.type]['in']
            } catch {
              this.CategorizedData[this.type] = {}
              this.CategorizedData[this.type]['in'] = []
              this.CategorizedData[this.type]['notIn'] = []
            }
            let type = this.type.split('-').join(' ');
            this.name = type.charAt(0).toUpperCase() + type.slice(1)
            this.checkTypeApi();
          } else {
            this.router.navigate(['/my-authorizations']);
          }
        }

        // Second IF is for Add a new authorization or you can say POST a shared record
        else if (params.type && params.shared_doc_id) {
          this.type = params.type;
          this.shareDataService.to_share_data.subscribe(resp => this.toShareData = resp)

          if (this.toShareData) {
            try {
              this.toShareData[this.type]['in']
            } catch {
              this.toShareData[this.type] = {}
              this.toShareData[this.type]['in'] = []
              this.toShareData[this.type]['notIn'] = []
            }

            this.shared_doc_id = params.shared_doc_id;
            let type = this.type.split('-').join(' ');
            this.name = type.charAt(0).toUpperCase() + type.slice(1)
            this.checkTypeApi();
          }
        } else {
          this.router.navigate(['/my-authorizations']);
        }
      });

    this.skillsForm = this.fb.group({
      skills: this.fb.array([]),
    });
  }

  get skills(): FormArray {
    return this.skillsForm.get("skills") as FormArray
  }

  onSubmit() {
    this.skillsForm.value.skills.filter(item => {
      if (item.state)
        this.values.push(item.id)
    });

    if (this.doctor_id && this.type && this.link) {
      this.CategorizedData[this.type]['in'] = this.values;
      this.shareDataService.shared_data.next(this.CategorizedData);
      this.router.navigate(['records'], { queryParams: { authorization: true, id: this.doctor_id, link: this.link } });
    } else if (this.shared_doc_id && this.type) {
      this.toShareData[this.type]['in'] = this.values;
      this.toShareData[this.type]['notIn'] = [];
      this.shareDataService.to_share_data.next(this.toShareData);
      this.router.navigate(['records'], { queryParams: { selected_doctors: this.shared_doc_id } });
    }

  }

  newSkill(title, text, state, id): FormGroup {
    return this.fb.group({
      skill: title,
      exp: text,
      state: state,
      id: id
    })
  }

  checkValue(value) {
    for (var index in this.skills.controls) {
      var cont = this.skills.controls[index]['controls']['state'].setValue(value)
    }
  }

  getAllergies() {
    let typeIDList;
    let exist = false;
    if (this.typeList) {
      typeIDList = this.typeList[this.type]['in']
    }
    this.basicService.post('patient/get-allergies', this.parameters)
      .subscribe((res: any) => {
        var data = res.payload.payload;

        data.map((e) => {
          if (typeIDList && typeIDList.length) {
            if (typeIDList.includes(e.id))
              exist = true
            else
              exist = false;
          }
          this.skills.push(this.newSkill((e.allergen_name) ? e.allergen_name : "No name available", e.name, exist, e.id))
        })
      })

  }

  getMedications() {
    let typeIDList;
    let exist = false;
    if (this.typeList) {
      typeIDList = this.typeList[this.type]['in']
    }
    this.basicService.post('patient/get-medications', this.parameters)
      .subscribe((res: any) => {
        let data = res.payload.payload;

        data.map(e => {
          if (typeIDList && typeIDList.length) {
            if (typeIDList.includes(e.id))
              exist = true
            else
              exist = false;
          }
          this.skills.push(this.newSkill((e.name) ? e.name : "No name available", e.instructions, exist, e.id))

        }
        )
      })
  }

  getImmunization() {
    let typeIDList;
    let exist;
    if (this.typeList) {
      typeIDList = this.typeList[this.type]['in']
      exist = false;
    }
    this.basicService.post('patient/get-immunizations', this.parameters)
      .subscribe((res: any) => {
        let data = res.payload.payload;
        data.map(e => {
          if (typeIDList && typeIDList.length) {
            if (typeIDList.includes(e.id))
              exist = true
            else
              exist = false;
          }
          this.skills.push(this.newSkill((e.name) ? e.name : "No name available", e.status, exist, e.id))
        })
      })
  }

  getConditions() {
    let typeIDList;
    let exist = false;
    if (this.typeList) {
      typeIDList = this.typeList[this.type]['in']
    }
    this.basicService.post('patient/get-problems', this.parameters)
      .subscribe((res: any) => {
        var data = res.payload.payload;
        data.map(e => {
          if (typeIDList && typeIDList.length) {
            if (typeIDList.includes(e.id))
              exist = true
            else
              exist = false;
          }
          this.skills.push(this.newSkill((e.name) ? e.name : "No name available", e.description, exist, e.id))
        })
      })
  }

  getLabResults() {
    let typeIDList;
    let exist = false;
    if (this.typeList) {
      typeIDList = this.typeList[this.type]['in']
    }

    this.basicService.post('patient/get-result-categories', this.parameters)
      .subscribe((resultCategories: any) => {
        this.basicService.post('patient/get-results', { ...this.parameters, categories: resultCategories.payload.payload })
          .subscribe((res: any) => {
            var data = res.payload.payload[0];
            data.map(e => {
              if (typeIDList && typeIDList.length) {
                if (typeIDList.includes(e.id))
                  exist = true
                else
                  exist = false;
              }
              this.skills.push(this.newSkill((e.name) ? e.name : "No name available", e.value, exist, e.id))
            })
          })
      })

  }

  getNotes() {
    let typeIDList;
    let exist = false;
    if (this.typeList) {
      typeIDList = this.typeList[this.type]['in']
    }
    this.basicService.post('patient/get-notes', this.parameters)
      .subscribe((res: any) => {
        var data = res.payload.payload[0];
        data.map(e => {
          if (typeIDList && typeIDList.length) {
            if (typeIDList.includes(e.id))
              exist = true
            else
              exist = false;
          }
          this.skills.push(this.newSkill((e.title) ? e.title : "No name available", e.text, exist, e.id))
        })

      });
  }

  getDocuments() {
    let typeIDList;
    let exist = false;
    if (this.typeList) {
      typeIDList = this.typeList[this.type]['in']
    }
    this.basicService.post('patient/get-visit-documents', this.parameters)
      .subscribe((res: any) => {
        var data = res.payload.payload[0];
        data.map(e => {
          if (typeIDList && typeIDList.length) {
            if (typeIDList.includes(e.id))
              exist = true
            else
              exist = false;
          }
          this.skills.push(this.newSkill((e.title) ? e.title : "No name available", e.doctor_name, exist, e.id))
        })
      })
  }

  getMedicareClaims() {
    let typeIDList;
    let exist = false;
    if (this.typeList) {
      typeIDList = this.typeList[this.type]['in']
    }
    let parameters = { "sessionKey": this.accessToken.sessionKey, "page_number": 1, "page_size": 2000 }
    this.basicService.post('share/get-user-claims-mobile', parameters)
      .subscribe((res: any) => {
        let data = res.payload.userClaims;
        data.map(e => {
          if (typeIDList && typeIDList.length) {
            if (typeIDList.includes(e.id))
              exist = true
            else
              exist = false;
          }
          this.skills.push(this.newSkill((e.claim_reference_id) ? e.claim_reference_id : "No name available", e.payment_value, exist, e.id))
        })
      })
  }

  checkTypeApi() {
    switch (this.type) {
      case 'allergies':
        this.getAllergies();
        break;
      case 'medications':
        this.getMedications();
        break;
      case 'immunization':
        this.getImmunization();
        break;
      case 'conditions':
        this.getConditions();
        break;
      case 'lab-results':
        this.getLabResults();
        break;
      case 'notes':
        this.getNotes();
        break;
      case 'documents':
        this.getDocuments();
        break;
      case 'medicare-claims':
        this.getMedicareClaims();
        break;
      default:
      // code block
    }
  }

}
