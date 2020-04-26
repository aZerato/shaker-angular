import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Data } from '@angular/router';

import { Subscription } from 'rxjs';

import { MovementService } from '../../services/movement.service';
import { Movement } from '../../models/movement.model';

@Component({
  selector: 'app-movement-settings',
  templateUrl: './movement-settings.component.html',
  styleUrls: ['./movement-settings.component.scss']
})
export class MovementSettingsComponent implements OnInit, OnDestroy
{
  movementSettingsFormGroup: FormGroup;
  movementUpdated: Movement;
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
      alert();
    }
  }

  private initForm(): void 
  {
    this.movementSettingsFormGroup = new FormGroup({
      name: new FormControl(this.movementUpdated.name, [
        Validators.required
      ]),
      imgPath: new FormControl(this.movementUpdated.imgPath, [
        Validators.required
      ])
    });
  }
}
