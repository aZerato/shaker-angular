import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageMap } from '@ngx-pwa/local-storage';

import { Message, messagesKeyArr, messagesSchemaArr } from '../models/message.model';
import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { UserModel } from 'src/app/shared/models/user.model';

class MessagesByChannel 
{
    channelGuid: string;
    messageAddedSub: Subject<Message> = new Subject<Message>();
    messages: Message[] = [];

    constructor(
        channelGuid: string,
        messages: Message[])
        {
            this.channelGuid = channelGuid;
            this.messages = messages;
        }
}

@Injectable({
    providedIn: 'root'
})
export class MessageService
{
    private _messagesByChannels: MessagesByChannel[] = [];
    private _userObs: Observable<UserModel>;

    constructor(private storageMap: StorageMap,
        private authenticationService: AuthenticationService) 
    {
        this._userObs = this.authenticationService.getUserConnected();
    }

    private linkChannelAndMessages(channelGuid: string, messages: Message[]): void
    {
        if (this._messagesByChannels.find(mc => mc.channelGuid == channelGuid)) 
            return;

        const messagesByChannel = new MessagesByChannel(
            channelGuid,
            messages);
            
        this._messagesByChannels.push(messagesByChannel);
    }

    getStorageMessagesChannelsObs(channelGuid: string): Observable<Message[]>
    {
        return this.storageMap.get(
            `${messagesKeyArr}_${channelGuid}`,
            messagesSchemaArr)
            .pipe<Message[]>(
                map((messages: Message[]) => {
                    if (!messages) messages = [];
                    this.linkChannelAndMessages(channelGuid, messages);
                    return messages;
                }));
    }

    private getMessagesByChannel(channelGuid: string): MessagesByChannel
    {
        return this._messagesByChannels
                    .find(mc => mc.channelGuid === channelGuid);
    }

    getMessageAddedSub(channelGuid: string): Subject<Message>
    {
        return this.getMessagesByChannel(channelGuid).messageAddedSub;
    }

    addUserMessage(channelGuid: string, content: string): void 
    {
        this._userObs.subscribe((user: UserModel) => {
            this.addMessage(channelGuid, user.guid, content);
        });
    }

    addBotMessage(channelGuid: string, content: string): void 
    {
        this.addMessage(channelGuid, botGuid, content);
    }

    addMessage(channelGuid: string, userGuid: string, content: string): void 
    {
        const msgsByChannelInit = this.getMessagesByChannel(channelGuid);
            
        if (msgsByChannelInit)
        {
            this.saveMessage(msgsByChannelInit.messages, channelGuid, userGuid, content);
            return;
        }
        
        this.getStorageMessagesChannelsObs(channelGuid)
            .subscribe((messages: Message[]) => 
        {
            this.saveMessage(messages, channelGuid, userGuid, content);
        });
    }

    private saveMessage(messages: Message[], channelGuid: string, userGuid: string, content: string): void {
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
                const msgsByChannel = this.getMessagesByChannel(channelGuid);
                msgsByChannel.messageAddedSub.next(message);
            });
    }
}