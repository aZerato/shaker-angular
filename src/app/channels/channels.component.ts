import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { faPlusSquare, faRocket, IconDefinition, faSatellite } from '@fortawesome/free-solid-svg-icons';

import { ChannelService } from './services/channel.service';
import { Channel } from './models/channel.model';

@Component({
  selector: 'app-channels',
  templateUrl: './channels.component.html'
})
export class ChannelsComponent implements OnInit 
{
  faPlusSquare: IconDefinition = faPlusSquare;
  faRocket: IconDefinition = faRocket;
  faSatellite: IconDefinition = faSatellite;

  channels: Channel[];

  private _channelServiceSub: Subscription;
  private _channelAddedSub: Subscription;

  constructor(
    private _router: Router,
    private _channelService: ChannelService) { }

  ngOnInit(): void 
  {  
    this._channelServiceSub =
      this._channelService
        .getAllEntitiesObs()
        .pipe(first())
        .subscribe((channels: Channel[]) => {
          this.channels = channels;
        });

    this._channelAddedSub = 
      this._channelService
        .entityAddedSub
        .subscribe((channel: Channel) => 
        {
          if (!(this.channels.length === 1 && this.channels[0].id === channel.id))
          {
            this.channels.push(channel);
          }
          
          this._router.navigate(['/channel', channel.id]);
        });
  }

  ngOnDestroy(): void {
    this._channelServiceSub.unsubscribe();
    this._channelAddedSub?.unsubscribe();
  }

  onCreateChannel(): void {
    const ch = new Channel();
    ch.name = "New channel " + Date.now;

    this._channelService.addEntity(ch);
  }
}
