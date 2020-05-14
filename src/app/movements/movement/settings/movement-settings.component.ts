import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';

import { Subscription } from 'rxjs';

import { MovementService } from '../../services/movement.service';
import { MovementModel } from '../../models/movement.model';

@Component({
  selector: 'app-movement-settings',
  templateUrl: './movement-settings.component.html'
})
export class MovementSettingsComponent implements OnInit, OnDestroy
{
  movementSettingsFormGroup: FormGroup;
  movementUpdated: MovementModel;
  private _dataSub: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _movementService: MovementService) { }

  ngOnInit(): void 
  {
    this._dataSub = 
      this._route.data.subscribe((data: Data) => {
        this.movementUpdated = data['movement'];
        this.initForm();
      });
  }

  ngOnDestroy(): void 
  {
    this._dataSub.unsubscribe();
  }

  onSubmit(): void 
  {
    if (this.movementSettingsFormGroup.valid)
    {
      this.movementUpdated.name = this.movementSettingsFormGroup.value.name;
      this.movementUpdated.description = this.movementSettingsFormGroup.value.description;
      this.movementUpdated.imgPath = this.movementSettingsFormGroup.value.imgPath;

      this._movementService.updateEntity(this.movementUpdated);
    }
  }

  onDelete(): void 
  {
    this._movementService.deleteEntity(this.movementUpdated);
  }

  private initForm(): void 
  {
    this.movementSettingsFormGroup = new FormGroup({
      name: new FormControl(this.movementUpdated.name, [
        Validators.required
      ]),
      description: new FormControl(this.movementUpdated.description, [
        Validators.required
      ]),
      imgPath: new FormControl(this.movementUpdated.imgPath, [
        Validators.required
      ])
    });
  }
}
