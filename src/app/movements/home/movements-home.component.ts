import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { faDumbbell, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { MovementService } from '../services/movement.service';
import { MovementModel } from '../models/movement.model';

@Component({
  selector: 'app-movements-home',
  templateUrl: './movements-home.component.html'
})
export class MovementsHomeComponent implements OnInit 
{
  faDumbell: IconDefinition = faDumbbell;

  movements: MovementModel[];

  private _movementServiceSub: Subscription;

  constructor(
    private _movementService: MovementService) { }

  ngOnInit(): void 
  {  
    this._movementServiceSub =
      this._movementService
        .getAllEntitiesObs()
        .pipe(first())
        .subscribe((movements: MovementModel[]) => {
          this.movements = movements;
        });
  }

  ngOnDestroy(): void {
    this._movementServiceSub.unsubscribe();
  }
}
