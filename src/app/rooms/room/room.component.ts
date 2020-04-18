import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { RoomService } from '../services/room.service';
import { Room } from '../models/room.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy
{
  room: Room;
  messageForm: FormGroup;

  private paramsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService) { }

  ngOnInit(): void {
    this.paramsSub =
      this.route.params.subscribe((params: Params) => {
        this.room = this.roomService.getRoomByGuid(params['guid']);
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

  onSubmitMessage(): void {
    if (this.messageForm.valid) 
    {
      this.roomService.addMessage(this.room, this.messageForm.value.content);
    }
  }
}
