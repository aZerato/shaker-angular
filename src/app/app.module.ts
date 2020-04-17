import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

// start Users components
import { UsersComponent } from './users/users.component';
import { AuthComponent } from './users/auth/auth.component';
import { ProfileComponent } from './users/profile/profile.component';
import { AccountComponent } from './users/account/account.component';
// end Users components

// start Chat components
import { RoomsComponent } from './chat/rooms/rooms.component';
import { AppRoutingModule } from './app.routing.module';
// end chat components

// start shared components
import { PageForbiddenComponent } from './shared/components/page-forbidden/page-forbidden.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PageComponent } from './page/page.component';
// end shared components

@NgModule({
  declarations: [
    AppComponent,
    
    UsersComponent,
    AuthComponent,
    ProfileComponent,
    AccountComponent,

    RoomsComponent,

    PageComponent,

    HeaderComponent,
    FooterComponent,
    PageForbiddenComponent,
    PageNotFoundComponent
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
