import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { ReviewModalComponent } from './components/review-modal/review-modal.component';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../_services/auth.service';
import { User } from '../_interfaces/Auth.modal';
import { UserConfigService } from '../_services/user-config.service';
import { LocationPermService } from '../_services/location-perm.service';
import { OpenSettingsPopoverComponent } from './components/open-settings-popover/open-settings-popover.component';

@Component({
  selector: 'app-profile',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [SharedModule, ReviewModalComponent, OpenSettingsPopoverComponent]
})
export class SettingsPage implements OnInit {
  theme: string;
  user: User = {} as User;
  isLocationOn: boolean;
  isFetchingData: boolean;
  isSettingsPopoverOpen: boolean;
  constructor(
    private authService: AuthService,
    private locationPermService: LocationPermService,
    private userConfigService: UserConfigService,
    private modalController: ModalController,
    private outlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.getUserDetails();
    this.getTheme();
    this.subscribeToLocationPermState();
    this.subscribeToUserUpdates()
  }

  async getUserDetails(){
    this.isFetchingData = true;
    this.user = await this.authService.getUser().then(res => {
      this.isFetchingData = false;
      return res;
    })
  }

  subscribeToLocationPermState(){
    this.locationPermService.locationPermStateUpdated$.subscribe(async state => {
      if(state === "granted"){
        this.isLocationOn = (await this.userConfigService.getLocationStatus()) === "granted";
      }
    })
  }

  subscribeToUserUpdates(){
    this.authService.user$.subscribe(user => {
      if(user){
        this.getUserDetails();
      }
    })
  }

  async handleLocationPerm(e){
    this.isLocationOn = e.detail.checked;
    if(this.isLocationOn){
      const permStatus = await this.locationPermService.checkPermission();
      if(permStatus === "prompt"){
        await this.locationPermService.requestLocationPermission();
      } else if(permStatus === "denied"){
        this.isSettingsPopoverOpen = true;
      }
    }else{
      await this.userConfigService.setLocationStatus("denied");
      await this.locationPermService.clearWatchUserLocation();
    }
  }

  dismissPopover(){
    this.isSettingsPopoverOpen = false;
  }

  async getTheme(){
    this.theme = await this.userConfigService.getTheme();
  }

  handleThemeChange(e){
    const theme = e.detail.value;
    this.userConfigService.applyTheme(theme);
  }

  async openReviewModal(){
    const modal = await this.modalController.create({
      component: ReviewModalComponent,
      presentingElement: this.outlet.nativeEl,
    })

    await modal.present();
  }

  async handleLogout(){
     await this.authService.logout();
  }

}
