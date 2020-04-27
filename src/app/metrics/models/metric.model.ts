import { IBaseEntity, BaseEntity } from 'src/app/shared/models/base-entity.model';

import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

export const metricSchema:JSONSchema = {
    type: 'object',
    properties: {
        guid: { type: 'string' },
        typeGuid: { type: 'string' },
        value: { type: 'string' },
        calendarGuid: { type: 'string' }
    },
    required: [
        'guid',
        'typeGuid',
        'value',
        'calendarGuid'
    ]
};

export const metricsKeyArr:string = "MetricTypes";
export const metricsSchemaArr:JSONSchemaArray = {
    type: 'array',
    items: metricSchema
};

export class Metric extends BaseEntity implements IBaseEntity 
{
    typeGuid: string;
    description: string;
    value: string;
    calendarGuid: string;

    constructor(
        typeGuid: string,
        description: string,
        value: string,
        calendarGuid: string
    ) 
    {
        super();

        this.typeGuid = typeGuid;
        this.description = description;
        this.value = value;
        this.calendarGuid = calendarGuid;
    }
}