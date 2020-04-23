import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription, Observable } from 'rxjs';

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
  channel$: Observable<Channel>;
  messageForm: FormGroup;

  private paramsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.paramsSub =
      this.route.params
      .subscribe((params: Params) => 
      {
        this.channel$ = this.channelService.getChannelByGuid(params['guid']);
      });

    this.initMessageForm();
  }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
  }

  initMessageForm(): void {
    this.messageForm = new FormGroup({
      content: new FormControl('', Validators.required)
    });
  }

  onSubmitMessage(channelGuid: string): void {
    if (this.messageForm.valid && channelGuid) 
    {
      this.messageService.addMessage(channelGuid, this.messageForm.value.content);
      this.messageForm.reset();
    }
  }
}
