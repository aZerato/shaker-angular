import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PageComponent } from './page/page.component';

import { ProfileComponent } from './users/profile/profile.component';
import { AccountComponent } from './users/account/account.component';
import { AuthComponent } from './users/auth/auth.component';
import { LogoutComponent } from './users/logout/logout.component';
import { UsersComponent } from './users/users.component';

import { RoomsComponent } from './rooms/rooms.component';
import { RoomComponent } from './rooms/room/room.component';

import { AuthenticationGuard } from './shared/guards/authentication.guard';

const appRoutes: Routes = [
    { 
      path: '',
      pathMatch: 'full',
      component: HomeComponent
    },
    { 
        path: 'page/:page-name', 
        component: PageComponent
      },
    { 
        path: 'auth', 
        component: AuthComponent
    },
    { 
        path: 'disc', 
        component: LogoutComponent
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
                path: 'profile', 
                component: ProfileComponent
            },
            { 
                path: 'account', 
                component: AccountComponent
            }
        ]
    },
    {
        path: 'rooms',
        component: RoomsComponent,
        canActivate: [
            AuthenticationGuard
        ],
    },
    {
        path: 'rooms/:id', 
        component: RoomComponent,
        canActivate: [
            AuthenticationGuard
        ],
    },
    { 
        path: 'page/forbidden', 
        component: PageComponent
    },
    { 
        path: 'page/not-found',
        component: PageComponent
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