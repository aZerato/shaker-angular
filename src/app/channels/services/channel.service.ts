import { Injectable } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageMap } from '@ngx-pwa/local-storage';

import { Channel, channelsKeyArr, channelsSchemaArr } from '../models/channel.model';
import { UserChat } from '../models/user-chat.model';
import { Message, messagesKeyArr, messagesSchemaArr } from '../models/message.model';
import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { UserModel } from 'src/app/shared/models/user.model';

@Injectable({
 providedIn: 'root'
})
export class ChannelService
{
    constructor(private storageMap: StorageMap,
        private authicationService: AuthenticationService) { }

    private getCurrentUser(): UserChat {
        const user = this.authicationService.getUserConnected();
        return new UserChat(user);
    }

    getAllChannels(): Observable<Channel[]> {
        return this.storageMap
            .get<Channel[]>(channelsKeyArr, channelsSchemaArr);
    }

    getChannelByGuid(guid: string): Observable<Channel> {
        return this.getAllChannels()
            .pipe<Channel>(
                map((channels: Channel[]) => {
                    const channel = channels.find(ch => ch.guid === guid);

                    Channel.prepareGet(channel);
                    channel.messages$ = this.getMessagesOfChannel(guid);
                    
                    return channel;
                })
            );
    }

    getMessagesOfChannel(channelGuid: string): Observable<Message[]> 
    {
        const user:UserChat = this.getCurrentUser();

        return this.getAllMessages(channelGuid)
            .pipe<Message[]>(
                map((messages: Message[]) => {
                    
                    let msgs = messages?.filter(msg => msg.channelGuid === channelGuid);
                    
                    if (!msgs) {
                        return [];
                    }

                    msgs.forEach(msg => {
                        msg.isCurrentUser = user.guid === msg.userGuid; 
                        msg.userChat$ = this.getUserChat(msg.userGuid);
                    });

                    return msgs;
                })
            );
    }

    getUserChat(userGuid: string): Observable<UserChat> 
    {
        if (userGuid === this.botGuid) return this.botUserChat();

        return this.authicationService
            .getUserByGuid(userGuid)
            .pipe<UserChat>(
                map((user: UserModel) => {
                    return new UserChat(user);
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

    channelAdded: Subject<Channel> = new Subject<Channel>();
    addChannel(): void 
    {
        const channel = new Channel(
            'Conversation',
            [this.getCurrentUser()]
        );
        
        this.addDefaultBotMessage(channel.guid);

        this.getAllChannels()
            .subscribe((channels: Channel[]) => 
                {
                    const channelSave = channel.prepareSave(channel);
                    
                    if (!channels) channels = []; 
                    channels.push(channelSave);

                    this.storageMap.set(
                        channelsKeyArr,
                        channels,
                        channelsSchemaArr)
                        .subscribe(() => {
                            this.channelAdded.next(channel);
                        });
                });
    }

    messageAdded: Subject<Message[]> = new Subject<Message[]>();
    addMessage(channelGuid: string, content: string): void {
        const user = this.getCurrentUser();
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
                            msg.userChat$ = this.getUserChat(msg.userGuid);
                        });
                        this.messageAdded.next(messages);
                    });
            });
    }

    private addDefaultBotMessage(channelGuid: string): void 
    {
        const message = new Message("Hello",
                        channelGuid, 
                        'bot',
                        false,
                        '');
        message.userChat$ = this.botUserChat();
        
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

    private botGuid = "bot";
    private userBot = new UserModel(
        "Bot", 
        "Bot",
        "password",
        "Botty", 
        "/assets/img/bot-avatar.png")
        .setGuid(this.botGuid);

    private userChatBot:UserChat = new UserChat(this.userBot);

    private botUserChat(): Observable<UserChat> {
        return of(this.userChatBot);
    }
}