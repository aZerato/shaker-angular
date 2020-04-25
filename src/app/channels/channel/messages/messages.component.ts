import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { MessageService } from '../../services/message.service';

import { Message } from '../../models/message.model';
import { AuthenticationService } from 'src/app/users/services/authentication.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy
{
  @Input()
  channelGuid: string;

  currentUserGuid: string;

  messages: Message[] = [];

  private _behaviorSub: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService) 
    { }

  ngOnInit(): void 
  {
    this.currentUserGuid = this.authenticationService.getUserConnected().guid;

    const getMessagesByChannelSub = 
      this.messageService.getMessagesByChannelBehaviorSub(this.channelGuid);
      
    this._behaviorSub = getMessagesByChannelSub.subscribe((msgs: Message[]) => {
      this.messages = msgs;
    });
  }

  ngOnDestroy(): void 
  {
    this._behaviorSub.unsubscribe();
  }
}
