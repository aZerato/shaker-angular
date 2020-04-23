import { formatDate } from '@angular/common';

import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

import { UserChat } from './user-chat.model';
import { Room } from './room.model';
import { Observable } from 'rxjs';

export const messageSchema:JSONSchema = {
    type: 'object',
    properties: {
        guid: { type: 'string' },
        roomGuid: { type: 'string' },
        
        userGuid: { type: 'string' },
        
        content: { type: 'string' },
        date: { type: 'string' },
        status: { type: 'string' },
    },
    required: [
        'guid',
        'roomGuid',
        'userGuid',
        'content',
        'date',
        'status'
    ]
};

export const messagesKeyArr:string = "Messages";
export const messagesSchemaArr:JSONSchemaArray = {
    type: 'array',
    items: messageSchema
};

export const roomKeyArr:string = "Rooms";

export class Message 
{
    guid: string;
    roomGuid: string;
    
    userChat$: Observable<UserChat>;
    userGuid: string;
    isCurrentUser: boolean;
    
    content: string;
    date: string;
    status: string;

    constructor(content: string, roomGuid: string, userGuid: string, isCurrentUser: boolean, status: string) 
    {
        this.guid = Date.now().toString();
        this.roomGuid = roomGuid;

        this.userGuid = userGuid;
        this.isCurrentUser = isCurrentUser;

        this.date = formatDate(Date.now(), 'short', "en");
        this.content = content;
        this.status = status;
    }

    prepareSave(message: Message): Message
    {
        const messageSave = Object.assign({}, message);

        delete messageSave.userChat$;
        delete messageSave.isCurrentUser;

        return messageSave;
    }

    static prepareGet(message: Message): void
    {
        message.userChat$ = new Observable<UserChat>();
    }
}