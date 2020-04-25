import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

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

export class Channel {
    
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