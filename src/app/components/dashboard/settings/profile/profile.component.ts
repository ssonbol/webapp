import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  avatar = '../../../../../assets/default-avatar.png';
  userData = JSON.parse(localStorage.getItem('userData'));

  constructor(
    public shareDataService:ShareDataService
  ) { }

  ngOnInit(): void {
  }

}
