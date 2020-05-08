import { Component, 
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';

import { Subject } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import {
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';

import {
  CalendarEventModelMerge,
  PlanningFactory
} from '../models/planning.factory';
import { PlanningService } from '../services/planning.service';
import { CalendarEventModel } from '../models/calendar-event.model';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit
{
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEventModelMerge;
  };

  refresh: Subject<any> = new Subject();

  events: CalendarEventModelMerge[] = [];

  activeDayIsOpen: boolean = true;

  constructor(
    private _planningService: PlanningService,
    private _modal: NgbModal) {}

    ngOnInit(): void
    {
      this._planningService
      .getAllEntitiesObs()
      .subscribe((events: CalendarEventModel[]) => {
        this.events = PlanningFactory.convertCalendarEventServersToLib(events, this);
        this.refresh.next();
      });
    }

  dayClicked({ date, events }: { date: Date; events: CalendarEventModelMerge[] }): void 
  {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEventModelMerge): void {
    this.modalData = { event, action };
    this._modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEventModelMerge) 
  {
    this._planningService.deleteEntity(eventToDelete.meta);

    this._planningService.entityDeletedSub.subscribe(() => {
      this.events = this.events.filter((event) => event !== eventToDelete);
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
