import { Injectable } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { StorageMap } from '@ngx-pwa/local-storage';

import { AuthenticationModel } from '../models/authentication.model';
import { User } from '../../shared/models/user.model';
import { BearerModel, bearerKey, bearerSchema } from '../models/bearer.model';
import { environment } from 'src/environments/environment';

@Injectable({
 providedIn: 'root'
})
export class AuthenticationService
{
    private _userConnected: User; 
    authenticationStatusChangeSubject: Subject<boolean> = new Subject<boolean>();
    authenticationErrorSubject: Subject<string> = new Subject<string>();

    constructor(
        private _httpClient: HttpClient,
        private _storageMap: StorageMap) 
    { }

    private onError(error?: any, message?: string): void {
        if (error)
            console.error(error);

        if (message)
        {
            console.trace(message);
            this.authenticationErrorSubject.next(message);
        }
        else
        {
            this.authenticationErrorSubject.next('Oops, we encountered an error. Please try again !');
        }
    }

    create(auth: AuthenticationModel): void
    {
        this._httpClient
        .post(environment.backend.routes.creation, auth)
        .subscribe((user: User) => {
            
            if(user.error)
            {
                this.onError(null, user.error);
                return;
            }
            
            const bearer = new BearerModel(user);
            this._storageMap.set(
                bearerKey,
                bearer,
                bearerSchema
            ).subscribe(() => {
                this._userConnected = user;
                this.authenticationStatusChangeSubject.next(true);
            },
            (error: any) => {
                this.onError(error);
            });
        },
        (error: any) => {
            this.onError(error);
        });
    }

    login(auth: AuthenticationModel): void
    {
        const httpOptions = {
            headers: new HttpHeaders().set('Content-Type', 'application/json')
        };
        this._httpClient
        .post(environment.backend.routes.login, auth, httpOptions)
        .subscribe((user: User) => {
            if(user.error)
            {
                this.onError(null, user.error);
                return;
            }
            
            const bearer = new BearerModel(user);
            this._storageMap.set(
                bearerKey,
                bearer,
                bearerSchema
            ).subscribe(() => {
                this._userConnected = user;
                this.authenticationStatusChangeSubject.next(true);
            },
            (error: any) => {
                this.onError(error);
            });
        },
        (error: any) => {
            this.onError(error);
        });
    }

    logoff(): void
    {
        this._storageMap.delete(
            bearerKey
        ).subscribe(() => {
            this._userConnected = undefined;
            this.authenticationStatusChangeSubject.next(false);
        });
    }

    getUserConnected(): Observable<User>
    {
        return of(this._userConnected);
    }

    getUserByGuid(userId: number): Observable<User>
    {
        return this._httpClient
        .get<User>(environment.backend.routes.users, 
            {
                params: { id: userId.toString() }
            });
    }
}