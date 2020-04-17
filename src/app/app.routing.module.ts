import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageForbiddenComponent } from './shared/components/page-forbidden/page-forbidden.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { ProfileComponent } from './users/profile/profile.component';
import { AccountComponent } from './users/account/account.component';
import { AuthComponent } from './users/auth/auth.component';
import { UsersComponent } from './users/users.component';
import { AuthenticationGuard } from './shared/guards/authentication.guard';

const appRoutes: Routes = [
    { 
      path: '', 
      redirectTo: '/auth',
      pathMatch: 'full'
    },
    { 
        path: 'auth', 
        component: AuthComponent
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
        path: 'forbidden', 
        component: PageForbiddenComponent
    },
    { 
        path: 'not-found', 
        component: PageNotFoundComponent
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