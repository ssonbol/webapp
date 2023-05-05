import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasicService } from 'src/app/services/basic.service';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {

  docType = '';
  src;

  authData: any = JSON.parse(localStorage.getItem("authData"));
  constructor(
    private basicService: BasicService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe((map: any) => this.getDocument(map.id));
  }

  getDocument(id) {
    this.basicService.post(`patient/get-document/${id}`, { sessionKey: this.authData.sessionKey })
      .subscribe((resp: any) => {
        this.docType = resp.payload.payload.type;
        this.src = resp.payload.file;
      })
  }
}
