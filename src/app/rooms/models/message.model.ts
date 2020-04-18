import { UserChat } from './user-chat.model';

export class Message {
    guid: string;
    content: string;
    date: number;
    user: UserChat;
    isCurrentUser: boolean;
    status: string;

    constructor(content: string, user: UserChat, isCurrentUser: boolean, status: string) 
    {
        this.guid = Date.now().toString();
        this.content = content;
        this.user = user;
        this.isCurrentUser = isCurrentUser;
        this.date = Date.now();
        this.status = status;
    }
}