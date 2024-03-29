export interface User{
    firstname: string, 
    lastname: string, 
    username: string, 
    email: string, 
    isGoogleUser: boolean,
    token: string
}

export interface LoginDTO{
    username: string, 
    password: string
}

export interface RegisterDTO{
    firstname: string, 
    lastname: string, 
    username: string, 
    email: string, 
    password: string
}

export interface GoogleSignInDTO{
    firstname: string, 
    lastname: string, 
    email: string, 
}

export interface UpdateUserDTO{
    firstname: string, 
    lastname: string, 
    username: string, 
    oldPassword: string
    newPassword: string
}

export interface ResetPasswordDTO {
    username: string,
    newPassword: string
}