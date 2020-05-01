import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Data, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel.model';

@Component({
  selector: 'app-channel-settings',
  templateUrl: './channel-settings.component.html'
})
export class ChannelSettingsComponent implements OnInit, OnDestroy
{
  channelSettingsFormGroup: FormGroup;
  channelUpdated: Channel;
  private _dataSub: Subscription;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _channelService: ChannelService) { }

  ngOnInit(): void 
  {
    this._dataSub = 
      this._route.data.subscribe((data: Data) => {
        this.channelUpdated = data['channel'];
        this.initForm();

        this._channelService.entityDeletedSub.subscribe(() => {
          this._router.navigate(['/channel']);
        });
      });
  }

  ngOnDestroy(): void 
  {
    this._dataSub.unsubscribe();
  }

  onSubmit(): void 
  {
    if (this.channelSettingsFormGroup.valid)
    {
      this.channelUpdated.name = this.channelSettingsFormGroup.value.name;
      this.channelUpdated.description = this.channelSettingsFormGroup.value.description;
      this.channelUpdated.imgPath = this.channelSettingsFormGroup.value.imgPath;

      this._channelService.updateEntity(this.channelUpdated);
    }
  }

  onDelete(): void 
  {
    this._channelService.deleteEntity(this.channelUpdated);
  }

  private initForm(): void 
  {
    this.channelSettingsFormGroup = new FormGroup({
      name: new FormControl(this.channelUpdated.name, [
        Validators.required
      ]),
      description: new FormControl(this.channelUpdated.description, [
        Validators.required
      ]),
      imgPath: new FormControl(this.channelUpdated.imgPath, [
        Validators.required
      ])
    });
  }
}
