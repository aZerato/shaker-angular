import { Injectable } from '@angular/core';

import { StorageMap } from '@ngx-pwa/local-storage';

import { BaseService } from 'src/app/shared/services/base.service';
import { CalendarService } from 'src/app/planning/services/calendar.service';

import { Metric, metricsKeyArr, metricsSchemaArr } from '../models/metric.model';
import { MetricTypeService } from './metric-type.service';

@Injectable({
    providedIn: 'root'
})
export class MetricService extends BaseService<Metric>
{
    constructor(
        storageMap: StorageMap,
        metricTypeService: MetricTypeService,
        calendarService: CalendarService) 
    { 
        super(storageMap, metricsKeyArr, metricsSchemaArr);

        this.onMetricAdded();
    }

    createBaseObject() {
        return new Metric('', 'Description', 'Value', '');
    }

    private onMetricAdded(): void 
    {
        this.entityAddedSub.subscribe((metric: Metric) => {
            
        });
    }
}