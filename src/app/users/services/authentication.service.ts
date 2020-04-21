import { Injectable } from '@angular/core';

import { Observable, Subject, of, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageMap } from '@ngx-pwa/local-storage';

import { AuthenticationModel } from '../models/authentication.model';
import { UserModel } from '../../shared/models/user.model';
import { CreationModel } from '../models/creation.model';

@Injectable({
 providedIn: 'root'
})
export class AuthenticationService
{
    authenticationStatusChangeSubject: Subject<boolean> = new Subject<boolean>();
    creationErrorSubject: Subject<string> = new Subject<string>();

    private userAuthenticationStatus: boolean = false;

    private userConnected: UserModel;

    constructor(private storageMap: StorageMap) { }

    private onError(error?: any, message?: string): void {
        if (error)
            console.error(error);

        if (message)
        {
            console.trace(message);
            this.creationErrorSubject.next(message);
        }
        else
        {
            this.creationErrorSubject.next('Oops, we encountered an error. Please try again !');
        }
    }

    create(create: CreationModel): void
    {
        const user = new UserModel(create.name, create.email, create.password);

        this.storageMap
            .get<UserModel>(user.key, UserModel.schema)
            .subscribe((userDatabase: UserModel) => {
                if (userDatabase) 
                {
                    this.onError(null, 'This user already exist !');
                }
                else 
                {
                    this.storageMap.set(
                        user.key,
                        user,
                        UserModel.schema
                    ).subscribe(() => {
                        const auth = new AuthenticationModel(user.email, '', false);
                        auth.prepareSave();
                        this.storageMap.set(
                            AuthenticationModel.staticKey(),
                            auth,
                            AuthenticationModel.schema
                        ).subscribe(() => {
                            this.userAuthenticationStatus = true;
                            this.userConnected = user;
                            this.authenticationStatusChangeSubject.next(this.userAuthenticationStatus);
                        },
                        (error: any) => {
                            this.onError(error);
                        });
                    },
                    (error: any) => {
                        this.onError(error);
                    });
                }
            },
            (error: any) => {
                this.onError(error);
            });
    }

    login(authenticationModel: AuthenticationModel): void
    {
        // call svr.
        

        // find local.
        const key = authenticationModel.email;
        this.storageMap.get<UserModel>(key, UserModel.schema).subscribe((user: UserModel) => {
            if (user) 
            {
                const auth = new AuthenticationModel(user.email, '', false);
                auth.prepareSave();
                this.storageMap.set(
                    AuthenticationModel.staticKey(),
                    auth,
                    AuthenticationModel.schema
                ).subscribe(() => {
                    this.userAuthenticationStatus = true;
                    this.userConnected = user;
                    this.authenticationStatusChangeSubject.next(this.userAuthenticationStatus);
                },
                (error: any) => {
                    this.onError(error);
                });
            }
        },
        (error: any) => {
            this.onError(error);
        });
    }

    logoff(): void
    {
        // call svr.

        // local
        this.storageMap.delete(
            AuthenticationModel.staticKey()
        ).subscribe(() => {
            this.userAuthenticationStatus = false;
            this.userConnected = undefined;
            this.authenticationStatusChangeSubject.next(this.userAuthenticationStatus);
        });
    }

    isAuthenticated(): Observable<boolean>
    {
        if (this.getUserConnected())
        {
            return of(true)
        }
        
        return this.storageMap
            .get(AuthenticationModel.staticKey())
            .pipe<boolean>(
                map((auth: AuthenticationModel) => {
                    if (auth)
                    {
                        this.storageMap
                            .get<UserModel>(auth.email, UserModel.schema)
                            .subscribe((user: UserModel) => {
                                this.userAuthenticationStatus = true;
                                this.userConnected = user;
                                this.authenticationStatusChangeSubject.next(this.userAuthenticationStatus);
                            });

                        return true;
                    }
                    return false;
                })
            );
    }

    getUserConnected(): UserModel {

        return this.userConnected;
    }
}