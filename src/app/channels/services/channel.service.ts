import { Injectable } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageMap } from '@ngx-pwa/local-storage';

import { Channel, channelsKeyArr, channelsSchemaArr } from '../models/channel.model';
import { MessageService } from './message.service';

@Injectable({
    providedIn: 'root'
})
export class ChannelService
{
    private _channels: Channel[];
    private _channelsStorageMap: Observable<Channel[]>;
    channelAddedSub: Subject<Channel> = new Subject<Channel>();

    constructor(
        private storageMap: StorageMap,
        private messageService: MessageService
    ) 
    { 
        this._channelsStorageMap = this.storageMap
            .get<Channel[]>(channelsKeyArr, channelsSchemaArr)
            .pipe<Channel[]>(map((channels: Channel[]) => {
                if (!channels) channels = [];
                this._channels = channels;
                return this._channels;
            }));
    }

    getAllChannelsObs() : Observable<Channel[]> {
        return this._channelsStorageMap;
    }

    getChannelByGuid(guid: string): Observable<Channel> {
        return this._channelsStorageMap
            .pipe<Channel>(
                map((channels: Channel[]) => {
                    if (!channels) return;

                    const channel = channels.find(ch => ch.guid === guid);

                    return channel;
                })
            );
    }

    addChannel(): void 
    {
        const init = this._channels;
            
        if (init)
        {
            this.saveChannel(this._channels);
            return;
        }
        
        this.getAllChannelsObs()
            .subscribe((channels: Channel[]) => 
        {
            this.saveChannel(channels);
        });
    }

    private saveChannel(channels: Channel[]): void
    {
        const channel = new Channel(
            'Conversation'
        );

        channels.push(channel);

        this.storageMap.set(
            channelsKeyArr,
            channels,
            channelsSchemaArr)
            .subscribe(() => {
                this.messageService.addBotMessage(channel.guid, 'Hello');
                this.channelAddedSub.next(channel);
            });
    }
}