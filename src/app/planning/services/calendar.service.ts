import { StorageMap } from '@ngx-pwa/local-storage';

import { BaseService } from 'src/app/shared/services/base.service';

import { 
    CalendarEntry, 
    calendarEntriesKeyArr, 
    calendarEntriesSchemaArr, 
    CalendarEntryTypes 
} from '../models/calendar-entry.model';

export class CalendarService extends BaseService<CalendarEntry>
{
    constructor(
        storageMap: StorageMap) {
        super(storageMap, calendarEntriesKeyArr, calendarEntriesSchemaArr);
    }

    createBaseObject() {
        return new CalendarEntry(new Date(), 'New Event', CalendarEntryTypes.event);
    }
}