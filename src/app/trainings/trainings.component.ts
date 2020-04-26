import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { faPlusSquare, faMap, IconDefinition, faList } from '@fortawesome/free-solid-svg-icons';

import { TrainingService } from './services/trainings.service';
import { Training } from './models/training.model';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html'
})
export class TrainingsComponent implements OnInit 
{
  faPlusSquare: IconDefinition = faPlusSquare;
  faMap: IconDefinition = faMap;
  faList: IconDefinition = faList;

  trainings: Training[];

  private _getAllTrainingsSub: Subscription;
  private _trainingAddedSub: Subscription;

  constructor(
    private router: Router,
    private _trainingService: TrainingService) { }

  ngOnInit(): void 
  {  
    this._getAllTrainingsSub =
      this._trainingService
        .getAllEntitiesObs()
        .pipe(first())
        .subscribe((trainings: Training[]) => {
          this.trainings = trainings;
        });

    this._trainingAddedSub = 
      this._trainingService
        .entityAddedSub
        .subscribe((training: Training) => 
        {
          if (!(this.trainings.length === 1 && this.trainings[0].guid === training.guid))
          {
            this.trainings.push(training);
          }
          
          this.router.navigate(['/training', training.guid]);
        });
  }

  ngOnDestroy(): void {
    this._getAllTrainingsSub.unsubscribe();
    this._trainingAddedSub?.unsubscribe();
  }

  onCreate(): void {
    this._trainingService.addEntity();
  }
}
