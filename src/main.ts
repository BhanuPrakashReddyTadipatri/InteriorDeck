import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';


/** import theme files here: */
// import 'echarts/theme/dark.js';
// import 'echarts/theme/macarons.js';
// import 'echarts/theme/london.js';
// import 'echarts/theme/blue.js';
// import 'echarts/theme/cool.js';
// import 'echarts/theme/royal.js';
// import 'echarts/theme/mint.js';


if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
