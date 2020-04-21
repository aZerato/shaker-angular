import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { UserModel } from 'src/app/shared/models/user.model';
import { CreationModel } from '../models/creation.model';

@Component({
  selector: 'app-new-user',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, OnDestroy
{
  errorMessage: string;
  creationFormGroup: FormGroup;
  
  private creationModel: CreationModel;
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
            this.router.navigate(['/users/profile']);
          }
        });
    
    this.creationErrorSub =
        this.authenticationService.creationErrorSubject
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
      this.authenticationService.create(this.creationFormGroup.value);
    }
  }

  private initForm(): void 
  {
    this.creationModel = new CreationModel('', '', '');

    this.creationFormGroup = new FormGroup({
      name: new FormControl(this.creationModel.email, [
        Validators.required
      ]),
      email: new FormControl(this.creationModel.email, [
        Validators.required
      ]),
      password: new FormControl(this.creationModel.password, [
        Validators.required
      ])
    });
  }
}
