import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit, OnDestroy {
  title: string;

  private paramsSubsc: Subscription;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void 
  {
    // todo use resolver
    this.paramsSubsc = 
      this.route.params.subscribe((params: Params) => 
      {
        this.title = params['page-name'];
      });
  }

  ngOnDestroy(): void 
  {
    this.paramsSubsc.unsubscribe();
  }
}
