import { CalendarEventModel, CalendarEventTypeModel } from './calendar-event.model';

import {
    CalendarEvent, CalendarEventAction
  } from 'angular-calendar';

import { EventColor, EventAction } from 'calendar-utils';
import { CalendarComponent } from '../calendar/calendar.component';

export class PlanningFactory 
{
    static convertCalendarEventServersToLib(servers: CalendarEventModel[], calendarComponentContext: CalendarComponent) : CalendarEventModelMerge[]
    {
        const merges = [];
        
        servers.forEach(server => {
            merges.push(PlanningFactory.convertCalendarEventServerToLib(server, calendarComponentContext));
        });

        return  merges;
    }

    static convertCalendarEventServerToLib(server: CalendarEventModel, calendarComponentContext: CalendarComponent) : CalendarEventModelMerge
    {
        const merge = new CalendarEventModelMerge();

        merge.id = server.id;
        merge.start = new Date(server.start);
        merge.end = server.end != null ? new Date(server.end) : null;
        merge.title = server.title;
        merge.allDay = server.allDay;

        merge.color = new EventColorMerge();
        merge.color.primary = server.hexColor;
        
        merge.actions = PlanningFactory.eventActions(calendarComponentContext);

        merge.meta = server;

        return  merge;
    }

    static eventActions(calendarComponentContext): CalendarEventAction[] 
    {
        return [
        {
          label: ' Edit ',
          a11yLabel: ' Edit ',
          onClick: ({ event }: { event: CalendarEventModelMerge }): void => {
            calendarComponentContext.handleEvent('Edited', event);
          },
        },
        {
          label: ' Delete ',
          a11yLabel: ' Delete ',
          onClick: ({ event }: { event: CalendarEventModelMerge }): void => {
            calendarComponentContext.events = calendarComponentContext.events.filter((iEvent) => iEvent !== event);
            calendarComponentContext.handleEvent('Deleted', event);
          },
        },
      ];
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