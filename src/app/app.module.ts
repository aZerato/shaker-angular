import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// start externals modules
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// end externals modules

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

// start Users components
import { UsersComponent } from './users/users.component';
import { AuthComponent } from './users/auth/auth.component';
import { LogoutComponent } from './users/logout/logout.component';
import { ProfileComponent } from './users/profile/profile.component';
import { AccountComponent } from './users/account/account.component';
import { NewComponent } from './users/new/new.component';
// end Users components

// start Channels components
import { ChannelsComponent } from './channels/channels.component';
import { ChannelsHomeComponent } from './channels/home/channels-home.component';
import { ChannelComponent } from './channels/channel/channel.component';
import { ChannelSettingsComponent } from './channels/channel/settings/channel-settings.component';
import { MessagesComponent } from './channels/channel/messages/messages.component';
import { UserMessageComponent } from './channels/channel/messages/user-message/user-message.component';
// end Channels components

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
    NewComponent,

    ChannelsComponent,
    ChannelsHomeComponent,
    ChannelComponent,
    ChannelSettingsComponent,
    MessagesComponent,
    UserMessageComponent,

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
    NgbModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
