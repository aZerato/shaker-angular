import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

import { BaseEntity, IBaseEntity } from 'src/app/shared/models/base-entity.model';

export const channelSchema:JSONSchema = {
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

export const channelsKeyArr:string = "Channels";
export const channelsSchemaArr:JSONSchemaArray = {
    type: 'array',
    items: channelSchema
};

export class Channel extends BaseEntity implements IBaseEntity 
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