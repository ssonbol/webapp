import { Component, OnInit } from '@angular/core';
import { faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { faHSquare } from '@fortawesome/free-solid-svg-icons';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faUserCog } from '@fortawesome/free-solid-svg-icons';
import { BasicService } from 'src/app/services/basic.service';
import { ShareDataService } from 'src/app/services/share-data.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faHeartbeat = faHeartbeat;
  faHSquare = faHSquare;
  faFileAlt = faFileAlt;
  faCopy = faCopy;
  faUserCog = faUserCog;
  userData = JSON.parse(localStorage.getItem("userData"));

  constructor(
    public shareDataService: ShareDataService
  ) { }

  ngOnInit(): void {
  }

}
