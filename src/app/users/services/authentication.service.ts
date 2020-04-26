import { Injectable } from '@angular/core';

import { Observable, Subject, of, BehaviorSubject, concat, throwError } from 'rxjs';
import { map, flatMap, take } from 'rxjs/operators';

import { StorageMap } from '@ngx-pwa/local-storage';

import { AuthenticationModel, authenticationKey, authenticationSchema } from '../models/authentication.model';
import { UserModel, usersSchemaArr, usersKey } from '../../shared/models/user.model';
import { CreationModel } from '../models/creation.model';

export const botGuid: string = 'bot';
export const botUserModel: UserModel = new UserModel('bot', '', '', '', './assets/img/bot-avatar.png');

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
            .pipe(map((user: UserModel) => { 
                this._userConnected = user;
                this.userConnectedBehaviorSub = new BehaviorSubject<UserModel>(this._userConnected);
            }));

        this._usersObs = 
            this.storageMap.get<UserModel[]>(
                usersKey,
                usersSchemaArr);

        this._usersObs
            .pipe(map((users: UserModel[]) => {
                if (!users) users = [];
                this._users.push(...users);
                this.usersBehaviorSub = new BehaviorSubject<UserModel[]>(this._users);
            }));
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
        this._usersObs
        .subscribe((users: UserModel[]) => 
        {
            const user = new UserModel(create.name, create.email, create.password);
        
            const userDatabase = users?.find(ub => ub.email === user.email);
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
        });
    }

    login(auth: AuthenticationModel): void
    {
        this._usersObs
            .subscribe((users: UserModel[]) => {
                const user = users?.find(ub => ub.email === auth.email && ub.password === auth.password);
                
                if (!user)
                {
                    this.onError(null, '404: User not found !');
                    return;
                }

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
        return this.getUserConnected()
            .pipe<boolean>(
                map((user: UserModel) => 
                {
                    if (user)
                    {
                        return true;
                    }
                    else 
                    {
                        return false;
                    }
                }));
    }

    getUserConnected(): Observable<UserModel> 
    {
        if (this._userConnected)
        {
            return of(this._userConnected);
        }
        
        return this.getAuthenticatedUser()
            .pipe<UserModel>(
                flatMap((auth: AuthenticationModel) => 
                {
                    if (!auth)
                        return of(null);

                    return this.getUserByGuid(auth.guid)
                                .pipe<UserModel>(
                                    map((userConnected: UserModel) => 
                                    {
                                        this.authenticationStatusChangeSubject.next(true);
                                        return this._userConnected = userConnected;
                                    }));
                }));
    }

    getUserByGuid(guid: string): Observable<UserModel>
    {
        if (guid === botGuid)
        {
            return of(botUserModel);
        }

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