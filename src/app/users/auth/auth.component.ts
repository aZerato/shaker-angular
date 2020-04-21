import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationModel } from '../models/authentication.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy
{
  authenticationFormGroup: FormGroup;
  
  private authenticationModel: AuthenticationModel;
  private isAuthenticatedSub: Subscription;

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
    
    this.initForm();
  }

  ngOnDestroy(): void
  {
    this.isAuthenticatedSub.unsubscribe();
  }

  onSubmit(): void
  {
    if (this.authenticationFormGroup.valid)
    {
      this.authenticationService.login(this.authenticationFormGroup.value);
    }
  }

  private initForm(): void 
  {
    this.authenticationModel = new AuthenticationModel('', '', false);

    this.authenticationFormGroup = new FormGroup({
      email: new FormControl(this.authenticationModel.email, [
        Validators.required
      ]),
      password: new FormControl(this.authenticationModel.password, [
        Validators.required
      ]),
      rememberMe: new FormControl(this.authenticationModel.rememberMe)
    });
  }
}
