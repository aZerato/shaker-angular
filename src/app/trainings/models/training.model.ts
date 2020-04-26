import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

export const trainingSchema:JSONSchema = {
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

export const trainingsKeyArr:string = "Trainings";
export const trainingsSchemaArr:JSONSchemaArray = {
    type: 'array',
    items: trainingSchema
};

export class Training {
    
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