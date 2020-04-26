import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { faMap, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { TrainingService } from '../services/trainings.service';
import { Training } from '../models/training.model';

@Component({
  selector: 'app-trainings-home',
  templateUrl: './trainings-home.component.html'
})
export class TrainingsHomeComponent implements OnInit 
{
  faMap: IconDefinition = faMap;

  trainings: Training[];

  private _trainingServiceSub: Subscription;

  constructor(
    private _trainingService: TrainingService) { }

  ngOnInit(): void 
  {  
    this._trainingServiceSub =
      this._trainingService
        .getAllEntitiesObs()
        .pipe(first())
        .subscribe((trainings: Training[]) => {
          this.trainings = trainings;
        });
  }

  ngOnDestroy(): void {
    this._trainingServiceSub.unsubscribe();
  }
}
