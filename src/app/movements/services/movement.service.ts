import { Injectable } from '@angular/core';

import { StorageMap } from '@ngx-pwa/local-storage';

import { movementsKeyArr, Movement, movementsSchemaArr } from '../models/movement.model';
import { BaseService } from 'src/app/shared/services/base.service';
import { Training } from 'src/app/trainings/models/training.model';

@Injectable({
    providedIn: 'root'
})
export class MovementService extends BaseService<Movement>
{
    constructor(storageMap: StorageMap) 
    { 
        super(storageMap, movementsKeyArr, movementsSchemaArr);
    }

    createBaseObject(): Training {
        return new Training('Your movement');
    }
}