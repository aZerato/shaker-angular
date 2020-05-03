import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageMap, JSONSchemaArray } from '@ngx-pwa/local-storage';

import { IBaseEntity } from '../models/base-entity.model';

/// BaseService for use localstorage.
export abstract class BaseService<TBaseEntity extends IBaseEntity>
{
    private _storageMap: StorageMap;
    private _localEntities: TBaseEntity[];
    private _entitiesStorageMap: Observable<TBaseEntity[]>;
    entityAddedSub: Subject<TBaseEntity> = new Subject<TBaseEntity>();

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
            .get<TBaseEntity[]>(this._entitiesKeyArr, this._entitiesSchemaArr)
            .pipe<TBaseEntity[]>(
                map((entities: TBaseEntity[]) => {
                    if (!entities) entities = [];
                    this._localEntities = entities;
                    return this._localEntities;
                }));
    }

    getAllEntitiesObs() : Observable<TBaseEntity[]> {
        return this._entitiesStorageMap;
    }

    getEntityById(id: string): Observable<TBaseEntity> {
        return this._entitiesStorageMap
            .pipe<TBaseEntity>(
                map((entities: TBaseEntity[]) => {
                    if (!entities) return;

                    const entity = entities.find(en => en.id === id);

                    return entity;
                })
            );
    }

    addEntity(): void 
    {
        const init = this._localEntities;
            
        if (init)
        {
            this.saveEntity(this._localEntities);
            return;
        }
        
        this.getAllEntitiesObs()
            .subscribe((entities: TBaseEntity[]) => 
        {
            this.saveEntity(entities);
        });
    }

    private saveEntity(entities: TBaseEntity[]): void
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