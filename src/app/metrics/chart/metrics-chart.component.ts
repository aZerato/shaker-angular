import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { MetricService } from '../services/metric.service';
import { Metric } from '../models/metric.model';
import { MetricTypeService } from '../services/metric-type.service';
import { MetricType } from '../models/metric-type.model';

@Component({
  selector: 'app-metrics-chart',
  templateUrl: './metrics-chart.component.html'
})
export class MetricsChartComponent implements OnInit 
{
  view: any[] = [700, 300];
  
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Weight';
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;

  metricsGraphDatas: MetricsGraphData[];

  private _getAllSub: Subscription;

  constructor(
    private _metricService: MetricService,
    private _metricTypeService: MetricTypeService
  ) { }

  ngOnInit(): void 
  {  
    
    
    this._getAllSub = 
      this._metricTypeService
        .getAllEntitiesObs()
        .subscribe((metricTypes: MetricType[]) => 
        {    
          this.metricsGraphDatas = [];
          metricTypes.forEach(metric => {
            const metricsGraphData = new MetricsGraphData();
            metricsGraphData.name = metric.name;
            for (let index = 0; index < 20; index++) 
            {
              const value = Math.floor(Math.random() * Math.floor(150));
              metricsGraphData.series.push({ name: index.toString(), value: value});
            }
            this.metricsGraphDatas.push(metricsGraphData);
          })
        });
  }

  ngOnDestroy(): void {
   // this._getAllSub.unsubscribe();
  }
}

class MetricsGraphData {
  name: string;
  series: { name: string, value: number }[] = [];
}
