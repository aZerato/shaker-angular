import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { AuthComponent } from './users/auth/auth.component';
import { ProfileComponent } from './users/profile/profile.component';
import { AccountComponent } from './users/account/account.component';

import { RoomsComponent } from './chat/rooms/rooms.component';

@NgModule({
  declarations: [
    AppComponent,
    
    AuthComponent,
    ProfileComponent,
    AccountComponent,

    RoomsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
