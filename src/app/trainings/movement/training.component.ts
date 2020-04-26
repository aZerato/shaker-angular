import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

import { Subscription } from 'rxjs';

import { 
  faMap,
  faCogs, 
  IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Training } from '../models/training.model';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy
{
  faMap: IconDefinition = faMap;
  faCogs: IconDefinition = faCogs;

  training: Training = new Training('');

  private _dataSub: Subscription;

  constructor(
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this._dataSub =
      this.route.data
        .subscribe((data: Data) => 
        {
          this.training = data['training'];
        });
  }

  ngOnDestroy(): void {
    this._dataSub.unsubscribe();
  }
}
