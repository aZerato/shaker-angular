import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';

import { MovementService } from '../services/movement.service';
import { Movement } from '../models/movement.model';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MovementResolverService implements Resolve<Movement> {

    constructor(
        private _router: Router,
        private _movementService: MovementService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
            Movement | Observable<Movement> | Promise<Movement> 
    {
        return this._movementService.getMovementByGuid(route.params['guid'])
                    .pipe(map(movement => {
                        if (movement)
                        {
                            return movement;
                        }
                        else
                        {
                            this._router.navigate(['/movement']);
                            return null;
                        }
                    },
                    error => {
                        this._router.navigate(['/movement']);
                        return null;
                    }));
    }

}