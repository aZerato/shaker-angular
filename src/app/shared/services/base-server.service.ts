import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import { IBaseEntity } from '../models/base-entity.model';

/// BaseService for use localstorage.
export abstract class BaseServerService<TBaseEntity extends IBaseEntity>
{
    entityAddedSub: Subject<TBaseEntity> = new Subject<TBaseEntity>();

    constructor(
        protected _httpClient: HttpClient,
        protected _apiUrl:string) 
    { }

    getAllEntitiesObs() : Observable<TBaseEntity[]> {
        return this._httpClient
                .get<TBaseEntity[]>(this._apiUrl);
    }

    getEntityByGuid(id: number): Observable<TBaseEntity> {
        return this._httpClient
                .get<TBaseEntity>(this._apiUrl, 
                {
                        params: { id: id.toString() }
                });
    }

    addEntity(entity: TBaseEntity): void 
    {
        this._httpClient
                .post<TBaseEntity>(this._apiUrl, 
                {
                        body: entity
                });
    }
}