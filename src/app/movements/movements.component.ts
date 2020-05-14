import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { faPlusSquare, faDumbbell, IconDefinition, faList } from '@fortawesome/free-solid-svg-icons';

import { MovementService } from './services/movement.service';
import { MovementModel } from './models/movement.model';

@Component({
  selector: 'app-movements',
  templateUrl: './movements.component.html'
})
export class MovementsComponent implements OnInit 
{
  faPlusSquare: IconDefinition = faPlusSquare;
  faDumbbell: IconDefinition = faDumbbell;
  faList: IconDefinition = faList;

  movements: MovementModel[];

  private _getAllMovementsSub: Subscription;
  private _movementAddedSub: Subscription;
  private _movementUpdatedSub: Subscription;

  constructor(
    private _router: Router,
    private _movementService: MovementService) { }

  ngOnInit(): void 
  {  
    this._getAllMovementsSub =
      this._movementService
        .getAllEntitiesObs()
        .pipe(first())
        .subscribe((movements: MovementModel[]) => {
          this.movements = movements;
        });

    this._movementAddedSub = 
      this._movementService
        .entityAddedSub
        .subscribe((movement: MovementModel) => 
        {
          if (!(this.movements.length === 1 && this.movements[0].id === movement.id))
          {
            this.movements.push(movement);
          }
          
          this._router.navigate(['/movement', movement.id]);
        });
    
    this._movementUpdatedSub = 
      this._movementService
        .entityUpdatedSub
        .subscribe((movement: MovementModel) => 
        {
          const index = this.movements.findIndex(m => m.id == movement.id);
          this.movements[index] = movement;
        });
  }

  ngOnDestroy(): void {
    this._getAllMovementsSub.unsubscribe();
    this._movementAddedSub?.unsubscribe();
    this._movementUpdatedSub?.unsubscribe();
  }

  onCreateMovement(): void 
  {
    this._movementService.addEntity(this._movementService.createBaseObject());
  }
}
