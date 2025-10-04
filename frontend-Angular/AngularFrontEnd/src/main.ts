import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));