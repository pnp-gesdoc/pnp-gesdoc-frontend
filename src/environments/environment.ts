// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  URL_SVC_GDPNP: 'http://localhost:8080',
  URL_ASSETS: './assets',

  // ROUTING
  URL_HOME: '/',
  // PAGINATION
  ROWS_PAGE: 10,  // Filas por página
  START_PAGE: 1,  // Página inicial

  // STATUS CODE
  CODE_200: '200',
  CODE_201: '201',
  CODE_400: '400',
  CODE_401: '401',
  CODE_404: '404',
  CODE_500: '500',

  // VALUES
  NULL: null,
  UNDEFINED: undefined,
  EMPTY: '',
  INT_ZERO: 0,
  INT_ONE: 1,

  // ALERTAS
  ALERT_POSITION_VERTICAL: 'bottom',
  ALERT_POSITION_HORIZONTAL: 'left',
  ALERT_DURATION: 3500,

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
