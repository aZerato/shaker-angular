import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { Subscription } from 'rxjs';

import { 
  faDumbbell,
  faCogs, 
  IconDefinition 
} from '@fortawesome/free-solid-svg-icons';

import { Movement } from '../models/movement.model';
import { MovementService } from '../services/movement.service';

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html'
})
export class MovementComponent implements OnInit, OnDestroy
{
  faDumbbell: IconDefinition = faDumbbell;
  faCogs: IconDefinition = faCogs;

  movement: Movement;

  private _dataSub: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _movementService: MovementService) { }

  ngOnInit(): void 
  {
    this.movement = this._movementService.createBaseObject();
    
    this._dataSub =
      this._route.data
        .subscribe((data: Data) => 
        {
          this.movement = data['movement'];
        });
  }

  ngOnDestroy(): void {
    this._dataSub.unsubscribe();
  }
}
