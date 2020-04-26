import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';

import { Subscription } from 'rxjs';

import { TrainingService } from '../../services/trainings.service';
import { Training } from '../../models/training.model';

@Component({
  selector: 'app-training-settings',
  templateUrl: './training-settings.component.html'
})
export class TrainingSettingsComponent implements OnInit, OnDestroy
{
  trainingSettingsFormGroup: FormGroup;
  trainingUpdated: Training;
  private _dataSub: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _trainingService: TrainingService) { }

  ngOnInit(): void 
  {
    this._dataSub = 
      this._route.data.subscribe((data: Data) => {
        this.trainingSettingsFormGroup = data['training'];
        this.initForm();
      });
  }

  ngOnDestroy(): void 
  {
    this._dataSub.unsubscribe();
  }

  onSubmit(): void 
  {
    if (this.trainingSettingsFormGroup.valid)
    {
      alert();
    }
  }

  private initForm(): void 
  {
    this.trainingUpdated = this._trainingService.createBaseObject();

    this.trainingSettingsFormGroup = new FormGroup({
      name: new FormControl(this.trainingUpdated.name, [
        Validators.required
      ]),
      imgPath: new FormControl(this.trainingUpdated.imgPath, [
        Validators.required
      ])
    });
  }
}
