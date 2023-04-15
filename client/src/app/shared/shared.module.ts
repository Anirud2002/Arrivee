import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [CommonModule, IonicModule, RouterModule, FormsModule, HttpClientModule]
})
export class SharedModule { }
