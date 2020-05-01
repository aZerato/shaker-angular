import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { ChannelService } from '../../services/channel.service';

import { Message } from '../../models/message.model';
import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { Channel } from '../../models/channel.model';
import { ActivatedRoute, Data } from '@angular/router';
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
    private authenticationService: AuthenticationService,
    private channelService: ChannelService,
    private route: ActivatedRoute) 
    { }

  ngOnInit(): void 
  {
    this._dataSub =
      this.route.data
        .subscribe((data: Data) => 
        {
          this._channel = data['channel'];

          this._getUserConnectedSub = 
            this.authenticationService
              .getUserConnected()
              .subscribe((user: User) => {
                this.currentUserId = user.id;
              });

          this._getMessagesSub = 
            this.channelService
            .getMessages(this._channel.id)
            .subscribe((ch: Channel) => {
              this.messages = ch.messages;
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
