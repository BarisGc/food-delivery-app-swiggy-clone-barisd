import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.technyks.mazaEatsApp',
  appName: 'Maza Eats',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      // launchAutoHide: true,
      backgroundColor: "#de0f17",
      // androidSplashResourceName: "splash",
      // androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "small",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
