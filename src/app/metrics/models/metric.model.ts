import { IBaseEntity, BaseEntity } from 'src/app/shared/models/base-entity.model';

import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

export const metricSchema:JSONSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        typeId: { type: 'string' },
        value: { type: 'string' },
        calendarId: { type: 'string' }
    },
    required: [
        'id',
        'typeId',
        'value',
        'calendarId'
    ]
};

export const metricsKeyArr:string = "MetricTypes";
export const metricsSchemaArr:JSONSchemaArray = {
    type: 'array',
    items: metricSchema
};

export class Metric extends BaseEntity implements IBaseEntity 
{
    typeId: number;
    description: string;
    value: string;
    calendarId: number;

    constructor(
        typeId: number,
        description: string,
        value: string,
        calendarId: number
    ) 
    {
        super();

        this.typeId = typeId;
        this.description = description;
        this.value = value;
        this.calendarId = calendarId;
    }
}