import { Injectable } from '@angular/core';

import { Observable, Subject, of, BehaviorSubject } from 'rxjs';
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

    private _userConnectedObs: Observable<UserModel>;
    userConnectedBehaviorSub: BehaviorSubject<UserModel>
    private _userConnected: UserModel;

    private _usersObs: Observable<UserModel[]>;
    usersBehaviorSub: BehaviorSubject<UserModel[]>
    private _users: UserModel[] = [];

    constructor(private storageMap: StorageMap) 
    { 
        this._userConnectedObs = 
            this.storageMap.get<UserModel>(
                authenticationKey,
                authenticationSchema);

        this._userConnectedObs
            .subscribe((user: UserModel) => {
                
                this._userConnected = user;
                this.userConnectedBehaviorSub = new BehaviorSubject<UserModel>(this._userConnected);
            });

        this._usersObs = 
            this.storageMap.get<UserModel[]>(
                usersKey,
                usersSchemaArr);

        this._usersObs
            .subscribe((users: UserModel[]) => {
                if (!users) users = [];
                this._users.push(...users);
                this.usersBehaviorSub = new BehaviorSubject<UserModel[]>(this._users);
            });
    }

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

        const userDatabase = this._users?.find(ub => ub.email === user.email);
        if (userDatabase) 
        {
            this.onError(null, 'This user already exist !');
        }
        else 
        {
            this._users.push(user);

            this.storageMap.set(
                usersKey,
                this._users,
                usersSchemaArr
            ).subscribe(() => {
                
                const auth = new AuthenticationModel(user, false);
                auth.prepareSave();
                this.storageMap.set(
                    authenticationKey,
                    auth,
                    authenticationSchema
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
    }

    login(auth: AuthenticationModel): void
    {
        const user = this._users?.find(ub => ub.email == auth.email && ub.password == auth.password);    
        if (user) 
        {
            const auth = new AuthenticationModel(user, false);
            auth.prepareSave();
            this.storageMap.set(
                authenticationKey,
                auth,
                authenticationSchema
            ).subscribe(() => {
                this._userConnected = user;
                this.authenticationStatusChangeSubject.next(true);
            },
            (error: any) => {
                this.onError(error);
            });
        }
        else 
        {
            this._userConnected = undefined;
            this.authenticationStatusChangeSubject.next(false);
        }
    }

    logoff(): void
    {
        this.storageMap.delete(
            authenticationKey
        ).subscribe(() => {
            this._userConnected = undefined;
            this.authenticationStatusChangeSubject.next(false);
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
                                this._userConnected = user;
                                this.authenticationStatusChangeSubject.next(true);
                            });

                        return true;
                    }
                    return false;
                })
            );
    }

    getUserConnected(): UserModel 
    {
        return this._userConnected;
    }

    getUserByGuid(guid: string): Observable<UserModel>
    {
        return this._usersObs
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