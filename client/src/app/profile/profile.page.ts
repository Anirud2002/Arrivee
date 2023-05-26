import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../_services/auth.service';
import { User } from '../_interfaces/Auth.modal';
import { SharedModule } from '../shared/shared.module';
import { ProfileValidators } from './profile-form.util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule]
})
export class ProfilePage implements OnInit {
  user: User = {} as User;
  profileForm: FormGroup;
  isFetchingData: boolean;
  isOldPasswordHidden: boolean = true;
  isNewPasswordHidden: boolean = true;
  usernameTaken: boolean = false;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  async ngOnInit() {
    await this.getUser();
    this.initProfileForm();
  }

  async getUser(): Promise<void>{
    this.isFetchingData = true;
    this.user = await this.authService.getUser()
    .then((res) => {
      this.isFetchingData = false;
      return res;
    })
    .catch(_ => {
      this.isFetchingData = false;
      return null;
    });
  }

  initProfileForm(): void{
    this.profileForm = this.formBuilder.group({
      firstname: [this.user.firstname, Validators.required],
      lastname: [this.user.lastname, Validators.required],
      username: [this.user.username, Validators.required],
      oldPassword: [""],
      newPassword: [""],
    });
    this.profileForm.setValidators(ProfileValidators());
  }

  hasError(controlName: string): boolean{
    let control = this.profileForm.get(controlName);
    if(control){
      return control.touched && control.hasError("required");
    }
    return false;
  }

  markAsTouched(controlName: string): void{
    let control = this.profileForm.get(controlName);
    control.markAsTouched();
  }

  get isOldPasswordInputEmpty() : boolean{
    return this.profileForm.controls['oldPassword'].value.length === 0;
  }

  toggleOldPasswordVisibility(){
    this.isOldPasswordHidden = !this.isOldPasswordHidden;
  }

  get isNewPasswordInputEmpty() : boolean{
    return this.profileForm.controls['newPassword'].value.length === 0;
  }

  toggleNewPasswordVisibility(){
    this.isNewPasswordHidden = !this.isNewPasswordHidden;
  }

  async checkUsername(e){
    let username = e.detail.value;
    if(!username){ // if it an empty value, don't do anything
      return;
    }

    if(this.user.username === username){ // user basically again re-typed their username so don't do anything
      return;
    }

    this.usernameTaken = false;
    const retVal = await this.authService.checkUsername(username);
    if(!retVal){ // means username is already taken
      this.profileForm.get("username").setErrors({usernameTaken: true});
      this.usernameTaken = true;
    }
  }

  async handleUpdateInfo(): Promise<void>{
    const controlNames = Object.keys(this.profileForm.controls);
    let errorCounts = 0;
    // loop through each control and check if it has errors
    for (const controlName of controlNames) {
      if(this.profileForm.controls[controlName].errors != null){
        errorCounts++;
      }
    }

    if(errorCounts > 0){
      return;
    }

    // handle update user info
    await this.authService.updateUser(this.profileForm.value).then(_ => {
      this.getUser();
      this.profileForm.markAsPristine();
    });
  }

}
