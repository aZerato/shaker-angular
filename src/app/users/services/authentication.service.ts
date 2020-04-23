import { Injectable } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageMap } from '@ngx-pwa/local-storage';

import { AuthenticationModel, authenticationKey, authenticationSchema } from '../models/authentication.model';
import { UserModel, usersSchemaArr, usersKey, userSchema } from '../../shared/models/user.model';
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

        this.getAllUsers()
            .subscribe((userDatabases: UserModel[]) => 
            {
                const userDatabase = userDatabases?.find(ub => ub.email === user.email);
                if (userDatabase) 
                {
                    this.onError(null, 'This user already exist !');
                }
                else 
                {
                    if (!userDatabases) userDatabases = [];
                    userDatabases.push(user);

                    this.storageMap.set(
                        usersKey,
                        userDatabases,
                        usersSchemaArr
                    ).subscribe(() => {
                        
                        const auth = new AuthenticationModel(user, false);
                        auth.prepareSave();
                        this.storageMap.set(
                            authenticationKey,
                            auth,
                            authenticationSchema
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

    login(auth: AuthenticationModel): void
    {
        // call svr.
        
        // find local.
        this.getAllUsers()
            .subscribe((users: UserModel[]) => {
                const user = users?.find(ub => ub.email == auth.email && ub.password == auth.password);    
                if (user) 
                {
                    const auth = new AuthenticationModel(user, false);
                    auth.prepareSave();
                    this.storageMap.set(
                        authenticationKey,
                        auth,
                        authenticationSchema
                    ).subscribe(() => {
                        this.userAuthenticationStatus = true;
                        this.userConnected = user;
                        this.authenticationStatusChangeSubject.next(this.userAuthenticationStatus);
                    },
                    (error: any) => {
                        this.onError(error);
                    });
                }
                else 
                {
                    this.userAuthenticationStatus = false;
                    this.userConnected = undefined;
                    this.authenticationStatusChangeSubject.next(this.userAuthenticationStatus);
                }
            });
    }

    logoff(): void
    {
        // call svr.

        // local
        this.storageMap.delete(
            authenticationKey
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
        
        return this.getAuthenticatedUser()
            .pipe<boolean>(
                map((auth: AuthenticationModel) => {
                    if (auth)
                    {
                        this.getUserByGuid(auth.guid)
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

    getUserConnected(): UserModel 
    {
        return this.userConnected;
    }

    getAllUsers(): Observable<UserModel[]>
    {
        return this.storageMap
            .get<UserModel[]>(
                usersKey,
                usersSchemaArr
            );
    }

    getUserByGuid(guid: string): Observable<UserModel>
    {
        return this.getAllUsers()
            .pipe<UserModel>(
                map((users :UserModel[]) => {
                    return users?.find(user => user.guid === guid);
                })
            );
    }

    getAuthenticatedUser(): Observable<AuthenticationModel>
    {
        return this.storageMap
            .get<AuthenticationModel>(
                authenticationKey,
                authenticationSchema
            );
    }
}