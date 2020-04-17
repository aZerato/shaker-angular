import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

// start Users components
import { UsersComponent } from './users/users.component';
import { AuthComponent } from './users/auth/auth.component';
import { LogoutComponent } from './users/logout/logout.component';
import { ProfileComponent } from './users/profile/profile.component';
import { AccountComponent } from './users/account/account.component';
// end Users components

// start Chat/Rooms components
import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './rooms/room/room.component';
// end Chat/Rooms components

// start Shared components
import { PageComponent } from './page/page.component';
import { HomeComponent } from './home/home.component';

import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
// end Shared components

@NgModule({
  declarations: [
    AppComponent,
    
    UsersComponent,
    AuthComponent,
    LogoutComponent,
    ProfileComponent,
    AccountComponent,

    RoomsComponent,
    RoomComponent,

    HomeComponent,
    PageComponent,

    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
