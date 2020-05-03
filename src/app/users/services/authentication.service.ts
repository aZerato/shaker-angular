import { Injectable } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';

import { HttpClient } from "@angular/common/http";
import { StorageMap } from '@ngx-pwa/local-storage';

import { AuthenticationModel } from '../models/authentication.model';
import { User } from '../../shared/models/user.model';
import { Bearer, bearerKey, bearerSchema } from '../models/bearer.model';
import { environment } from 'src/environments/environment';
import { flatMap, map } from 'rxjs/operators';

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

        if (!message)
            message = error?.error.message;

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
            
            const bearer = new Bearer(user);
            this._storageMap.set(
                bearerKey,
                bearer,
                bearerSchema
            ).subscribe(() => {
                this._bearer = bearer;
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
        this._httpClient
        .post(environment.backend.routes.login, auth)
        .subscribe((user: User) => {
            if(user.error)
            {
                this.onError(null, user.error);
                return;
            }
            
            const bearer = new Bearer(user);
            this._storageMap.set(
                bearerKey,
                bearer,
                bearerSchema
            ).subscribe(() => {
                this._bearer = bearer;
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
        if (this._userConnected)
        { 
            return of(this._userConnected);
        }

        return this.getToken()
                .pipe<User>(
                    flatMap((bearer: Bearer) => {
                        if (!bearer || !bearer.userId)
                        {
                            return of(null)
                        }
                        // reuse bearer token completly in header. for re get data.
                        return this.getUserById(bearer.userId)
                            .pipe(map((user: User) => {
                                if (!user) return;

                                this._userConnected = user;
                                this.authenticationStatusChangeSubject.next(true);
                            }));
                    })
                );
    }

    getUserById(userId: string): Observable<User>
    {
        if (userId == this._userConnected?.id)
        {
            return of(this._userConnected);
        }

        return this._httpClient
            .get<User>(`${environment.backend.routes.users}/${userId}`);
    }

    private _bearer: Bearer;
    getToken() : Observable<Bearer>
    {
        if (this._bearer) return of(this._bearer);

        return this._storageMap.get(
            bearerKey,
            bearerSchema
        ).pipe<Bearer>(map((bearer: Bearer) => {
            return this._bearer = bearer;
        }));
    }

    getHeaderAutorizationValue() : Observable<string> {
        return this.getToken()
                .pipe(map((bearer: Bearer) => 
                {
                    return bearer?.token;
                }));
    }
}