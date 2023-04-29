import { FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";

export const ProfileValidators =
  (): ValidatorFn =>
  (Group: FormGroup): ValidationErrors => {    
    const OldPassword = Group.controls["oldPassword"];
    const NewPassword = Group.controls["newPassword"];

    if(OldPassword.value && !NewPassword.value){
        NewPassword.setErrors({required: true});
    }else{
        NewPassword.setErrors(null);
    }

    if(NewPassword.value && !OldPassword.value){
        OldPassword.setErrors({required: true});
    }else{
        OldPassword.setErrors(null);
    }
    return null;
    
  }