import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { BaseServerService } from 'src/app/shared/services/base-server.service';

import { MovementModel } from '../models/movement.model';

@Injectable({
    providedIn: 'root'
})
export class MovementService extends BaseServerService<MovementModel>
{
    constructor(
        httpClient: HttpClient) 
    {
        super(httpClient, environment.backend.routes.movements);
    }

    getAllTypes(): Observable<MovementModel> {
        let url = `${this._apiUrl}/types`;

        return this._httpClient
                .get<MovementModel>(url);
    }

    getAllOfTypes(typeId: string): Observable<MovementModel> {
        let url = `${this._apiUrl}/types/${typeId}`;

        return this._httpClient
                .get<MovementModel>(url);
    }

    createBaseObject(): MovementModel {
        return new MovementModel('Your movement');
    }
}