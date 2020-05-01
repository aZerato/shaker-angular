import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseServerService } from 'src/app/shared/services/base-server.service';
import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { environment } from 'src/environments/environment';

import { Message } from '../models/message.model';

@Injectable({
    providedIn: 'root'
})
export class MessageService extends BaseServerService<Message> 
{
    constructor(
        httpClient: HttpClient,
        authService: AuthenticationService) 
    {
        super(httpClient, authService, environment.backend.routes.messages);
    }
    
    createBaseObject() {
        const msg = new Message();
        msg.content = "Hey " + Date.now().toString();
        return msg;
    }
}