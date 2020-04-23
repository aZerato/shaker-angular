import { Component, Input, OnInit } from '@angular/core';

import { Message } from '../../models/message.model';
import { ChannelService } from '../../services/channel.service';
import { Observable, merge } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit
{
  @Input()
  messages$: Observable<Message[]>;

  constructor(private channelService: ChannelService) { }

  ngOnInit(): void 
  {
    this.messages$ = merge(this.messages$,
      this.channelService.messageAdded);
  }
}
