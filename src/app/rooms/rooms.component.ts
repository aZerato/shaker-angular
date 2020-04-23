import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { RoomService } from './services/room.service';
import { Room } from './models/room.model';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];

  getAllRoomsSub: Subscription;
  roomAddedSub: Subscription;

  constructor(
    private router: Router,
    private roomService: RoomService) { }

  ngOnInit(): void {
    this.getAllRoomsSub = 
      this.roomService.getAllRooms()
      .subscribe((rooms: Room[]) => {
        this.rooms = rooms;
      });
    
    this.roomAddedSub = 
      this.roomService.roomAdded.subscribe((room: Room) => {
        this.router.navigate(['/rooms', room.guid]);
      });
  }

  ngOnDestroy(): void {
    this.getAllRoomsSub.unsubscribe();
    this.roomAddedSub.unsubscribe();
  }

  onCreateRoom(): void {
    this.roomService.addRoom();
  }
}
