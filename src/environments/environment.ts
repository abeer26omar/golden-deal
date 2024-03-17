// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api_url: 'https://admin.gooldendeal.com/api',
  socket_url: 'http://localhost:3000/',
  // socket_url: 'https://goldendealchat-35954574f978.herokuapp.com/',
  firebase: {
    apiKey: "AIzaSyDt354Yq0BWiLnO-KFqMtsOpVR1_MY-inI",
    authDomain: "golden-deal-faa53.firebaseapp.com",
    projectId: "golden-deal-faa53",
    storageBucket: "golden-deal-faa53.appspot.com",
    messagingSenderId: "841291602706",
    appId: "1:841291602706:web:95aa80976160b35137f1cb",
    measurementId: "G-1C9FPXMCX2",
    vapidKey: "BOPFYKczQzswyf30MaAn-G7_EfZLg50pqZwBIc6m1DtTqU7reBLR-Q56QCJ4aVmZfKVnpSzYoNHH96UqDmcQMGE"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
