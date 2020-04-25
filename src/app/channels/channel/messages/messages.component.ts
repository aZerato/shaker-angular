import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { MessageService } from '../../services/message.service';

import { Message } from '../../models/message.model';
import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { Channel } from '../../models/channel.model';
import { ActivatedRoute, Data } from '@angular/router';
import { UserModel } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy
{
  currentUserGuid: string;
  
  messages: Message[] = [];

  private _channel: Channel;
  private _dataSub: Subscription;
  private _getUserConnectedSub: Subscription;
  private _getStorageMessagesChannelsObsSub: Subscription;
  private _getMessageAddedSub: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
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
              .subscribe((user: UserModel) => {
                this.currentUserGuid = user.guid;
              });

          this._getStorageMessagesChannelsObsSub = 
            this.messageService
            .getStorageMessagesChannelsObs(this._channel.guid)
            .subscribe((msgs: Message[]) => {
              this.messages = msgs;

              this._getMessageAddedSub =
                this.messageService.getMessageAddedSub(this._channel.guid)
                .subscribe((message: Message) => 
                {
                  if (this.messages.find(msg => msg.guid === message.guid)) 
                    return;
                  
                  this.messages.push(message);
                });
            });

        });
  }

  ngOnDestroy(): void 
  {
    this._dataSub.unsubscribe();
    this._getUserConnectedSub?.unsubscribe();
    this._getStorageMessagesChannelsObsSub?.unsubscribe();
    this._getMessageAddedSub?.unsubscribe();
  }
}
