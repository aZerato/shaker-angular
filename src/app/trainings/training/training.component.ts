import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { Subscription } from 'rxjs';

import { 
  faMap,
  faCogs, 
  IconDefinition 
} from '@fortawesome/free-solid-svg-icons';

import { Training } from '../models/training.model';
import { TrainingService } from '../services/trainings.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html'
})
export class TrainingComponent implements OnInit, OnDestroy
{
  faMap: IconDefinition = faMap;
  faCogs: IconDefinition = faCogs;

  training: Training;

  private _dataSub: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _trainingService: TrainingService) { }

  ngOnInit(): void 
  {
    this.training = this._trainingService.createBaseObject();

    this._dataSub =
      this._route.data
        .subscribe((data: Data) => 
        {
          this.training = data['training'];
        });
  }

  ngOnDestroy(): void {
    this._dataSub.unsubscribe();
  }
}
