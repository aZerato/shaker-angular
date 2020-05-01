import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/shared/models/user.model';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit 
{
  accountFormGroup: FormGroup;
  userUpdated: User;

  constructor(private _authenticationService: AuthenticationService) { }

  ngOnInit(): void 
  {
    this._authenticationService
      .getUserConnected()
      .subscribe((user: User) => {
        this.userUpdated = user;
        this.initForm();
      });
  }

  onSubmit(): void 
  {

  }

  private initForm(): void 
  {
    this.accountFormGroup = new FormGroup({
      name: new FormControl(this.userUpdated.name, [
        Validators.required
      ]),
      firstName: new FormControl(this.userUpdated.firstName, [
        Validators.required
      ]),
      imgPath: new FormControl(this.userUpdated.imgPath, [
        Validators.required
      ]),
      email: new FormControl(this.userUpdated.email, [
        Validators.required
      ])
    });
  }
}
