import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { Subscription } from 'rxjs';

import { 
  faCalendar, 
  faSquareRootAlt, 
  faMap, 
  faDumbbell, 
  faRocket, 
  faUser,
  faHandPeace,
  faSignInAlt,
  faSignOutAlt,
  faRuler,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

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

  faCalendar: IconDefinition = faCalendar;
  faSquareRootAlt: IconDefinition = faSquareRootAlt;
  faMap: IconDefinition = faMap;
  faDumbbell: IconDefinition = faDumbbell;
  faRocket: IconDefinition = faRocket;
  faUser: IconDefinition = faUser;
  faHandPeace: IconDefinition = faHandPeace;
  faSignInAlt: IconDefinition = faSignInAlt;
  faSignOutAlt: IconDefinition = faSignOutAlt;
  faRuler: IconDefinition = faRuler;


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
