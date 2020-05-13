import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BaseServerService } from 'src/app/shared/services/base-server.service';

import { 
    CalendarEventModel
} from '../models/calendar-event.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PlanningService extends BaseServerService<CalendarEventModel>
{
    constructor(
        httpClient: HttpClient) 
    {
        super(httpClient, environment.backend.routes.planning);
    }

    getAllFromTo(from: Date, to: Date, typeId: string): Observable<CalendarEventModel> {
        let url = `${this._apiUrl}/from/${from}`;

        if (to)
            url += `/${to}`;

        if (typeId)
            url += `/${typeId}`;

        return this._httpClient
                .get<CalendarEventModel>(url);
    }

    createBaseObject() {
        return new CalendarEventModel(new Date(), 'New Event', null);
    }
}