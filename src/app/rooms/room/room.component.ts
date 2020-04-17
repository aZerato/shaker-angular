import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy
{
  private paramsSubsc: Subscription;
  roomId: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void
  {
    // todo use resolver
    this.paramsSubsc = 
      this.route.params.subscribe((params: Params) => 
      {
        this.roomId = params['id'];
      });
  }

  ngOnDestroy(): void 
  {
    this.paramsSubsc.unsubscribe();
  }
}
