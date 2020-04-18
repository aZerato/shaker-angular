import { UserChat } from './user-chat.model';
import { Message } from './message.model';

export class Room {
    guid: string;
    name: string;
    users: UserChat[];
    messages: Message[];
    surname: string;

    constructor(guid: string, 
        name: string, 
        users: UserChat[], 
        messages: Message[], 
        surname: string) 
    {
        this.guid = guid;
        this.name = name;
        this.users = users;
        this.surname = surname;
        this.messages = messages;
    }
}