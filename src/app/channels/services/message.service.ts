import { Injectable } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { StorageMap } from '@ngx-pwa/local-storage';

import { Message, messagesKeyArr, messagesSchemaArr } from '../models/message.model';
import { ChannelService } from './channel.service';
import { Channel } from '../models/channel.model';
import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { UserModel } from 'src/app/shared/models/user.model';
import { publish } from 'rxjs/operators';

const botGuid: string = 'bot';

class MessagesByChannel 
{
    channelGuid: string;
    storageMessagesObs: Observable<Message[]>;
    private _messages: Message[] = [];
    messageBehaviorSub: BehaviorSubject<Message[]> = new BehaviorSubject<Message[]>(this._messages);
    messageAddedSub: Subject<Message> = new Subject<Message>();

    constructor(
        channelGuid: string,
        storageMessagesObs: Observable<Message[]>)
        {
            this.channelGuid = channelGuid;

            this.storageMessagesObs = storageMessagesObs;
            
            this.storageMessagesObs
                .subscribe((messages: Message[]) => {
                    if (!messages) messages = [];
                    this._messages.push(...messages);
                    this.messageBehaviorSub = new BehaviorSubject<Message[]>(this._messages);
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

        this.channelService.getAllChannelsObs()
            .pipe(publish())
            .subscribe((channels: Channel[]) => 
            { 
                this.linkChannelsAndMessages(channels);
            });
    }

    private linkChannelsAndMessages(channels: Channel[]): void 
    {
        channels = channels ?? this.channelService.channelsBehaviorSub.getValue();
        const channelAddedSub = this.channelService.channelAddedSub;
        
        channels.forEach((channel: Channel) => {
            this.linkChannelAndMessages(channel);
        });

        channelAddedSub.subscribe((channel: Channel) => {
            this.addBotMessage(channel.guid, botGuid);
            this.linkChannelAndMessages(channel);
        });
    }

    private linkChannelAndMessages(channel: Channel): void
    {
        const messagesByChannel = new MessagesByChannel(
            channel.guid,
            this.getStorageMessagesChannelsObs(channel.guid));
        this._messagesByChannels.push(messagesByChannel);
    }

    private getStorageMessagesChannelsObs(channelGuid: string): Observable<Message[]>
    {
        return this.storageMap.get(
            `${messagesKeyArr}_${channelGuid}`,
            messagesSchemaArr);
    }

    private getMessagesByChannel(channelGuid: string): MessagesByChannel
    {
        if (this._messagesByChannels.length === 0) 
            this.linkChannelsAndMessages(undefined);

        return this._messagesByChannels
                    .find(mc => mc.channelGuid === channelGuid);
    }

    getMessagesByChannelObs(channelGuid: string): Observable<Message[]> 
    {
        return this.getMessagesByChannel(channelGuid)
                    .storageMessagesObs;
    }

    getMessagesByChannelBehaviorSub(channelGuid: string): BehaviorSubject<Message[]> 
    {
        return this.getMessagesByChannel(channelGuid)
                    .messageBehaviorSub;
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
        const behaviorSub = this.getMessagesByChannelBehaviorSub(channelGuid);
        const messages = behaviorSub.getValue();
        const message = new Message(
            content, 
            channelGuid, 
            userGuid);

        messages.push(message);

        this.storageMap.set(
            `${messagesKeyArr}_${channelGuid}`,
            messages,
            messagesSchemaArr)
            .subscribe(() => {
                behaviorSub.next(messages);
            });
    }
}