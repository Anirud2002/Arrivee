import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../shared/shared.module';
import { Location } from '../../../_interfaces/Location.modal';
import { LocationService } from '../../../_services/location.service';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class LocationsListComponent  implements OnInit {
  @Input() locations: Location[];
  constructor(
    private alertController: AlertController,
    private locationService: LocationService
  ) { }

  ngOnInit() {}

  async handleDeleteLocation(location: Location){
    const alert = await this.alertController.create({
      header: "Delete Location?",
      "message": `You have ${location.reminders.length} reminders.`,
      buttons: [
        {
          text: "Yes",
          handler: async () => {
            await this.locationService.deleteLocation(location.locationID);
          }
        },
        {
          text: "No",
          role: "cancel"
        }
      ]
    })
    await alert.present();
  }

}
