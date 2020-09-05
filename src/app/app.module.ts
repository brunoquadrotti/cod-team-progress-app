import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CodMwStatusService } from './shared/services/cod-mw-status.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';
import { SmartCardUserComponent } from './smart-card-user/smart-card-user.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { LastMatchesComponent } from './last-matches/last-matches.component';
import { SortByDatePipe } from './shared/pipes/sort-by-date.pipe';
import { UtilsService } from './shared/services/utils.service';
import { OrdinalPipe } from './shared/pipes/ordinal.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SmartCardUserComponent,
    HomeComponent,
    ProfileComponent,
    LastMatchesComponent,
    SortByDatePipe,
    OrdinalPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({}),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule
  ],
  providers: [
    CodMwStatusService,
    UtilsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
