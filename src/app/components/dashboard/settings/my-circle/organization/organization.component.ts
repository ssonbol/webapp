import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasicService } from 'src/app/services/basic.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

  @Input() authorization = false;
  @Input() share = false;

  selectedOrgID;
  selectedOrg;
  search = '';
  orgainzationList = [];
  authData: any = JSON.parse(localStorage.getItem("authData"));
  parameters = { "providerName": '', "sessionKey": this.authData.sessionKey, "offset": 0, "pageSize": 2000 }

  constructor(
    private toastrService: ToastrService,
    private basicService: BasicService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initMethods();
  }

  initMethods() {
    if (this.authorization) {
      // My Authorization - Organizations
      this.getSharedOrganizations(0);
    }
    else if (this.share) {
      this.getSharedOrganizations(1);
    }
    else {
      // My Circle - Organizations
      this.getSharedOrganizations(1);
    }
  }

  getSharedOrganizations(getAllOrganiztions: 0 | 1) {

    this.orgainzationList = [];
    this.basicService.post('share/get-user-organizations', { getAllOrganiztions: getAllOrganiztions, ...this.parameters })
      .subscribe((res: any) => {
        if (res.payload.length) {
          this.orgainzationList = res.payload;
        }
      });
  }

  searchProvider() {
    if (this.search) {
      this.parameters.providerName = this.search;
      this.getSharedOrganizations(0);
    } else {
      this.getSharedOrganizations(1);
    }
  }

  deleteOrganization() {
    this.basicService.post('share/delete-user-organizations', {
      organizationIds: [this.selectedOrgID], ...this.parameters
    }).subscribe(() => {
      this.initMethods();
      this.toastrService.success('Organization deleted!');
    });
  }

  proceed() {
    this.basicService.post(`share/add-user-organiztions`, {
      sessionKey: this.authData.sessionKey,
      organizationIds: [this.selectedOrg]
    }).subscribe(() => {
      this.toastrService.success('Records shared with organization');
      this.router.navigate(['/my-authorizations']);
    });
  }
}
