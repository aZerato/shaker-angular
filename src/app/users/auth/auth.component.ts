import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationModel } from '../models/authentication.model';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/shared/models/user.model';

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
      this.authenticationService.creationErrorSubject
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
      const user = new UserModel(
        this.authenticationFormGroup.value.name, 
        this.authenticationFormGroup.value.email,
        this.authenticationFormGroup.value.password);
      this._authenticationModel = new AuthenticationModel(user, false);
      this.authenticationService.login(this._authenticationModel);
    }
  }

  private initForm(): void 
  {
    const user = new UserModel('', '', '');
    this._authenticationModel = new AuthenticationModel(user, false);

    this.authenticationFormGroup = new FormGroup({
      email: new FormControl(this._authenticationModel.email, [
        Validators.required
      ]),
      password: new FormControl(this._authenticationModel.password, [
        Validators.required
      ]),
      rememberMe: new FormControl(this._authenticationModel.rememberMe)
    });
  }
}
