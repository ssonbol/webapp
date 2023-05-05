import { Component, OnInit } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {

  faEdit = faEdit;
  faMinus = faMinusSquare;
  reminderList = [];
  userData: any = JSON.parse(localStorage.getItem("userData"));
  parameters = { "user_id": this.userData.user_id }

  constructor(
    private basicService: BasicService,
    private toastrService: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.basicService.post('user/get-user-reminders', this.parameters)
      .subscribe((res: any) => {
        if (res.payload.length) {
          const data = res.payload;
          this.reminderList = [];

          data.forEach((value) => {
            this.reminderList.push({
              title: value.reminder_title,
              start_date: value.start_date,
              end_date: value.end_date,
              frequency_per_day: value.frequency_per_day,
              reminder_id: value.reminder_id
            });
          });
        }
      });
  }

  edit(reminder_id) {
    this.router.navigate(['reminders/add-edit-reminder'], { queryParams: { id: reminder_id } });
  }

  delete(reminder_id) {
    this.basicService.post('user/delete-reminder', { reminder_id: reminder_id })
      .subscribe(() => {
        this.getList();
        this.toastrService.success('Reminder deleted!');
      })
  }

  isExpired(end_date): boolean {
    return new Date(end_date) < new Date();
  };

  isUnSynced(item) {
    // return !deviceScheduledNotififcations.find(
    //   (n) => n.ReminderID == item.reminder_id
    // );
  };

}


