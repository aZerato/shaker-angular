import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

import { BaseEntity, IBaseEntity } from 'src/app/shared/models/base-entity.model';

export const movementSchema:JSONSchema = {
    type: 'object',
    properties: {
        guid: { type: 'string' },
        name: { type: 'string' },
        imgPath: { type: 'string' }
    },
    required: [
        'guid',
        'name',
        'imgPath'
    ]
};

export const movementsKeyArr:string = "Movements";
export const movementsSchemaArr:JSONSchemaArray = {
    type: 'array',
    items: movementSchema
};

export class Movement extends BaseEntity implements IBaseEntity
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