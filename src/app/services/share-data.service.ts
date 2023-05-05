import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  userDetails = new BehaviorSubject(null);
  forgotUserEmail = new BehaviorSubject(null);

  shared_data = new BehaviorSubject(null);
  to_share_data = new BehaviorSubject(null);

  loaderHack = true;

  constructor(
    private router: Router,
  ) { }

  loaderSubject = new BehaviorSubject<boolean>(false);

  showHideLoader(showLoader: boolean) {
    this.loaderSubject.next(showLoader);
  }

  setLoaderHack(showLoader: boolean) {
    this.loaderHack = showLoader;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }


  getAge() {
    const DOB = JSON.parse(localStorage.getItem('userData')).dob;
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  settingUserData(payload: {
    accessToken: any,
    refreshToken: any,
    sessionKey: any,
    sourceIp: any,
    txId: any,
    userModel: any,
  }) {
    var userData = JSON.stringify(payload.userModel);
    var authInfo = JSON.stringify({ ...payload });

    localStorage.setItem('userData', userData);
    localStorage.setItem('authData', authInfo);
    localStorage.setItem('isLogin', 'true');
  }
}
