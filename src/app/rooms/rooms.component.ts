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

  constructor(
    private router: Router,
    private roomService: RoomService) { }

  ngOnInit(): void {
    this.getAllRoomsSub = 
      this.roomService.getAllRooms()
      .subscribe((rooms: Room[]) => {
        this.rooms = rooms;
      });
  }

  ngOnDestroy(): void {
    this.getAllRoomsSub.unsubscribe();
  }

  onCreateRoom(): void {
    const guid = this.roomService.addRoom();

    this.router.navigate(['/rooms', guid]);
  }
}
