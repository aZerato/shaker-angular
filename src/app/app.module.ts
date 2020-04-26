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
import { UserNewComponent } from './users/new/user-new.component';
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

import { MovementsComponent } from './movements/movements.component';
import { MovementsHomeComponent } from './movements/home/movements-home.component';
import { MovementComponent } from './movements/movement/movement.component';
import { MovementSettingsComponent } from './movements/movement/settings/movement-settings.component';

import { TrainingsComponent } from './trainings/trainings.component';
import { TrainingsHomeComponent } from './trainings/home/trainings-home.component';
import { TrainingComponent } from './trainings/training/training.component';
import { TrainingSettingsComponent } from './trainings/training/settings/training-settings.component';

import { PlanningComponent } from './planning/planning.component';

import { MetricsComponent } from './metrics/metrics.component';

@NgModule({
  declarations: [
    AppComponent,
    
    UsersComponent,
    AuthComponent,
    LogoutComponent,
    ProfileComponent,
    AccountComponent,
    UserNewComponent,

    PlanningComponent,

    MetricsComponent,

    ChannelsComponent,
    ChannelsHomeComponent,
    ChannelComponent,
    ChannelSettingsComponent,
    MessagesComponent,
    UserMessageComponent,

    MovementsComponent,
    MovementsHomeComponent,
    MovementComponent,
    MovementSettingsComponent,

    TrainingsComponent,
    TrainingsHomeComponent,
    TrainingComponent,
    TrainingSettingsComponent,

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
