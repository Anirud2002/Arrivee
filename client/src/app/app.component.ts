import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, SharedModule],
})
export class AppComponent {
  constructor() {}
}
