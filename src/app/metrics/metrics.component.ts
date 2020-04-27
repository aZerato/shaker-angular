import { Component, OnInit } from '@angular/core';

import { 
  faSquareRootAlt,
  faPlusSquare,
  faCalendarPlus,
  faFilter,
  IconDefinition, 
  faList 
} from '@fortawesome/free-solid-svg-icons';

import { MetricTypeService } from './services/metric-type.service';
import { MetricType } from './models/metric-type.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit 
{
  faSquareRootAlt: IconDefinition = faSquareRootAlt;
  faPlusSquare: IconDefinition = faPlusSquare;
  faCalendarPlus: IconDefinition = faCalendarPlus;
  faFilter: IconDefinition = faFilter;
  faList: IconDefinition = faList;

  metricTypes: MetricType[];

  private _getAllSub: Subscription;

  constructor(
    private _metricsTypeService: MetricTypeService
  ) { }

  ngOnInit(): void 
  {  
    this._getAllSub =
      this._metricsTypeService
        .getAllEntitiesObs()
        .subscribe((metricTypes: MetricType[]) => {
          this.metricTypes = metricTypes;
        });
  }

  ngOnDestroy(): void {
    this._getAllSub.unsubscribe();
  }

  onCreateMetricType(): void {
    this._metricsTypeService.addEntity();
  }
}
