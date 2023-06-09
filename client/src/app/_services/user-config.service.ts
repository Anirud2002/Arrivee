import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { StatusBar, Style } from '@capacitor/status-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  private enableTrackingToggle: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  enableTrackingToggle$ = this.enableTrackingToggle.asObservable();
  theme: string;
  constructor(
  ) { }

  async getEnableTrackingValue() : Promise<boolean> {
    const {value} = await Preferences.get({key: "enableTracking"});
    if(!value){
      Preferences.set({
        key: "enableTracking",
        value: "false"
      });
      return false;
    }
    return JSON.parse(value);
  }

  setEnableTrackingValue(value: boolean, locationPermStatus: string) {
    if(value && locationPermStatus !== "granted"){
      value = false;
    }
    this.enableTrackingToggle.next(value);
    Preferences.set({
      key: "enableTracking",
      value: JSON.stringify(value)
    });
  }

  async applyThemeOnInit(){
    this.theme = (await Preferences.get({key: "theme"})).value;
    if(!this.theme || this.theme === "system"){
      this.applyTheme("system")
    }else{
      this.applyTheme(this.theme as "dark" | "light" | "system");
    }
  }

  async applyTheme(theme: "dark" | "light" | "system"){
    switch(theme){
      case "light":
        document.body.setAttribute("color-theme", "light");
        await StatusBar.setStyle({
          style: Style.Light
        });
        break;
      case "dark":
        document.body.setAttribute("color-theme", "dark");
        await StatusBar.setStyle({
          style: Style.Dark
        })
        break;
      case "system":
        // need to set the theme local storage to whatever the user's system pref theme is
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if(prefersDark){
          this.applyTheme("dark");
        }else{
          this.applyTheme("light")
        }
        break;
    }
    this.setThemeToLocalStorage(theme);
  }

  async getTheme(): Promise<string>{
    const theme = await Preferences.get({key: "theme"});
    return theme.value;
  }

  async setThemeToLocalStorage(theme: "dark" | "light" | "system"){
    await Preferences.set({
      key: "theme",
      value: theme
    })
  }
}
