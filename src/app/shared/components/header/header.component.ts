import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy
{
  title:string = "Shaker";
  isMenuCollapsed: boolean = true;

  private authenticationStatusChangeSubsc: Subscription;
  isAuthenticated: boolean = false;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void
  {
    this.authenticationStatusChangeSubsc = 
      this.authenticationService.authenticationStatusChangeSubject
      .subscribe((status) => {
        this.isAuthenticated = status;
      });
  }

  ngOnDestroy(): void
  {
    this.authenticationStatusChangeSubsc.unsubscribe();
  }
}
