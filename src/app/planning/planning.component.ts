import { Component, OnInit } from '@angular/core';

import { 
  faCalendar,
  faFilter,
  faDumbbell, 
  IconDefinition, 
  faList 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-planning',
  templateUrl: './planning.component.html'
})
export class PlanningComponent implements OnInit 
{
  faCalendar: IconDefinition = faCalendar;
  faFilter: IconDefinition = faFilter;
  faDumbbell: IconDefinition = faDumbbell;
  faList: IconDefinition = faList;

  constructor() { }

  ngOnInit(): void 
  {  
    
  }

  ngOnDestroy(): void {
  }

}
