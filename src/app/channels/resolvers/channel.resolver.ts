import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseResolverService } from 'src/app/shared/resolvers/base.resolver';

import { ChannelService } from '../services/channel.service';
import { Channel } from '../models/channel.model'

@Injectable({
    providedIn: 'root'
})
export class ChannelResolverService extends BaseResolverService<Channel> {

    constructor(
        router: Router,
        channelService: ChannelService) 
        { 
            super(router, channelService, '/channel');
        }
}