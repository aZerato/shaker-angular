import { Injectable } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { AuthenticationModel } from '../models/authentication.model';

@Injectable({
 providedIn: 'root'
})
export class AuthenticationService
{
    authenticationStatusChangeSubject: Subject<boolean> = new Subject<boolean>();

    private userAuthenticationStatus: boolean = false;

    login(authenticationModel: AuthenticationModel): void
    {
        // call svr.
        
        // good path
        this.userAuthenticationStatus = true;

        this.authenticationStatusChangeSubject.next(this.userAuthenticationStatus);
    }

    logoff(): void
    {
        // call svr.
        this.userAuthenticationStatus = false;

        this.authenticationStatusChangeSubject.next(this.userAuthenticationStatus);
    }

    isAuthenticated(): Observable<boolean>
    {
        // call svr to verify auth status.
        // fake with delay.
        return of(this.userAuthenticationStatus).pipe(delay(1000));
    }
}