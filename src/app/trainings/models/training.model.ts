import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

import { BaseEntity, IBaseEntity } from 'src/app/shared/models/base-entity.model';

export const trainingSchema:JSONSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        imgPath: { type: 'string' }
    },
    required: [
        'id',
        'name',
        'imgPath'
    ]
};

export const trainingsKeyArr:string = "Trainings";
export const trainingsSchemaArr:JSONSchemaArray = {
    type: 'array',
    items: trainingSchema
};

export class Training extends BaseEntity implements IBaseEntity
{
    name: string;
    imgPath: string;

    constructor(name: string) 
    {
        super();
        
        this.name = name;
        this.imgPath = "./assets/img/bot-avatar.png";
    }
}