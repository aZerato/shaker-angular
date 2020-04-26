import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { Subscription } from 'rxjs';

import { 
  faDumbbell,
  faCogs, 
  IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Movement } from '../models/movement.model';

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.scss']
})
export class MovementComponent implements OnInit, OnDestroy
{
  faDumbbell: IconDefinition = faDumbbell;
  faCogs: IconDefinition = faCogs;

  movement: Movement = new Movement('');

  private _dataSub: Subscription;

  constructor(
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._dataSub =
      this.route.data
        .subscribe((data: Data) => 
        {
          this.movement = data['movement'];
        });
  }

  ngOnDestroy(): void {
    this._dataSub.unsubscribe();
  }
}
