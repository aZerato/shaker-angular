import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

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

export class Movement {
    
    guid: string;
    name: string;
    imgPath: string;

    constructor(name: string) 
    {
        this.guid = Date.now().toString();
        this.name = name;
        this.imgPath = "./assets/img/bot-avatar.png";
    }
}