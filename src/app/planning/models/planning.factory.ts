import { CalendarEventModel, CalendarEventTypeModel } from './calendar-event.model';

import {
    CalendarEvent
  } from 'angular-calendar';

import { EventColor, EventAction } from 'calendar-utils';

export class PlanningFactory 
{
    static convertCalendarEventServersToLib(servers: CalendarEventModel[]) : CalendarEventModelMerge[]
    {
        const merges = [];
        
        servers.forEach(server => {
            merges.push(PlanningFactory.convertCalendarEventServerToLib(server));
        });

        return  merges;
    }

    static convertCalendarEventServerToLib(server: CalendarEventModel) : CalendarEventModelMerge
    {
        const merge = new CalendarEventModelMerge();

        merge.id = server.id;
        merge.start = new Date(server.start);
        merge.end = server.end != null ? new Date(server.end) : null;
        merge.title = server.title;
        merge.allDay = server.allDay;

        merge.color = new EventColorMerge();
        merge.color.primary = server.hexColor;
        
        merge.meta = server;

        return  merge;
    }
}

export class CalendarEventModelMerge implements CalendarEvent<CalendarEventModel>
{
    id?: string | number;
    start: Date;
    end?: Date;
    title: string;
    color?: EventColor;
    actions?: EventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: { beforeStart?: boolean; afterEnd?: boolean; };
    draggable?: boolean;
    meta?: CalendarEventModel;  
}

export class EventColorMerge implements EventColor {
    primary: string;
    secondary: string;
}