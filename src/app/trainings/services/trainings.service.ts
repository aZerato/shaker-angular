import { Injectable } from '@angular/core';

import { BaseService } from 'src/app/shared/services/base.service';
import { Training, trainingsKeyArr, trainingsSchemaArr } from '../models/training.model';
import { StorageMap } from '@ngx-pwa/local-storage';

@Injectable({
    providedIn: 'root'
})
export class TrainingService extends BaseService<Training>
{
    constructor(_storageMap: StorageMap) 
    {
        super(_storageMap, trainingsKeyArr, trainingsSchemaArr)
    }
    
    createBaseObject() {
        return new Training('Your training');
    }
}