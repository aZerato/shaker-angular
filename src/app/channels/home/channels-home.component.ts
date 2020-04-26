import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { faPlusSquare, faRocket, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { ChannelService } from '../services/channel.service';
import { Channel } from '../models/channel.model';

@Component({
  selector: 'app-channels-home',
  templateUrl: './channels-home.component.html',
  styleUrls: ['./channels-home.component.scss']
})
export class ChannelsHomeComponent implements OnInit 
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
        .getAllEntitiesObs()
        .pipe(first())
        .subscribe((channels: Channel[]) => {
          this.channels = channels;
        });
  }

  ngOnDestroy(): void {
    this.channelServiceSub.unsubscribe();
  }
}
