// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backend: {
    routes: {
      root: 'https://localhost:5001',
      creation: 'https://localhost:5001/auth/create',
      login: 'https://localhost:5001/auth/authenticate',

      users: 'https://localhost:5001/api/users',

      channels: 'https://localhost:5001/api/channels',
      messages: 'https://localhost:5001/api/messages'
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
