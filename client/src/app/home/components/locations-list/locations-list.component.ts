import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class LocationsListComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
