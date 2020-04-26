import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { faPlusSquare, faDumbbell, IconDefinition, faList } from '@fortawesome/free-solid-svg-icons';

import { MovementService } from './services/movement.service';
import { Movement } from './models/movement.model';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html'
})
export class MovementsComponent implements OnInit 
{
  faPlusSquare: IconDefinition = faPlusSquare;
  faDumbbell: IconDefinition = faDumbbell;
  faList: IconDefinition = faList;

  movements: Movement[];

  private _getAllMovementsSub: Subscription;
  private _movementAddedSub: Subscription;

  constructor(
    private _router: Router,
    private _movementService: MovementService) { }

  ngOnInit(): void 
  {  
    this._getAllMovementsSub =
      this._movementService
        .getAllEntitiesObs()
        .pipe(first())
        .subscribe((movements: Movement[]) => {
          this.movements = movements;
        });

    this._movementAddedSub = 
      this._movementService
        .entityAddedSub
        .subscribe((movement: Movement) => 
        {
          if (!(this.movements.length === 1 && this.movements[0].guid === movement.guid))
          {
            this.movements.push(movement);
          }
          
          this._router.navigate(['/movement', movement.guid]);
        });
  }

  ngOnDestroy(): void {
    this._getAllMovementsSub.unsubscribe();
    this._movementAddedSub?.unsubscribe();
  }

  onCreateMovement(): void {
    this._movementService.addEntity();
  }
}
