import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { Subscription } from 'rxjs';

import { ChannelService } from '../../services/channel.service';
import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { MessageService } from '../../services/message.service';
import { SignalRService } from 'src/app/shared/services/signalr.service';

import { Channel } from '../../models/channel.model';
import { Message } from '../../models/message.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy
{
  currentUserId: number;
  
  messages: Message[] = [];

  private _channel: Channel;
  private _dataSub: Subscription;
  private _getUserConnectedSub: Subscription;
  private _getMessagesSub: Subscription;
  private _getMessageAddedSub: Subscription;

  constructor(
    private _authenticationService: AuthenticationService,
    private _channelService: ChannelService,
    private _messageService: MessageService,
    private _signalrService: SignalRService,
    private _route: ActivatedRoute) 
    { }

  ngOnInit(): void 
  {
    this._dataSub =
      this._route.data
        .subscribe((data: Data) => 
        {
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
            .subscribe((ch: Channel) => {
              this.messages = ch.messages;

              this.initWSConnection();
            });
        });
  }

  initWSConnection() 
  {
    this._signalrService.createConnection(`wss://localhost:5001/hub/channel`, 1);
    this._signalrService.startConnection();
    this._signalrService.connectionEstablished
    .subscribe((state: boolean) =>
    {
      if (!state) return;

      this._signalrService.hubConnection
      .on('BroadcastMessage', (msgString: string) => {
        const msg = JSON.parse(msgString);
        this.messages.push(msg);
      });

      this._getMessageAddedSub = 
      this._messageService.entityAddedSub
      .subscribe((msg: Message) => {
        this._signalrService
          .run('BroadcastMessage', JSON.stringify(msg));
      });
    });
    

    
  }

  ngOnDestroy(): void 
  {
    this._dataSub.unsubscribe();
    this._getUserConnectedSub?.unsubscribe();
    this._getMessagesSub?.unsubscribe();
    this._getMessageAddedSub?.unsubscribe();
  }
}
