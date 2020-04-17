import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  rooms: string[] = ['guid1', 'guid2'];

  constructor() { }

  ngOnInit(): void {
  }

}
