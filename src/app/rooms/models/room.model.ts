import { UserChat } from './user-chat.model';
import { Message } from './message.model';

import { Observable } from 'rxjs';

import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

export const roomSchema:JSONSchema = {
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

export const roomsKeyArr:string = "Rooms";
export const roomsSchemaArr:JSONSchemaArray = {
    type: 'array',
    items: roomSchema
};

export class Room {
    
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

    prepareSave(room: Room): Room
    {
        const roomSave = Object.assign({}, room);

        delete roomSave.messages$;
        delete roomSave.users;
        
        return roomSave;
    }

    static prepareGet(room: Room) {

        room.messages$ = new Observable<Message[]>();
    }
}