import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseServerResolverService } from 'src/app/shared/resolvers/base-server.resolver';

import { ChannelService } from '../services/channel.service';
import { Channel } from '../models/channel.model'

@Injectable({
    providedIn: 'root'
})
export class ChannelResolverService extends BaseServerResolverService<Channel> {

    constructor(
        router: Router,
        channelService: ChannelService) 
        { 
            super(router, channelService, '/channel');
        }
}