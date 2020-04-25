import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { faPaperPlane, faCommentAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';

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

  private _dataSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this._dataSub =
      this.route.data
        .subscribe((data: Data) => 
        {
          this.channel = data['channel'];
        });

    this.initMessageForm();
  }

  ngOnDestroy(): void {
    this._dataSub.unsubscribe();
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
