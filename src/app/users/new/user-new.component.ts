import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationModel } from '../models/authentication.model';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.scss']
})
export class UserNewComponent implements OnInit, OnDestroy
{
  errorMessage: string;
  creationFormGroup: FormGroup;
  
  private _authenticationModel: AuthenticationModel;
  private isAuthenticatedSub: Subscription;
  private creationErrorSub: Subscription;

  constructor(private router: Router,
    private authenticationService: AuthenticationService) {  }

  ngOnInit(): void 
  {
    this.isAuthenticatedSub = 
      this.authenticationService.authenticationStatusChangeSubject
        .subscribe((authenticated: boolean) => {
          if (authenticated)
          {
            this.router.navigate(['/users']);
          }
        });
    
    this.creationErrorSub =
        this.authenticationService.authenticationErrorSubject
          .subscribe((error: string) => {
            this.errorMessage = error;
          });

    this.initForm();
  }

  ngOnDestroy(): void
  {
    this.isAuthenticatedSub.unsubscribe();
    this.creationErrorSub.unsubscribe();
  }

  onSubmit(): void
  {
    this.errorMessage = undefined;
    if (this.creationFormGroup.valid)
    {
      this._authenticationModel = new AuthenticationModel(
        this.creationFormGroup.value.userName, 
        this.creationFormGroup.value.password);

      this.authenticationService.create(this.creationFormGroup.value);
    }
  }

  private initForm(): void 
  {
    this._authenticationModel = new AuthenticationModel('', '');

    this.creationFormGroup = new FormGroup({
      userName: new FormControl(this._authenticationModel.userName, [
        Validators.required
      ]),
      password: new FormControl(this._authenticationModel.password, [
        Validators.required
      ])
    });
  }
}
