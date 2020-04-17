import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-logout',
  template: '<span>logout</span>'
})
export class LogoutComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
    this.authenticationService.logoff();
    this.router.navigate(['/']);
  }
}
