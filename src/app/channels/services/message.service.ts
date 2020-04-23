import { Injectable } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageMap } from '@ngx-pwa/local-storage';

import { UserChat } from '../models/user-chat.model';
import { Message, messagesKeyArr, messagesSchemaArr } from '../models/message.model';
import { UserChatService } from './user-chat.service';

@Injectable({
 providedIn: 'root'
})
export class MessageService
{
    constructor(private storageMap: StorageMap,
        private userChatService: UserChatService) { }

    getMessagesOfChannel(channelGuid: string): Observable<Message[]> 
    {
        const user:UserChat = this.userChatService.getCurrentUser();

        return this.getAllMessages(channelGuid)
            .pipe<Message[]>(
                map((messages: Message[]) => {
                    
                    let msgs = messages?.filter(msg => msg.channelGuid === channelGuid);
                    
                    if (!msgs) {
                        return [];
                    }

                    msgs.forEach(msg => {
                        msg.isCurrentUser = user.guid === msg.userGuid; 
                        msg.userChat$ = this.userChatService.getUserChat(msg.userGuid);
                    });

                    return msgs;
                })
            );
    }

    getAllMessages(channelGuid: string): Observable<Message[]> 
    {
        return this.storageMap
            .get<Message[]>(
                `${messagesKeyArr}_${channelGuid}`,
                messagesSchemaArr
            ).pipe<Message[]>(
                map((messages: Message[]) => {
                    return messages?.filter(msg => msg.channelGuid === channelGuid);
                })
            );
    }

    messageAdded: Subject<Message[]> = new Subject<Message[]>();
    addMessage(channelGuid: string, content: string): void {
        const user = this.userChatService.getCurrentUser();
        const message = new Message(content, channelGuid, user.guid, true, 'ok');

        this.getAllMessages(channelGuid)
            .subscribe((messages: Message[]) => 
            {
                const msgSave = message.prepareSave(message);
                if (!messages) messages = [];
                messages.push(msgSave);
                this.storageMap.set(
                    `${messagesKeyArr}_${channelGuid}`,
                    messages,
                    messagesSchemaArr)
                    .subscribe(() => {
                        messages.forEach(msg => {
                            msg.isCurrentUser = user.guid === msg.userGuid; 
                            msg.userChat$ = this.userChatService.getUserChat(msg.userGuid);
                        });
                        this.messageAdded.next(messages);
                    });
            });
    }

    addDefaultBotMessage(channelGuid: string): void 
    {
        const message = new Message("Hello",
                        channelGuid, 
                        'bot',
                        false,
                        '');
        message.userChat$ = this.userChatService.botUserChat;
        
        this.getAllMessages(channelGuid)
        .subscribe((messages: Message[]) => 
        {
            const msgSave = message.prepareSave(message);
            messages = [];
            messages.push(msgSave);
            this.storageMap.set(
                `${messagesKeyArr}_${channelGuid}`,
                messages,
                messagesSchemaArr)
                .subscribe(() => {
                    this.messageAdded.next(messages);
                });
        });
    }
}