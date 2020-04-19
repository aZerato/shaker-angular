import { formatDate } from '@angular/common';

import { UserChat } from './user-chat.model';

export class Message {
    guid: string;
    content: string;
    date: string;
    user: UserChat;
    isCurrentUser: boolean;
    status: string;

    constructor(content: string, user: UserChat, isCurrentUser: boolean, status: string) 
    {
        this.guid = Date.now().toString();
        this.content = content;
        this.user = user;
        this.isCurrentUser = isCurrentUser;
        this.date = formatDate(Date.now(), 'short', "en");
        this.status = status;
    }
}