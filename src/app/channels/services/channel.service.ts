import { Injectable } from '@angular/core';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageMap } from '@ngx-pwa/local-storage';

import { Channel, channelsKeyArr, channelsSchemaArr } from '../models/channel.model';
import { MessageService } from './message.service';
import { BaseService } from 'src/app/shared/services/base.service';

@Injectable({
    providedIn: 'root'
})
export class ChannelService extends BaseService<Channel> 
{
    constructor(_storageMap: StorageMap,
        private _messageService: MessageService) 
    {
        super(_storageMap, channelsKeyArr, channelsSchemaArr);

        this.entityAddedSub.subscribe((channel: Channel) => {
            this._messageService.addBotMessage(channel.guid, 'Hello !');
        });
    }
    
    createBaseObject() {
        return new Channel('Conversation');
    }
}