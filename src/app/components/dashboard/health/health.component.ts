import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faTemperatureLow } from '@fortawesome/free-solid-svg-icons';
import { faWeight } from '@fortawesome/free-solid-svg-icons';
import { faRuler } from '@fortawesome/free-solid-svg-icons';
import { faChild } from '@fortawesome/free-solid-svg-icons';
import { faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {
  faTemp = faTemperatureLow;
  faWeight = faWeight;
  faRuler = faRuler;
  faChild = faChild;
  faHeartbeat = faHeartbeat;
  faStethoscope = faStethoscope;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    const isLogin = localStorage.getItem('isLogin');
    if (!isLogin) {
      this.router.navigate(['/login'])
    }
  }

}
