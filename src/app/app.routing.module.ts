import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageComponent } from './page/page.component';

import { ProfileComponent } from './users/profile/profile.component';
import { AccountComponent } from './users/account/account.component';
import { AuthComponent } from './users/auth/auth.component';
import { LogoutComponent } from './users/logout/logout.component';
import { UsersComponent } from './users/users.component';
import { UserNewComponent } from './users/new/user-new.component';

import { ChannelsComponent } from './channels/channels.component';
import { ChannelsHomeComponent } from './channels/home/channels-home.component';
import { ChannelComponent } from './channels/channel/channel.component';
import { ChannelSettingsComponent } from './channels/channel/settings/channel-settings.component';
import { ChannelResolverService } from './channels/resolvers/channel.resolver';

import { AuthenticationGuard } from './shared/guards/authentication.guard';
import { CheckUserConnectedGuard } from './shared/guards/check-user-connected.guard';
import { ConnectedRedirectionGuard } from './shared/guards/connected-redirection.guard copy';

import { MovementsComponent } from './movements/movements.component';
import { MovementResolverService } from './movements/resolvers/movement.resolver';
import { MovementsHomeComponent } from './movements/home/movements-home.component';
import { MovementSettingsComponent } from './movements/movement/settings/movement-settings.component';
import { MovementComponent } from './movements/movement/movement.component';

import { TrainingResolverService } from './trainings/resolvers/training.resolver';
import { TrainingSettingsComponent } from './trainings/training/settings/training-settings.component';
import { TrainingsComponent } from './trainings/trainings.component';
import { TrainingComponent } from './trainings/training/training.component';
import { TrainingsHomeComponent } from './trainings/home/trainings-home.component';

import { PlanningComponent } from './planning/planning.component';
import { CalendarComponent } from './planning/calendar/calendar.component';

import { MetricsComponent } from './metrics/metrics.component';
import { MetricsChartComponent } from './metrics/chart/metrics-chart.component';

const appRoutes: Routes = [
    { 
      path: '',
      pathMatch: 'full',
      component: HomeComponent,
      canActivate: [CheckUserConnectedGuard]
    },
    { 
        path: 'page/:page-name', 
        component: PageComponent,
        canActivate: [CheckUserConnectedGuard]
    },
    { 
        path: 'new', 
        component: UserNewComponent,
        canActivate: [ConnectedRedirectionGuard]
    },
    { 
        path: 'auth', 
        component: AuthComponent,
        canActivate: [ConnectedRedirectionGuard]
    },
    { 
        path: 'logout', 
        component: LogoutComponent,
        canActivate: [CheckUserConnectedGuard]
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [
            AuthenticationGuard
        ],
        children: [
            { 
                path: '', 
                component: ProfileComponent
            },
            { 
                path: 'account', 
                component: AccountComponent
            }
        ]
    },
    {
        path: 'planning',
        component: PlanningComponent,
        canActivate: [
            AuthenticationGuard
        ],
        children: [
            {
                path: '',
                component: CalendarComponent
            }
        ]
    },
    {
        path: 'metrics',
        component: MetricsComponent,
        canActivate: [
            AuthenticationGuard
        ],
        children: [
            {
                path: '',
                component: MetricsChartComponent
            }
        ]
    },
    {
        path: 'channel',
        component: ChannelsComponent,
        canActivate: [
            AuthenticationGuard
        ],
        children: [
            {
                path: '',
                component: ChannelsHomeComponent
            },
            {
                path: ':id', 
                component: ChannelComponent,
                resolve: {
                    channel: ChannelResolverService
                }
            },
            {
                path: ':id/settings',
                component: ChannelSettingsComponent,
                resolve: {
                    channel: ChannelResolverService
                }
            }
        ]
    },
    {
        path: 'movement',
        component: MovementsComponent,
        canActivate: [
            AuthenticationGuard
        ],
        children: [
            {
                path: '',
                component: MovementsHomeComponent
            },
            {
                path: ':id', 
                component: MovementComponent,
                resolve: {
                    movement: MovementResolverService
                }
            },
            {
                path: ':id/settings',
                component: MovementSettingsComponent,
                resolve: {
                    movement: MovementResolverService
                }
            }
        ]
    },
    {
        path: 'training',
        component: TrainingsComponent,
        canActivate: [
            AuthenticationGuard
        ],
        children: [
            {
                path: '',
                component: TrainingsHomeComponent
            },
            {
                path: ':id', 
                component: TrainingComponent,
                resolve: {
                    training: TrainingResolverService
                }
            },
            {
                path: ':id/settings',
                component: TrainingSettingsComponent,
                resolve: {
                    movement: TrainingResolverService
                }
            }
        ]
    },
    { 
        path: 'page/forbidden', 
        component: PageComponent,
        canActivate: [CheckUserConnectedGuard]
    },
    { 
        path: 'page/not-found',
        component: PageComponent,
        canActivate: [CheckUserConnectedGuard]
    }
    //,{ 
    //   path: '**', 
    //   redirectTo: 'not-found'
    // }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

}