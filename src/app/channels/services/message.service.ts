import { Injectable } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageMap } from '@ngx-pwa/local-storage';

import { Message, messagesKeyArr, messagesSchemaArr } from '../models/message.model';
import { ChannelService } from './channel.service';
import { Channel } from '../models/channel.model';
import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { UserModel } from 'src/app/shared/models/user.model';

const botGuid: string = 'bot';

class MessagesByChannel 
{
    channelGuid: string;
    messageAddedSub: Subject<Message> = new Subject<Message>();
    messagesStorageObs: Observable<Message[]>;
    messages: Message[] = [];
    messagesBehaviorSub: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>(this.messages);

    constructor(
        channelGuid: string,
        messagesStorageObs: Observable<Message[]>)
        {
            this.channelGuid = channelGuid;
            
            this.messagesStorageObs = 
                messagesStorageObs
                .pipe<Message[]>(map((msgs: Message[]) => {
                    if(!msgs) msgs = [];
                    this.messages = msgs;
                    this.messagesBehaviorSub = new BehaviorSubject<Message[]>(this.messages);
                    return this.messages;
                }));

            this.messageAddedSub.subscribe((msg: Message) => {
                this.messages.push(msg);            
                this.messagesBehaviorSub.next(this.messages);
            });
        }
}

@Injectable({
    providedIn: 'root'
})
export class MessageService
{
    private _messagesByChannels: MessagesByChannel[] = [];
    private _user: UserModel;

    constructor(private storageMap: StorageMap,
        private channelService: ChannelService,
        private authenticationService: AuthenticationService) 
    {
        this._user = this.authenticationService.getUserConnected();
        this.linkChannelsAndMessages();
    }

    private linkChannelsAndMessages(): void 
    {
        this.channelService.channelsBehaviorSub
            .subscribe((channels: Channel[]) => 
            {
                channels.forEach((channel: Channel) => {
                    this.linkChannelAndMessages(channel);
                });
            });

        const channelAddedSub = this.channelService.channelAddedSub;
            
        channelAddedSub.subscribe((channel: Channel) => {
            this.linkChannelAndMessages(channel);
            this.addBotMessage(channel.guid, botGuid);
        });
    }

    private linkChannelAndMessages(channel: Channel): void
    {
        const messagesByChannel = new MessagesByChannel(
            channel.guid,
            this.getStorageMessagesChannelsObs(channel.guid));
        this._messagesByChannels.push(messagesByChannel);
    }

    getStorageMessagesChannelsObs(channelGuid: string): Observable<Message[]>
    {
        return this.storageMap.get(
            `${messagesKeyArr}_${channelGuid}`,
            messagesSchemaArr);
    }

    private getMessagesByChannel(channelGuid: string): MessagesByChannel
    {
        return this._messagesByChannels
                    .find(mc => mc.channelGuid === channelGuid);
    }

    addUserMessage(channelGuid: string, content: string): void 
    {
        this.addMessage(channelGuid, this._user.guid, content);
    }

    private addBotMessage(channelGuid: string, content: string): void 
    {
        this.addMessage(channelGuid, botGuid, content);
    }

    private addMessage(channelGuid: string, userGuid: string, content: string): void 
    {
        const msgsByChannel = this.getMessagesByChannel(channelGuid);
        const message = new Message(
            content, 
            channelGuid, 
            userGuid);

        msgsByChannel.messages.push(message);

        this.storageMap.set(
            `${messagesKeyArr}_${channelGuid}`,
            msgsByChannel.messages,
            messagesSchemaArr)
            .subscribe(() => {
                msgsByChannel.messageAddedSub.next(message);
            });
    }
}