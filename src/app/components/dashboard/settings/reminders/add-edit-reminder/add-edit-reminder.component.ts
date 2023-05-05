import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasicService } from 'src/app/services/basic.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-add-edit-reminder',
  templateUrl: './add-edit-reminder.component.html',
  styleUrls: ['./add-edit-reminder.component.css']
})
export class AddEditReminderComponent implements OnInit {

  image = 'https://www.creativefabrica.com/wp-content/uploads/2019/04/Medicine-icon-by-hellopixelzstudio-580x386.jpg';
  reminderID: number;

  authData = JSON.parse(localStorage.getItem("authData"));
  userData = JSON.parse(localStorage.getItem("userData"));
  parameters = { "user_id": this.userData.user_id }
  reminderList = [];
  medicationsList = [];

  medicineForm = this.fb.group({
    reminder_title: this.fb.control(null, Validators.required),
    from_date: this.fb.control(null, Validators.required),
    to_date: this.fb.control(null, Validators.required),
    frequency_per_day: this.fb.control(null, Validators.required),
    user_id: this.fb.control(this.userData.user_id),
    schedules: this.fb.control([]),
    type: false
  });

  constructor(
    private fb: FormBuilder,
    private basicService: BasicService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getMedications();
    this.activatedRoute.queryParams
      .subscribe((params: any) => {
        if (params['id']) {
          this.reminderID = +params.id;

          // Setting type toggle only for edit form
          this.medicineForm.get('type').setValue(true);
          this.medicineForm.get('reminder_title').disable();
          this.toggle();

          this.getReminders()
        }
      });
  }

  getMedications() {
    this.basicService.post('patient/get-medications', { sessionKey: this.authData.sessionKey })
      .subscribe((res: any) => {
        if (res.payload.payload.length)
          this.medicationsList = res.payload.payload;
      });
  }

  getReminders() {
    this.basicService.post('user/get-user-reminders', this.parameters)
      .subscribe((res: any) => {
        if (res.payload.length) {
          this.reminderList = res.payload;
          this.filterReminder();
        }
      });
  }

  onSubmit() {
    if (this.medicineForm.valid) {
      const data = this.medicineForm.getRawValue();
      const userName = this.userData && this.userData.fname + " " + this.userData.lname;

      let scheduledNotifications = [];
      let timeDelta = 24 / +this.getControlVale('frequency_per_day');
      let nextReminder = this.getControlVale('from_date');
      while (nextReminder <= this.getControlVale('to_date')) {
        scheduledNotifications.push({
          schedule_time: new Date(nextReminder),
        });
        nextReminder = moment(nextReminder).add(timeDelta, "hours");
      }

      if (!scheduledNotifications.length) {
        this.toastrService.error('Please check the chosen dates');
        return;
      }

      if (this.reminderID) {
        // update
        const updateBody = {
          reminder_id: this.reminderID,
          is_active: this.reminderDetails.is_active,
          reminder_title: data.reminder_title,
          start_date: data.from_date,
          end_date: data.to_date,
          frequency_per_day: data.frequency_per_day,
          user_id: this.userData.user_id,
          schedules: scheduledNotifications
        }

        this.basicService.post('user/update-reminder', updateBody)
          .subscribe(() => {
            this.reset('Updated');
          })
      } else {
        const createBody = {
          reminder_title: data.reminder_title + ` For: ${userName}`,
          start_date: new Date(data.from_date),
          end_date: new Date(data.to_date),
          frequency_per_day: data.frequency_per_day,
          user_id: this.userData.user_id,
          schedules: scheduledNotifications
        }

        // add
        this.basicService.post('user/add-reminder', createBody)
          .subscribe(resp => {
            this.reset('Created');
          })
      }
    } else {
      this.toastrService.error('Please fill the required fields!');
    }
  }

  reset(method: string) {
    this.medicineForm.reset();
    this.toastrService.success(`Reminder ${method}!`);
    this.router.navigate(['/reminders']);
  }

  selectedType = false;
  toggle() {
    const type = this.medicineForm.get('type').value;
    this.selectedType = type;
  }

  reminderDetails;
  filterReminder() {
    const data = this.reminderList.filter(map => map.reminder_id == this.reminderID)[0];
    this.reminderDetails = data;

    this.medicineForm.patchValue({
      reminder_title: data.reminder_title,
      from_date: new Date(data.start_date).toISOString().slice(0, -1),
      to_date: new Date(data.end_date).toISOString().slice(0, -1),
      frequency_per_day: data.frequency_per_day,
      user_id: data.user_id,
      schedules: data.schedules,
    })
  }

  reminderTitle: string = '';
  onReminderTitleChange(title, confirmTitle) {
    this.reminderTitle = `Medication-${title ? title : ''}`;

    this.modalService.open(confirmTitle)
      .result.then((resp: any) => {
        if (resp) {
          const reminder_title = this.medicineForm.get('reminder_title');
          reminder_title.setValue(resp);
          reminder_title.disable();
        }
        else
          this.reminderTitle = '';
      });
  }

  restTitle() {
    this.reminderTitle = '';
    this.medicineForm.get('reminder_title').reset();
  }

  getControlVale(controlName: string): any {
    return this.medicineForm.get(controlName).value;
  }
}
