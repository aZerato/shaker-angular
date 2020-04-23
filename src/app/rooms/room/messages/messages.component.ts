import { Component, Input, OnInit } from '@angular/core';

import { Message } from '../../models/message.model';
import { RoomService } from '../../services/room.service';
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

  constructor(private roomService: RoomService) { }

  ngOnInit(): void 
  {
    this.messages$ = merge(this.messages$,
      this.roomService.messageAdded);
  }
}
