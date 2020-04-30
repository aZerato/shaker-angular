import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  styleUrls: ['./user-message.component.scss']
})
export class UserMessageComponent implements OnInit, OnDestroy
{
  @Input()
  userId: number;

  user: User;

  private _getUserByGuidSub: Subscription;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void 
  {
    this._getUserByGuidSub =
      this.authenticationService.getUserByGuid(this.userId)
      .subscribe((user: User) => {
        this.user = user;
      });
  }

  ngOnDestroy(): void
  {
    this._getUserByGuidSub.unsubscribe();
  }
}
