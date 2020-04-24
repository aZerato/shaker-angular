import { Injectable, OnInit } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageMap } from '@ngx-pwa/local-storage';

import { MessageService } from './message.service';
import { UserChatService } from './user-chat.service';

import { Channel, channelsKeyArr, channelsSchemaArr } from '../models/channel.model';

@Injectable({
 providedIn: 'root'
})
export class ChannelService
{
    private _getAllChannelsObs: Observable<Channel[]>;
    private _channels: Channel[] = [];
    channelsBehaviorSub: BehaviorSubject<Channel[]> = new BehaviorSubject<Channel[]>(this._channels);
    channelAddedSub: Subject<Channel> = new Subject<Channel>();

    constructor(private storageMap: StorageMap,
        private messageService: MessageService,
        private userChatService: UserChatService) 
    { 
        this._getAllChannelsObs = 
            this.storageMap.get<Channel[]>(channelsKeyArr, channelsSchemaArr);

        this._getAllChannelsObs
            .subscribe((channels: Channel[]) => {
                this._channels.push(...channels);
                this.channelsBehaviorSub = new BehaviorSubject<Channel[]>(this._channels);
            });
    }


    getAllChannels(): Observable<Channel[]> {
        return this._getAllChannelsObs;
    }

    getChannelByGuid(guid: string): Observable<Channel> {
        return this._getAllChannelsObs
            .pipe<Channel>(
                map((channels: Channel[]) => {
                    if (!channels) return;

                    const channel = channels.find(ch => ch.guid === guid);

                    Channel.prepareGet(channel);
                    channel.messages$ = this.messageService.getMessagesOfChannel(guid);
                    
                    return channel;
                })
            );
    }

    addChannel(): void 
    {
        const channel = new Channel(
            'Conversation',
            [this.userChatService.getCurrentUser()]
        );
        
        this.messageService.addDefaultBotMessage(channel.guid);

        const channelSave = channel.prepareSave(channel);
        
        this._channels.push(channelSave);

        this.storageMap.set(
            channelsKeyArr,
            this._channels,
            channelsSchemaArr)
            .subscribe(() => {
                this.channelsBehaviorSub.next(this._channels);
                this.channelAddedSub.next(channel);
            });
    }
}