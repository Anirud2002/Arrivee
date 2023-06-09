import { Injectable } from '@angular/core';
import { LocationPermService } from './location-perm.service';
import { NotificationPermService } from './notification-perm.service';
import { Geolocation } from '@capacitor/geolocation';
import { Coords } from '../_interfaces/Location.modal';
import { LocationService } from './location.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Location } from '../_interfaces/Location.modal';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { BackgroundGeolocationPlugin } from '@capacitor-community/background-geolocation';
import { registerPlugin } from '@capacitor/core';
import { UserConfigService } from './user-config.service';
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

@Injectable({
  providedIn: 'root'
})
export class LocationNotificationService {
  locations: Location[];
  watchID: string;
  backgroundWatchID: string;
  userCoords: Coords;
  locationPermStatus: string;
  notificationPermStatus: string;
  enableTrackingToggleStatus: boolean;
  isUpdatingTimestamp: boolean = false;
  constructor(
    private locationService: LocationService,
    private notificationService: NotificationService,
    private userConfigService: UserConfigService,
    private locationPermService: LocationPermService,
    private notificationPermService: NotificationPermService,
    private router: Router
  ) { }

  async getLocations(){
    this.locations = await this.locationService.getLocations();
  }

  subscribeToEnableTrackingToggle(){
    this.userConfigService.enableTrackingToggle$.subscribe(isEnabled => {
      this.enableTrackingToggleStatus = isEnabled;
      if(this.enableTrackingToggleStatus){
        this.watchUserIfPossible();
      }else {
        this.clearWatchUserLocation();
      }
    })
  }

  subscribeToLocationPermStatus(){
    this.locationPermService.locationPermStatus$.subscribe( status => {
      this.locationPermStatus = status;
      this.watchUserIfPossible();
    })
  }
  
  subscribeToNotificationPermStatus(){
    this.notificationPermService.notificationPermStatus$.subscribe( status => {
      this.notificationPermStatus = status;
      this.watchUserIfPossible();
    })
  }

  subscribeToLocationUpdated() {
    this.locationService.locationUpdated$.subscribe(async updated => {
      if(updated){
        await this.getLocations();
      }
    })
  }

  // checks location perm and notification perm status and starts watching users location if possible
  async watchUserIfPossible(){
    if(this.locationPermStatus !== "granted" || this.notificationPermStatus !== "granted" || !this.enableTrackingToggleStatus){
      return;
    }

    // first, let's get the all the locations
    this.getLocations();

    // add listener for when action is performed on local notification
    await LocalNotifications.addListener("localNotificationActionPerformed", notificationAction => {
      if(notificationAction.actionId === "tap") {
        let locationID = notificationAction.notification.extra?.locationID;
        if(locationID){
          this.router.navigateByUrl(`/reminder-details/${locationID}`)
        } else {
          this.router.navigateByUrl("/")
        }
      }
    })

    // let's start watching user's location
    this.watchID = await Geolocation.watchPosition({
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    }, (position) => {
      this.userCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      this.checkUserAndLocationsCoords(this.userCoords);
    });
  }

  async watchUsersLocationOnBackground(){
    if(this.locationPermStatus !== "granted" || this.notificationPermStatus !== "granted" || !this.enableTrackingToggleStatus){
      return;
    }

    // first, let's get the all the locations
    this.getLocations();

    this.backgroundWatchID = await BackgroundGeolocation.addWatcher({
      backgroundMessage: "Cancel to prevent battery drain.",
      backgroundTitle: "Getting your location.",
      requestPermissions: true,
      stale: false,
      distanceFilter: 10
    }, (location, error) => {
      if (error) {
        if (error.code === "NOT_AUTHORIZED") {
            if (window.confirm(
                "This app needs your location, " +
                "but does not have permission.\n\n" +
                "Open settings now?"
            )) {
                BackgroundGeolocation.openSettings();
            }
        }
        return console.error(error);
      }
      this.userCoords = {
        latitude: location.latitude,
        longitude: location.longitude
      };
      this.checkUserAndLocationsCoords(this.userCoords);
    });
  }

  // stops watching for user's location
  async clearWatchUserLocation(){
    if(this.watchID){
      Geolocation.clearWatch({id: this.watchID});
      LocalNotifications.removeAllListeners();
    }

    if(this.backgroundWatchID) {
      BackgroundGeolocation.removeWatcher({
        id: this.backgroundWatchID
      });
    }

    this.userCoords = null;
  }

   // checks users and location coords and triggers the push notificaion workflow 
   async checkUserAndLocationsCoords(userCoord: Coords){
    if(!this.locations){
      return;
    }
    for (const location of this.locations) {
      let distanceFromUser = this.getDistance(userCoord.latitude, userCoord.longitude, location.coords.latitude, location.coords.longitude, location.radiusUnit);
      
      if (distanceFromUser <= location.radius && this.canNotificationBePushed(location.notificationTimestamp)) {
        if(!this.isUpdatingTimestamp){
          this.isUpdatingTimestamp = true;
          await this.locationService.updateLocationTimestamp(location.locationID)
          .then(updatedTimestamp => {
            location.notificationTimestamp = updatedTimestamp;
            return this.scheduleNotification(new Date(), location);
          })
          .catch(error => {
            console.log(error)
          })
          .finally(() => {
            this.isUpdatingTimestamp = false;
          })
        }
      }
    }
  }

  // checks if notification can be pushed depending upon the last notification timestamp
  canNotificationBePushed(lastTimestamp: number): boolean{
    let retVal: boolean;
    let currentUnixTimestamp = Date.now();
    if((currentUnixTimestamp - lastTimestamp) < (2 * 60 * 60 * 1000)){ // if 2 hours has not elapsed since the last notification, return false
      retVal = false;
    }else {
      retVal = true;
    }

    return retVal;
  }

  // gets distance between users coords and location coords in correct unit
  getDistance(userLat: number, userLng: number, locationLat: number, locationLng: number, unit: string): number{
    const earthRadius = 6371; // Radius of the earth in km
    const dLat = this.deg2Rad(locationLat - userLat); // deg2Rad below
    const dLon = this.deg2Rad(locationLng - userLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2Rad(userLat)) *
        Math.cos(this.deg2Rad(locationLat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = this.convertDistance(earthRadius * c, unit);
    return distance;
  }

  // converts the distance unit
  convertDistance(distance: number, unit: string): number{
    switch(unit){
      case "km":
        return distance;
      case "m":
        return distance * 1000;
      case "mil":
        return distance / 1.609;
      default:
        return distance;
    }
  }

  // converts degree value to radian
  deg2Rad(deg: number){
    return deg * (Math.PI / 180);
  }

  // schedules the notification based upon the date value received
  async scheduleNotification(date: Date, location: Location){
    await LocalNotifications.schedule({
      notifications: [{
        title: `You've ${location.reminders.length} things to do in ${location.title}.`,
        body: "Check it out!",
        id: 1,
        schedule: {
          at: date
        },
        extra: {
          locationID: location.locationID
        }
      }]
    });

    await this.notificationService.saveNotification(location, date);
  }
}
