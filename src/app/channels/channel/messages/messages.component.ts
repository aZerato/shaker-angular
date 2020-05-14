import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { Subscription } from 'rxjs';

import { ChannelService } from '../../services/channel.service';
import { AuthenticationService } from 'src/app/users/services/authentication.service';

import { Channel } from '../../models/channel.model';
import { Message } from '../../models/message.model';
import { User } from 'src/app/shared/models/user.model';
import { SignalRService } from 'src/app/shared/services/signalr.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy
{
  currentUserId: string;
  
  messages: Message[] = [];

  private _channel: Channel;
  private _dataSub: Subscription;
  private _getUserConnectedSub: Subscription;
  private _getMessagesSub: Subscription;
  private _getMessageAddedSub: Subscription;

  constructor(
    private _authenticationService: AuthenticationService,
    private _channelService: ChannelService,
    private _signalrService: SignalRService,
    private _route: ActivatedRoute) 
    { }

  ngOnInit(): void 
  {
    this._dataSub =
      this._route.data
        .subscribe((data: Data) => 
        {
          if(this._channel)
          {
            this.destroyForNewChannel();
          }

          this._channel = data['channel'];

          this._getUserConnectedSub = 
            this._authenticationService
              .getUserConnected()
              .subscribe((user: User) => {
                this.currentUserId = user.id;
              });

          this._getMessagesSub = 
            this._channelService
            .getMessages(this._channel.id)
            .pipe(first())
            .subscribe((ch: Channel) => 
            {
              // get previous messages.
              this.messages = ch.messages;

              this._signalrService.hubConnection
                .on('BroadcastMessage', (msgString: string) => {
                  const msg = JSON.parse(msgString);
                  this.messages.push(msg);
                });

                this._signalrService
                .run('JoinChannel', this._channel.id);
            });
        });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    this.ngOnDestroy();
  }

  ngOnDestroy(): void 
  {
    this._dataSub?.unsubscribe();
    this._getUserConnectedSub?.unsubscribe();
    this._getMessagesSub?.unsubscribe();
    this._getMessageAddedSub?.unsubscribe();
    this._signalrService?.hubConnection?.off('BroadcastMessage');
    this._signalrService?.run('LeaveChannel', this._channel.id);
  }

  destroyForNewChannel(): void
  {
    this._getMessageAddedSub?.unsubscribe();
    this._getMessagesSub?.unsubscribe();
    this._signalrService?.hubConnection?.off('BroadcastMessage');
    this._signalrService?.run('LeaveChannel', this._channel.id);
  }
}
