import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { BaseServerService } from 'src/app/shared/services/base-server.service';

import { Channel } from '../models/channel.model';

@Injectable({
    providedIn: 'root'
})
export class ChannelService extends BaseServerService<Channel> 
{
    constructor(
        httpClient: HttpClient) 
    {
        super(httpClient, environment.backend.routes.channels);
    }

    getMessages(id: number): Observable<Channel> {
        return this._httpClient
                .get<Channel>(this._apiUrl, 
                {
                        params: { 
                            id: id.toString(),
                            msgs: "true"
                        }
                });
    }
    
    createBaseObject() {
        const ch = new Channel();
        ch.name = "Channel " + Date.now().toString();
        return ch;
    }


}