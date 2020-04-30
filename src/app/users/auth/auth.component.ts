import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationModel } from '../models/authentication.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy
{
  authenticationFormGroup: FormGroup;
  errorMessage: string;

  private _authenticationModel: AuthenticationModel;
  private _isAuthenticatedSub: Subscription;
  private _creationErrorSub: Subscription;

  constructor(private router: Router,
    private authenticationService: AuthenticationService) {  }

  ngOnInit(): void 
  {
    this._isAuthenticatedSub = 
      this.authenticationService.authenticationStatusChangeSubject
        .subscribe((authenticated: boolean) => {
          if (authenticated)
          {
            this.router.navigate(['/users']);
          }
        });

    this._creationErrorSub =
      this.authenticationService.authenticationErrorSubject
        .subscribe((error: string) => {
          this.errorMessage = error;
        });
  
    this.initForm();
  }

  ngOnDestroy(): void
  {
    this._isAuthenticatedSub.unsubscribe();
    this._creationErrorSub.unsubscribe();
  }

  onSubmit(): void
  {
    this.errorMessage = '';
    if (this.authenticationFormGroup.valid)
    {
      this._authenticationModel = new AuthenticationModel(
        this.authenticationFormGroup.value.userName, 
        this.authenticationFormGroup.value.password);

      this.authenticationService.login(this._authenticationModel);
    }
  }

  private initForm(): void 
  {
    this._authenticationModel = new AuthenticationModel('', '');

    this.authenticationFormGroup = new FormGroup({
      userName: new FormControl(this._authenticationModel.userName, [
        Validators.required
      ]),
      password: new FormControl(this._authenticationModel.password, [
        Validators.required
      ])
    });
  }
}
