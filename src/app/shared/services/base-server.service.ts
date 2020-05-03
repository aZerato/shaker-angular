import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import { IBaseEntity } from '../models/base-entity.model';

/// BaseService for use rest api.
export abstract class BaseServerService<TBaseEntity extends IBaseEntity>
{
    entityAddedSub: Subject<TBaseEntity> = new Subject<TBaseEntity>();
    entityUpdatedSub: Subject<TBaseEntity> = new Subject<TBaseEntity>();
    entityDeletedSub: Subject<boolean> = new Subject<boolean>();
    
    constructor(
        protected _httpClient: HttpClient,
        protected _apiUrl:string) 
    { }

    getAllEntitiesObs() : Observable<TBaseEntity[]> {
        return this._httpClient
                .get<TBaseEntity[]>(this._apiUrl);
    }

    getEntityById(id: string): Observable<TBaseEntity> {
        return this._httpClient
                .get<TBaseEntity>(`${this._apiUrl}/${id}`);
    }

    addEntity(entity: TBaseEntity): void
    {
        this._httpClient
                .post<TBaseEntity>(this._apiUrl, entity)
                .subscribe((entityUpdated: TBaseEntity) => {
                    this.entityAddedSub.next(entityUpdated);
                });
        
    }

    updateEntity(entity: TBaseEntity): void
    {
        this._httpClient
                .put<TBaseEntity>(`${this._apiUrl}/${entity.id}`, entity)
                .subscribe((entityUpdated: TBaseEntity) => {
                    this.entityUpdatedSub.next(entityUpdated);
                });
        
    }

    deleteEntity(entity: TBaseEntity): void
    {
        this._httpClient
                .delete<boolean>(`${this._apiUrl}/${entity.id}`)
                .subscribe((result: boolean) => {
                    this.entityDeletedSub.next(result);
                });
        
    }
}