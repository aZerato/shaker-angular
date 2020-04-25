import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { UserModel } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.scss']
})
export class UserMessageComponent implements OnInit, OnDestroy
{
  @Input()
  userGuid: string;

  user: UserModel;

  private _getUserByGuidSub: Subscription;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void 
  {
    this._getUserByGuidSub =
      this.authenticationService.getUserByGuid(this.userGuid)
      .subscribe((user: UserModel) => {
        this.user = user;
      });
  }

  ngOnDestroy(): void
  {
    this._getUserByGuidSub.unsubscribe();
  }
}
