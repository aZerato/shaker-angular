import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IBaseEntity } from '../models/base-entity.model';
import { BaseServerService } from '../services/base-server.service';

export class BaseServerResolverService<TBaseEntity extends IBaseEntity> 
            implements Resolve<TBaseEntity> 
{

    private _router: Router;
    private _baseService: BaseServerService<TBaseEntity>;
    private _defaultRoute: string;

    constructor(router: Router,
        baseService: BaseServerService<TBaseEntity>,
        defaultRoute: string) 
        { 
            this._router = router;
            this._baseService = baseService;
            this._defaultRoute = defaultRoute;
        }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
            TBaseEntity | Observable<TBaseEntity> | Promise<TBaseEntity> 
    {
        return this._baseService
                    .getEntityById(route.params['id'])
                    .pipe<TBaseEntity>(map((entity: TBaseEntity) => {
                        if (entity)
                        {
                            return entity;
                        }
                        else
                        {
                            this._router.navigate([this._defaultRoute]);
                            return null;
                        }
                    },
                    error => {
                        this._router.navigate([this._defaultRoute]);
                        return null;
                    }));
    }

}