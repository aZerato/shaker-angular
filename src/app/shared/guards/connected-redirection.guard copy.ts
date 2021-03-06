import { Injectable } from '@angular/core';
import { 
    ActivatedRouteSnapshot, 
    CanActivate,
    RouterStateSnapshot, 
    Router,
    UrlTree
} from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

import { AuthenticationService } from 'src/app/users/services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class ConnectedRedirectionGuard implements CanActivate {
    
    constructor(private authenticationService: AuthenticationService,
        private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, 
                state: RouterStateSnapshot): Observable<boolean | UrlTree>
    {
        return this.authenticationService.getUserConnected()
            .pipe(
                map(userConnected => {
                    if (userConnected)
                    {
                        this.router.parseUrl('/users');
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                },
                error => {
                    this.router.parseUrl('/forbidden');
                    return false;
                })
            );
    }

}