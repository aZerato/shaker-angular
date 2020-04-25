import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

export const channelSchema:JSONSchema = {
    type: 'object',
    properties: {
        guid: { type: 'string' },
        name: { type: 'string' }
    },
    required: [
        'guid',
        'name'
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

    constructor(
        name: string) 
    {
        this.guid = Date.now().toString();
        this.name = name;
    }
}