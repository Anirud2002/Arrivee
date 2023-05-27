import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

const config: CapacitorConfig = {
  appId: 'com.arrivee.app',
  appName: 'Arrivee',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    Keyboard: {
      resize: KeyboardResize.None,
      style: KeyboardStyle.Light,
      resizeOnFullScreen: true,
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '711358070411-ibpj1lvqushopekhog1pkga4t30fv242.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 3000,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
  }
};

export default config;
