import { Component, OnInit } from '@angular/core';

import { 
  faSquareRootAlt,
  faFilter,
  IconDefinition, 
  faList 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html'
})
export class MetricsComponent implements OnInit 
{
  faSquareRootAlt: IconDefinition = faSquareRootAlt;
  faFilter: IconDefinition = faFilter;
  faList: IconDefinition = faList;

  constructor() { }

  ngOnInit(): void 
  {  
    
  }

  ngOnDestroy(): void {
  }

}
