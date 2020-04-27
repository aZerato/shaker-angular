import { Injectable } from '@angular/core';

import { StorageMap } from '@ngx-pwa/local-storage';

import { BaseService } from 'src/app/shared/services/base.service';

import { MetricType, metricTypesKeyArr, metricTypesSchemaArr } from '../models/metric-type.model';

@Injectable({
    providedIn: 'root'
})
export class MetricTypeService extends BaseService<MetricType>
{
    constructor(
        storageMap: StorageMap) 
    { 
        super(storageMap, metricTypesKeyArr, metricTypesSchemaArr);
    }

    createBaseObject() {
        return new MetricType(`Name ${Date.now()}`, 'Description');
    }
}