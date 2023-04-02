import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../shared/shared.module';

enum SelectedUnit{
  km = "km",
  m = "m",
  mil = "mil"
}

@Component({
  selector: 'app-add-location-modal',
  templateUrl: './add-location-modal.component.html',
  styleUrls: ['./add-location-modal.component.scss'],
  standalone: true,
  imports: [SharedModule],
})
export class AddLocationModalComponent implements OnInit {
  selectedUnit: SelectedUnit = SelectedUnit.m;
  constructor() { }

  ngOnInit() {
  }

  returnUnit = (value: number) => {
    return `${value}${this.selectedUnit}`
  }

  getMax(){
    let retVal;
    switch(this.selectedUnit){
      case SelectedUnit.km:
        retVal = 5;
        break;
      case SelectedUnit.m:
        retVal = 1000;
        break;
      case SelectedUnit.mil:
        retVal = 5;
        break;
      default:
        retVal = 0;
        break;
    }
    return retVal;
  }

  getMin(){
    let retVal;
    switch(this.selectedUnit){
      case SelectedUnit.km:
        retVal = 1;
        break;
      case SelectedUnit.m:
        retVal = 10;
        break;
      case SelectedUnit.mil:
        retVal = 1;
        break;
      default:
        retVal = 0;
        break;
    }
    return retVal;
  }

}
