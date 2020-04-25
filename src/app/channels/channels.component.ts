import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { faPlusSquare, faRocket, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Subscription } from 'rxjs';

import { ChannelService } from './services/channel.service';
import { Channel } from './models/channel.model';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent implements OnInit 
{
  faPlusSquare: IconDefinition = faPlusSquare;
  faRocket: IconDefinition = faRocket;

  channels: Channel[];

  channelServiceSub: Subscription;
  channelAddedSub: Subscription;

  constructor(
    private router: Router,
    private channelService: ChannelService) { }

  ngOnInit(): void 
  {  
    this.channelServiceSub =
      this.channelService
        .getAllChannelsObs()
        .subscribe((channels: Channel[]) => {
          this.channels = channels;
        });

    this.channelAddedSub = 
      this.channelService.channelAddedSub.subscribe((channel: Channel) => {
        this.channels.push(channel);
        this.router.navigate(['/channel', channel.guid]);
      });
  }

  ngOnDestroy(): void {
    this.channelServiceSub.unsubscribe();
    this.channelAddedSub.unsubscribe();
  }

  onCreateChannel(): void {
    this.channelService.addChannel();
  }
}
