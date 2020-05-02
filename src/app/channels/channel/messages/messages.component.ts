import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { Subscription } from 'rxjs';

import { ChannelService } from '../../services/channel.service';
import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { MessageService } from '../../services/message.service';
import { SignalRService } from 'src/app/shared/services/websocket.service';

import { Channel } from '../../models/channel.model';
import { Message } from '../../models/message.model';
import { User } from 'src/app/shared/models/user.model';
import { HubConnection } from '@microsoft/signalr';

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
  private _msgsHub: HubConnection;

  constructor(
    private _authenticationService: AuthenticationService,
    private _channelService: ChannelService,
    private _messageService: MessageService,
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
    this._msgsHub = new SignalRService().connect(`wss://localhost:5001/hub/channel`);

    this._msgsHub.on('broadcastMessage', (content: string) => {
      const msg = new Message();
      msg.content = content;
      this.messages.push(msg);
    });

    this._getMessageAddedSub = 
      this._messageService.entityAddedSub
      .subscribe((msg: Message) => {
        this._msgsHub.invoke('broadcastMessage', msg.content).catch(err => console.error(err));
        //this._msgsHub.invoke('broadcastMessage', msg).catch(err => console.error(err));
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
