import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const code = this.route.snapshot.queryParamMap.get('code');
    console.log("code", code);
    if (code && window.opener) {
      window.opener.postMessage(code, '*');
      // window.close();
    }
  }

}
