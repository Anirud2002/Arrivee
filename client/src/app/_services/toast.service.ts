import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast: HTMLIonToastElement;
  constructor(
    private toastController: ToastController
  ) { }

  async createSuccessToast(message: string, duration: number = 1000, color: string = "tertiary"){
    this.toast = await this.toastController.create({
      message,
      duration,
      color
    });
    await this.toast.present();
  }

  async createErrorToast(message: string, duration: number = 1000, color: string = "danger"){
    this.toast = await this.toastController.create({
      message,
      duration,
      color
    });
    await this.toast.present();
  }

  async createWarningToast(message: string, duration: number = 1000, color: string = "warning"){
    this.toast = await this.toastController.create({
      message,
      duration,
      color
    });
    await this.toast.present();
  }
}
