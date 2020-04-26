import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageMap } from '@ngx-pwa/local-storage';

import { movementsKeyArr, Movement, movementsSchemaArr } from '../models/movement.model';

@Injectable({
    providedIn: 'root'
})
export class MovementService
{
    private _movements: Movement[];
    private _movementsStorageMap: Observable<Movement[]>;
    movementAddedSub: Subject<Movement> = new Subject<Movement>();

    constructor(private _storageMap: StorageMap) 
    { 
        this._movementsStorageMap = this._storageMap
            .get<Movement[]>(movementsKeyArr, movementsSchemaArr)
            .pipe<Movement[]>(map((movements: Movement[]) => {
                if (!movements) movements = [];
                this._movements = movements;
                return this._movements;
            }));
    }

    getAllMovementsObs() : Observable<Movement[]> {
        return this._movementsStorageMap;
    }

    getMovementByGuid(guid: string): Observable<Movement> {
        return this._movementsStorageMap
            .pipe<Movement>(
                map((movements: Movement[]) => {
                    if (!movements) return;

                    const movement = movements.find(mv => mv.guid === guid);

                    return movement;
                })
            );
    }

    addMovement(): void 
    {
        const init = this._movements;
            
        if (init)
        {
            this.saveMovement(this._movements);
            return;
        }
        
        this.getAllMovementsObs()
            .subscribe((movements: Movement[]) => 
        {
            this.saveMovement(movements);
        });
    }

    private saveMovement(movements: Movement[]): void
    {
        const movement = new Movement(
            'Your movement'
        );

        movements.push(movement);

        this._storageMap.set(
            movementsKeyArr,
            movements,
            movementsSchemaArr)
            .subscribe(() => {
                this.movementAddedSub.next(movement);
            });
    }
}