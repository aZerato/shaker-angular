import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { TrainingService } from '../services/trainings.service';
import { Training } from '../models/training.model';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TrainingResolverService implements Resolve<Training> {

    constructor(
        private _router: Router,
        private _trainingService: TrainingService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
            Training | Observable<Training> | Promise<Training> 
    {
        return this._trainingService
                    .getEntityByGuid<Training>(route.params['guid'])
                    .pipe(map(training => {
                        if (training)
                        {
                            return training;
                        }
                        else
                        {
                            this._router.navigate(['/training']);
                            return null;
                        }
                    },
                    error => {
                        this._router.navigate(['/training']);
                        return null;
                    }));
    }

}