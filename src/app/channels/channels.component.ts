import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { faPlusSquare, faRocket, IconDefinition, faSatellite } from '@fortawesome/free-solid-svg-icons';

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
  faSatellite: IconDefinition = faSatellite;

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
        .pipe(first())
        .subscribe((channels: Channel[]) => {
          this.channels = channels;
        });

    this.channelAddedSub = 
      this.channelService
        .channelAddedSub
        .subscribe((channel: Channel) => 
        {
          if (!(this.channels.length === 1 && this.channels[0].guid === channel.guid))
          {
            this.channels.push(channel);
          }
          
          this.router.navigate(['/channel', channel.guid]);
        });
  }

  ngOnDestroy(): void {
    this.channelServiceSub.unsubscribe();
    this.channelAddedSub?.unsubscribe();
  }

  onCreateChannel(): void {
    this.channelService.addChannel();
  }
}
