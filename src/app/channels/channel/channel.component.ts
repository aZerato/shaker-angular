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
import { Message } from '../models/message.model';
import { SignalRService } from 'src/app/shared/services/signalr.service';

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
  private _getMessageAddedSub: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _signalrService: SignalRService) { }

  ngOnInit(): void 
  {
    this._dataSub =
      this._route.data
        .subscribe((data: Data) => 
        {
          this.channel = data['channel'];
        });

    this.initMessageForm();
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
      
      this._signalrService.run('BroadcastMessage', JSON.stringify(msg));
      
      this.messageForm.reset();
    }
  }

  ngOnDestroy(): void {
    this._dataSub.unsubscribe();
    this._getMessageAddedSub?.unsubscribe();
    this._signalrService?.ngOnDestroy();
  }
}
