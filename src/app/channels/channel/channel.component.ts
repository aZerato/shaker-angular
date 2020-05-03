import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { 
  faPaperPlane, 
  faCommentAlt,
  faCogs, 
  IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Channel } from '../models/channel.model';
import { MessageService } from '../services/message.service';
import { ChannelService } from '../services/channel.service';
import { Message } from '../models/message.model';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnDestroy
{
  faPaperPlane: IconDefinition = faPaperPlane;
  faCommentAlt: IconDefinition = faCommentAlt;
  faCogs: IconDefinition = faCogs;

  channel: Channel;
  messages: Message[];
  messageForm: FormGroup;

  private _dataSub: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _channelService: ChannelService,
    private _messageService: MessageService) { }

  ngOnInit(): void 
  {
    this.channel = this._channelService.createBaseObject();

    this._dataSub =
      this._route.data
        .subscribe((data: Data) => 
        {
          this.channel = data['channel'];
        });

    this.initMessageForm();
  }

  ngOnDestroy(): void {
    this._dataSub.unsubscribe();
  }

  initMessageForm(): void 
  {
    this.messageForm = new FormGroup({
      content: new FormControl('', Validators.required)
    });
  }

  onSubmitMessage(): void 
  {
    if (this.messageForm.valid) 
    {
      const msg = new Message();
      msg.channelId = this.channel.id;
      msg.content = this.messageForm.value.content;
      
      this._messageService.entityAddedSub.next(msg);
        
      this.messageForm.reset();
    }
  }
}
