import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-locations-list-skeleton',
  templateUrl: './locations-list-skeleton.component.html',
  styleUrls: ['./locations-list-skeleton.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class LocationsListSkeletonComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
