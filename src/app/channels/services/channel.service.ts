import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
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
    constructor(private storageMap: StorageMap,
        private messageService: MessageService,
        private userChatService: UserChatService) { }

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
                    channel.messages$ = this.messageService.getMessagesOfChannel(guid);
                    
                    return channel;
                })
            );
    }

    channelAdded: Subject<Channel> = new Subject<Channel>();
    addChannel(): void 
    {
        const channel = new Channel(
            'Conversation',
            [this.userChatService.getCurrentUser()]
        );
        
        this.messageService.addDefaultBotMessage(channel.guid);

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
}