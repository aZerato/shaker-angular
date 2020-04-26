import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Observable, EMPTY } from 'rxjs';

import { ChannelService } from '../services/channel.service';
import { Channel } from '../models/channel.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ChannelResolverService implements Resolve<Channel> {

    constructor(
        private router: Router,
        private channelService: ChannelService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
        Channel | Observable<Channel> | Promise<Channel> 
    {
        return this.channelService.getEntityByGuid<Channel>(route.params['guid'])
                    .pipe(map(channel => {
                        if (channel)
                        {
                            return channel;
                        }
                        else
                        {
                            this.router.navigate(['/channel']);
                            return null;
                        }
                    },
                    error => {
                        this.router.navigate(['/channel']);
                        return null;
                    }));
    }

}