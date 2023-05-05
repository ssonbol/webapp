import { Component, OnDestroy, OnInit } from '@angular/core';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs/operators';
import { ShareDataService } from 'src/app/services/share-data.service';
import { BasicService } from 'src/app/services/basic.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit, OnDestroy {

  timerID;

  search = '';
  faLink = faLink;
  faSync = faSync;
  providerList = [];
  providerCategories = [];
  selected_value = 0;
  userData: any = JSON.parse(localStorage.getItem("userData"));
  authData: any = JSON.parse(localStorage.getItem("authData"));
  parameters = {
    categoryId: this.selected_value,
    providerName: '',
    sessionKey: this.authData.sessionKey,
    offset: 0,
    pageSize: 2000
  }

  constructor(
    private basicService: BasicService,
    private shareDataService: ShareDataService,
    private toastrService: ToastrService,
    private modalService: NgbModal

  ) {
    this.getList();
    this.getProviderCategories();
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.shareDataService.setLoaderHack(true);
    clearInterval(this.timerID)
  }

  getList() {
    this.basicService.post('provider/search', this.parameters)
      .pipe(
        map((res) => {
          return res as any;
        })
      ).subscribe((res) => {
        if (res.success !== true) {
          const payload = res.payload.payload;
          this.providerList = payload;
        }
      });
  }

  getProviderCategories() {
    this.basicService.post('provider/load-provider-categories', this.parameters)
      .pipe(
        map((res) => {
          return res as any;
        })
      ).subscribe(
        (res) => {
          if (res.success !== true) {
            this.providerCategories = [
              { value: 0, label: 'All' },
              ...res.payload,
            ]
          }
        });
  }

  updateFilters() {
    let searchCase = this.search.toLowerCase();
    if (searchCase) {
      this.parameters.providerName = searchCase;
      this.providerList = [];
      this.getList();
    } else {
      this.parameters.providerName = '';
      this.getList();
    }
  }

  categorySelect() {
    this.parameters.categoryId = this.selected_value;
    this.providerList = [];
    this.getList();
  }

  LinkProvider(providerID, integrationTypeId, confirmShare, cancelShare) {
    this.shareDataService.setLoaderHack(true);
    let data = {
      userId: this.userData.user_id,
      providerId: providerID,
      sessionKey: this.authData.sessionKey,
    };
    let integrationId = integrationTypeId;
    this.basicService.post(`provider/link`, data)
      .subscribe((response: any) => {
        if (response.statusCode == 0) {
          if (
            response.payload != null &&
            typeof response.payload === "string"
          ) {
            let link = response.payload;

            if (integrationId === 7) {
              this.modalService.open(confirmShare)
                .result.then((resp: any) => {
                  if (resp) {
                    this.recheckList();
                    window.open(link, "_blank");
                  }
                });

              // dispatch(
              //   showConfirmDialogue({
              //     msg: i18n.t("providers.medicalClaimsShareMsg"),
              //     title: i18n.t("providers.medicalClaimsShare"),
              //     leftButton: new ButtonAttributes(
              //       i18n.t("records.shareRecords.confirm"),
              //       () =>
              //         props.navigation.navigate("LinkProvider", {
              //           link,
              //           providerID,
              //           integrationId,
              //           providers,
              //         }),
              //       theme.colors.primary
              //     ),
              //   })
              // );
            }
            else {
              this.recheckList();
              window.open(link, "_blank");
            }

            // props.navigation.navigate("LinkProvider", {
            //   link,
            //   providerID,
            //   integrationId,
            //   providers,
            // });
          } else {
            if (integrationId === 6) this.syncEpic(providerID);
            else if (integrationId === 8) this.syncGeneric(providerID);
            else if (integrationId === 7) {
              this.modalService.open(cancelShare)
                .result.then(() => {
                  this.syncBlueButton(providerID)
                });
              // dispatch(
              //   showConfirmDialogue({
              //     msg: i18n.t("records.shareRecords.confirmCancelShare"),
              //     title: i18n.t("records.shareRecords.cancelShareTitle"),
              //     leftButton: new ButtonAttributes(
              //       i18n.t("records.shareRecords.confirm"),
              //       () => this.syncBlueButton(providerID),
              //       theme.colors.danger
              //     ),
              //   })
              // );

            } else {
              const linked = this.providerList.find((p) => p.providerId === providerID);
              // dispatch(providerLinked(providerID));

              let msg = linked
                ? 'Synchronization is performed successfully'
                : 'Linking is performed successfully'

              this.toastrService.success(msg);
            }
          }
        } else if (response.statusCode == -500) {
          this.toastrService.error('Patient not found');
        } else {
          this.toastrService.error('Failed to connect to the selected provider, Please Try again later')
        }
      }, () => {
        this.toastrService.error('Failed to connect to the selected provider, Please Try again later')
      })
  }

  syncEpic(providerId) {
    if (providerId) {
      this.basicService.post(`provider/syncEpic`, { providerId })
        .subscribe((resp: any) => {
          if (resp.statusCode === 0) {
            let linked = this.providerList.find((p) => p.providerId === providerId);
            // dispatch(providerLinked(providerId));

            let msg = linked
              ? 'Synchronization is performed successfully'
              : 'Linking is performed successfully'

            this.toastrService.success(msg);
          } else {
            this.toastrService.error('Failed to connect to the selected provider, Please Try again later')
          }
        });
    }
  };

  syncGeneric(providerId) {
    if (providerId) {
      this.basicService.post(`provider/syncGeneric`, { providerId })
        .subscribe((resp: any) => {
          if (resp.statusCode === 0) {
            let linked = this.providerList.find((p) => p.providerId === providerId);
            // dispatch(providerLinked(providerId));

            let msg = linked
              ? 'Synchronization is performed successfully'
              : 'Linking is performed successfully'

            this.toastrService.success(msg);
          } else {
            this.toastrService.error('Failed to connect to the selected provider, Please Try again later')
          }
        });
    }
  };

  syncBlueButton(providerId) {
    if (providerId) {
      this.basicService.post(`provider/syncBlueButton`, { providerId })
        .subscribe((resp: any) => {
          if (resp.statusCode === 0) {
            let linked = this.providerList.find((p) => p.providerId === providerId);
            // dispatch(providerLinked(providerId));

            let msg = linked
              ? 'Synchronization is performed successfully'
              : 'Linking is performed successfully'

            this.toastrService.success(msg);
          } else {
            this.toastrService.error('Failed to connect to the selected provider, Please Try again later')
          }
        });
    }
  }


  recheckList() {
    this.shareDataService.setLoaderHack(false);
    this.timerID = setInterval(() => {
      this.getList()
    }, 10000);
  }
}
