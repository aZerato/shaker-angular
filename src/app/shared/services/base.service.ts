import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageMap, JSONSchemaArray } from '@ngx-pwa/local-storage';

export abstract class BaseService<T>
{
    private _storageMap: StorageMap;
    private _localEntities: T[];
    private _entitiesStorageMap: Observable<any>; // any = T[]
    entityAddedSub: Subject<T> = new Subject<T>();

    private _entitiesKeyArr: string;
    private _entitiesSchemaArr: JSONSchemaArray;

    constructor(
        storageMap: StorageMap,
        entitiesKeyArr:string, 
        entitiesSchemaArr: JSONSchemaArray) 
    {
        this._storageMap = storageMap;
        this._entitiesKeyArr = entitiesKeyArr;
        this._entitiesSchemaArr = entitiesSchemaArr;

        this._entitiesStorageMap = this._storageMap
            .get<any>(this._entitiesKeyArr, this._entitiesSchemaArr)
            .pipe<any>(map((entities: any) => {
                if (!entities) entities = [];
                this._localEntities = entities;
                return this._localEntities;
            }));
    }

    getAllEntitiesObs<T>() : Observable<T[]> {
        return this._entitiesStorageMap;
    }

    getEntityByGuid<T>(guid: string): Observable<T> {
        return this._entitiesStorageMap
            .pipe<T>(
                map((entities: T[]) => {
                    if (!entities) return;

                    const entity = entities.find(en => en['guid'] === guid);

                    return entity;
                })
            );
    }

    addEntity<T>(): void 
    {
        const init = this._localEntities;
            
        if (init)
        {
            this.saveEntity(this._localEntities);
            return;
        }
        
        this.getAllEntitiesObs<T>()
            .subscribe((entities: T[]) => 
        {
            this.saveEntity(entities);
        });
    }

    private saveEntity<T>(entities: T[]): void
    {
        const entity = this.createBaseObject();

        entities.push(entity);

        this._storageMap.set(
            this._entitiesKeyArr,
            entities,
            this._entitiesSchemaArr)
            .subscribe(() => {
                this.entityAddedSub.next(entity);
            });
    }

    abstract createBaseObject();
}