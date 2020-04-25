import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription, Observable } from 'rxjs';

import { faPaperPlane, faCommentAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { ChannelService } from '../services/channel.service';

import { Channel } from '../models/channel.model';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit, OnDestroy
{
  faPaperPlane: IconDefinition = faPaperPlane;
  faCommentAlt: IconDefinition = faCommentAlt;

  channel: Channel = new Channel('');
  messageForm: FormGroup;

  private _paramsSub: Subscription;
  private _getChannelByGuidSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this._paramsSub =
      this.route.params
        .subscribe((params: Params) => 
        {
          const guid = params['guid'];

          this._getChannelByGuidSub =
            this.channelService
            .getChannelByGuid(guid)
            .subscribe((channel: Channel) => {
              this.channel = channel;
            });
        });

    this.initMessageForm();
  }

  ngOnDestroy(): void {
    this._paramsSub.unsubscribe();
    this._getChannelByGuidSub.unsubscribe();
  }

  initMessageForm(): void {
    this.messageForm = new FormGroup({
      content: new FormControl('', Validators.required)
    });
  }

  onSubmitMessage(): void {
    if (this.messageForm.valid) 
    {
      this.messageService.addUserMessage(
        this.channel.guid, 
        this.messageForm.value.content);
        
      this.messageForm.reset();
    }
  }
}
