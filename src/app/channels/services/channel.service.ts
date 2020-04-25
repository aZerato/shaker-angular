import { Injectable } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, publish, take } from 'rxjs/operators';

import { StorageMap } from '@ngx-pwa/local-storage';

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

    constructor(private storageMap: StorageMap) 
    {
        this._getAllChannelsObs = 
            this.storageMap.get<Channel[]>(channelsKeyArr, channelsSchemaArr)
            .pipe<Channel[]>(map((channels: Channel[]) => {
                if (!channels) channels = [];
                this._channels.push(...channels);
                this.channelsBehaviorSub = new BehaviorSubject<Channel[]>(this._channels);
                return this._channels;
            }));
    }

    getAllChannelsObs() : Observable<Channel[]> {
        return this._getAllChannelsObs.pipe(publish());
    }

    getChannelByGuid(guid: string): Observable<Channel> {
        return this._getAllChannelsObs
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
        const channel = new Channel(
            'Conversation'
        );

        this._channels.push(channel);

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