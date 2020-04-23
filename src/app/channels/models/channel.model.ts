import { UserChat } from './user-chat.model';
import { Message } from './message.model';

import { Observable } from 'rxjs';

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
    users: UserChat[];
    messages$: Observable<Message[]>;

    constructor(
        name: string, 
        users: UserChat[]) 
    {
        this.guid = Date.now().toString();
        this.name = name;
        this.users = users;
        this.messages$ = new Observable<Message[]>();
    }

    prepareSave(channel: Channel): Channel
    {
        const channelSave = Object.assign({}, channel);

        delete channelSave.messages$;
        delete channelSave.users;
        
        return channelSave;
    }

    static prepareGet(channel: Channel) {

        channel.messages$ = new Observable<Message[]>();
    }
}