import { IBaseEntity, BaseEntity } from 'src/app/shared/models/base-entity.model';

import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

export const metricTypeSchema:JSONSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' },
    },
    required: [
        'id',
        'name',
        'description'
    ]
};

export const metricTypesKeyArr:string = "MetricTypes";
export const metricTypesSchemaArr:JSONSchemaArray = {
    type: 'array',
    items: metricTypeSchema
};

export class MetricType extends BaseEntity implements IBaseEntity 
{
    name: string;
    description: string;
    
    constructor(
        name: string,
        description: string
    ) 
    {
        super();

        this.name = name;
        this.description = description;
    }
}