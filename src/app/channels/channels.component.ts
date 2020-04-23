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

  channels: Channel[] = [];

  getAllChannelsSub: Subscription;
  channelAddedSub: Subscription;

  constructor(
    private router: Router,
    private channelService: ChannelService) { }

  ngOnInit(): void {
    this.getAllChannelsSub = 
      this.channelService.getAllChannels()
      .subscribe((channels: Channel[]) => {
        this.channels = channels;
      });
    
    this.channelAddedSub = 
      this.channelService.channelAdded.subscribe((channel: Channel) => {
        this.router.navigate(['/channel', channel.guid]);
      });
  }

  ngOnDestroy(): void {
    this.getAllChannelsSub.unsubscribe();
    this.channelAddedSub.unsubscribe();
  }

  onCreateChannel(): void {
    this.channelService.addChannel();
  }
}
