import { Component, Input, OnInit } from '@angular/core';

import { Observable, merge } from 'rxjs';

import { MessageService } from '../../services/message.service';

import { Message } from '../../models/message.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit
{
  @Input()
  messages$: Observable<Message[]>;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void 
  {
    this.messages$ = merge(this.messages$,
      this.messageService.messageAdded);
  }
}
