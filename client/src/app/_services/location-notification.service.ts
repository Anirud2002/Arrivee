import { Injectable } from '@angular/core';
import { LocationPermService } from './location-perm.service';
import { NotificationPermService } from './notification-perm.service';
import { Geolocation } from '@capacitor/geolocation';
import { Coords } from '../_interfaces/Location.modal';
import { LocationService } from './location.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Location } from '../_interfaces/Location.modal';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class LocationNotificationService {
  locations: Location[];
  watchID: string;
  userCoords: Coords;
  locationPermStatus: string;
  notificationPermStatus: string;
  constructor(
    private locationService: LocationService,
    private notificationService: NotificationService,
    private locationPermService: LocationPermService,
    private notificationPermService: NotificationPermService
  ) { }

  async getLocations(){
    this.locations = await this.locationService.getLocations();
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
    if(this.locationPermStatus !== "granted" || this.notificationPermStatus !== "granted"){
      return;
    }

    // first, let's get the all the locations
    await this.getLocations();

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
    })
  }

  // stops watching for user's location
  async clearWatchUserLocation(){
    if(this.watchID){
      await Geolocation.clearWatch({id: this.watchID});
      this.userCoords = null;
    }
  }

   // checks users and location coords and triggers the push notificaion workflow 
   checkUserAndLocationsCoords(userCoord: Coords){
    if(!this.locations){
      return;
    }
    this.locations.forEach(async location => {
      let distanceFromUser = this.getDistance(userCoord.latitude, userCoord.longitude, location.coords.latitude, location.coords.longitude, location.radiusUnit);
      if(distanceFromUser <= location.radius && this.canNotificationBePushed(location.notificationTimestamp)){
        location.notificationTimestamp = await this.locationService.updateLocationTimestamp(location.locationID);
        // schedules the notification at the same instant
        setTimeout(async() => {
          await this.scheduleNotification(new Date(), location);
        }, 500)
      }
    })
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
        }
      }]
    });

    await this.notificationService.saveNotification(location, date);
  }
}
