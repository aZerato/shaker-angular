import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageComponent } from './page/page.component';

import { ProfileComponent } from './users/profile/profile.component';
import { AccountComponent } from './users/account/account.component';
import { AuthComponent } from './users/auth/auth.component';
import { LogoutComponent } from './users/logout/logout.component';
import { UsersComponent } from './users/users.component';
import { NewComponent } from './users/new/new.component';

import { ChannelsComponent } from './channels/channels.component';
import { ChannelComponent } from './channels/channel/channel.component';

import { AuthenticationGuard } from './shared/guards/authentication.guard';
import { CheckUserConnectedGuard } from './shared/guards/check-user-connected.guard';
import { ConnectedRedirectionGuard } from './shared/guards/connected-redirection.guard copy';
import { ChannelResolverService } from './channels/resolvers/channel.resolver';

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
        component: NewComponent,
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
        path: 'channel',
        component: ChannelsComponent,
        canActivate: [
            AuthenticationGuard
        ],
        children: [
            {
                path: ':guid', 
                component: ChannelComponent,
                resolve: {
                    channel: ChannelResolverService
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