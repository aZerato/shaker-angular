import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { faPlusSquare, faRocket, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { ChannelService } from '../services/channel.service';
import { Channel } from '../models/channel.model';

@Component({
  selector: 'app-channels-home',
  templateUrl: './channels-home.component.html'
})
export class ChannelsHomeComponent implements OnInit 
{
  faPlusSquare: IconDefinition = faPlusSquare;
  faRocket: IconDefinition = faRocket;

  channels: Channel[];

  private _channelServiceSub: Subscription;

  constructor(
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
  }

  ngOnDestroy(): void {
    this._channelServiceSub.unsubscribe();
  }
}
