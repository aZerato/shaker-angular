import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { faPlusSquare, faRocket, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { ChannelService } from '../services/channel.service';
import { Channel } from '../models/channel.model';

@Component({
  selector: 'app-home-channels',
  templateUrl: './home-channels.component.html',
  styleUrls: ['./home-channels.component.scss']
})
export class HomeChannelsComponent implements OnInit 
{
  faPlusSquare: IconDefinition = faPlusSquare;
  faRocket: IconDefinition = faRocket;

  channels: Channel[];

  channelServiceSub: Subscription;

  constructor(
    private channelService: ChannelService) { }

  ngOnInit(): void 
  {  
    this.channelServiceSub =
      this.channelService
        .getAllChannelsObs()
        .pipe(first())
        .subscribe((channels: Channel[]) => {
          this.channels = channels;
        });
  }

  ngOnDestroy(): void {
    this.channelServiceSub.unsubscribe();
  }
}
