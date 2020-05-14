import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { faPlusSquare, faRocket, IconDefinition, faSatellite } from '@fortawesome/free-solid-svg-icons';

import { ChannelService } from './services/channel.service';
import { Channel } from './models/channel.model';
import { SignalRService } from '../shared/services/signalr.service';

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
  private _channelUpdatedSub: Subscription;

  constructor(
    private _router: Router,
    private _channelService: ChannelService,
    private _signalrService: SignalRService) { }

  ngOnInit(): void 
  {  
    this._channelServiceSub =
      this._channelService
        .getAllEntitiesObs()
        .pipe(first())
        .subscribe((channels: Channel[]) => {
          this.channels = channels;

          this.initWSConnection();
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
    
    this._channelUpdatedSub = 
        this._channelService
          .entityUpdatedSub
          .subscribe((channel: Channel) => 
          {
            const index = this.channels.findIndex(c => c.id == channel.id);
            this.channels[index] = channel;
          });
  }

  initWSConnection() 
  {
    this._signalrService.createConnection(`wss://localhost:5001/hub/channel`, true);
    this._signalrService.startConnection();

    this._signalrService.connectionEstablished
    .subscribe((state: boolean) =>
    {
      if (!state) return;
    });
  }

  onCreateChannel(): void {
    const ch = new Channel();
    ch.name = "New channel " + Date.now();

    this._channelService.addEntity(ch);
  }

  ngOnDestroy(): void {
    this._channelServiceSub.unsubscribe();
    this._channelAddedSub?.unsubscribe();
    this._channelUpdatedSub?.unsubscribe();
    this._signalrService?.ngOnDestroy();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    this.ngOnDestroy();
  }
}
