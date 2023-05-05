import { Component, OnInit, } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  isEdit = false;
  avatar = '../../../../../assets/default-avatar.png';
  userData;
  doctorID: number;
  doctorList;
  accessToken: any = JSON.parse(localStorage.getItem("authData"));
  parameters = { sessionKey: this.accessToken.sessionKey }

  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private basicService: BasicService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.activatedRoute.queryParams
      .subscribe((params: any) => {
        this.doctorID = +params.id

        if (this.doctorID)
          this.getDoctors();
      });
  }

  initForm() {
    this.profileForm = this.fb.group({
      fname: this.fb.control(''),
      lname: this.fb.control(''),
      phone: this.fb.array([
        this.fb.control('')
      ]),
      email: this.fb.array([
        this.fb.control('')
      ]),
      sessionKey: this.accessToken.sessionKey
    });
  }

  get phone(): FormArray {
    return this.profileForm.get('phone') as FormArray;
  }
  get email(): FormArray {
    return this.profileForm.get('email') as FormArray;
  }

  addremovePhone(action: 'add' | 'remove', index?: number) {
    if (action == 'add')
      this.phone.push(this.fb.control(''))
    else
      this.phone.removeAt(index);

    if (!this.phone.length)
      this.phone.push(this.fb.control(''))
  }

  addremoveEmail(action: 'add' | 'remove', index?: number) {
    if (action == 'add')
      this.email.push(this.fb.control(''))
    else
      this.email.removeAt(index);

    if (!this.email.length)
      this.email.push(this.fb.control(''))
  }

  createEmailAndPhoneArray(text: string): Array<string> {
    let data = [];
    if (text)
      data = text.split(",");
    if (!data.length)
      data = [text];
    return data;
  }

  getDoctors() {
    this.basicService.post('user/get-user-doctors', this.parameters)
      .subscribe((res: any) => {
        if (res.payload.length) {
          this.doctorList = res.payload;
          this.filterDoctor();
        }
      }, (err) => {
        this.toastrService.error(err.error.errorMsg);
      });
  }

  onSubmit() {
    this.basicService.post('user/add-doctor', this.profileForm.value)
      .subscribe(() => {
        this.toastrService.success('Doctor added to your contact circle!');
        this.router.navigate(['/my-circle']);
      }, err => {
        this.toastrService.error(err.statusMessage);
      });
  }

  filterDoctor() {
    if (this.doctorList.length) {
      const data = this.doctorList.filter(map => map.id == this.doctorID)[0];
      this.userData = data;

      let phone = this.createEmailAndPhoneArray(data.phone);
      let email = this.createEmailAndPhoneArray(data.email);

      for (let index = 0; index < email.length - 1; index++) {
        this.addremoveEmail('add')
      }

      for (let index = 0; index < phone.length - 1; index++) {
        this.addremovePhone('add')
      }

      this.profileForm.patchValue({
        fname: data.fname,
        lname: data.lname,
        phone: phone,
        email: email,
      });
    }
  }

  editDoctor() {
    if (this.doctorID) {
      let json = this.profileForm.value;
      json['id'] = this.doctorID
      this.basicService.post('user/update-user-doctor', json)
        .subscribe((res: any) => {
          if (res.payload.length)
            this.toastrService.success('Contact updated!');
          this.router.navigate(['/my-circle']);
        }, err => {
          this.toastrService.error(err.error.errorMsg);
        });
    }
  }

  delete() {
    this.basicService.post('user/delete-doctor', { doctor_id: this.doctorID, ...this.parameters })
      .subscribe(() => {
        this.getDoctors();
        this.toastrService.success('Doctor deleted!');
        this.router.navigate(['/my-circle']);
      })
  }


}
