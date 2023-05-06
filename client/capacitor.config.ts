import { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

const config: CapacitorConfig = {
  appId: 'com.locationreminder.app',
  appName: 'locationreminder',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Ionic,
      style: KeyboardStyle.Light,
      resizeOnFullScreen: true,
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '711358070411-ibpj1lvqushopekhog1pkga4t30fv242.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  }
};

export default config;
