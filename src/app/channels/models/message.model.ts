import { formatDate } from '@angular/common';

import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

export const messageSchema:JSONSchema = {
    type: 'object',
    properties: {
        guid: { type: 'string' },
        channelGuid: { type: 'string' },
        
        userGuid: { type: 'string' },
        
        content: { type: 'string' },
        date: { type: 'string' }
    },
    required: [
        'guid',
        'channelGuid',
        'userGuid',
        'content',
        'date'
    ]
};

export const messagesKeyArr:string = "Messages";
export const messagesSchemaArr:JSONSchemaArray = {
    type: 'array',
    items: messageSchema
};

export class Message 
{
    guid: string;
    channelGuid: string;
    
    userGuid: string;
    
    content: string;
    date: string;

    constructor(
        content: string, 
        channelGuid: string, 
        userGuid: string) 
    {
        this.guid = Date.now().toString();
        this.channelGuid = channelGuid;

        this.userGuid = userGuid;

        this.date = formatDate(Date.now(), 'short', "en");
        this.content = content;
    }
}