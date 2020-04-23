import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription, Observable, merge } from 'rxjs';

import { RoomService } from '../services/room.service';
import { Room } from '../models/room.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy
{
  room$: Observable<Room>;
  messageForm: FormGroup;

  private paramsSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService) { }

  ngOnInit(): void {
    this.paramsSub =
      this.route.params
      .subscribe((params: Params) => 
      {
        this.room$ = this.roomService.getRoomByGuid(params['guid']);
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

  onSubmitMessage(roomGuid: string): void {
    if (this.messageForm.valid && roomGuid) 
    {
      this.roomService.addMessage(roomGuid, this.messageForm.value.content);
      this.messageForm.reset();
    }
  }
}
