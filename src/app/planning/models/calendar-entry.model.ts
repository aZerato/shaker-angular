import { IBaseEntity, BaseEntity } from 'src/app/shared/models/base-entity.model';

import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';

export const calendarEntrySchema:JSONSchema = {
    type: 'object',
    properties: {
        guid: { type: 'string' },
        start: { type: 'string' },
        end: { type: 'string' },
        title: { type: 'string' },
        type: { type: 'string' },
        typeLinkGuid: { type: 'string' },
        hexColor: { type: 'string' },
        allDay: { type: 'boolean' }
    },
    required: [
        'guid',
        'start',
        'title',
        'type',
        'hexColor'
    ]
};

export const calendarEntriesKeyArr:string = "Calendar";
export const calendarEntriesSchemaArr:JSONSchemaArray = {
    type: 'array',
    items: calendarEntrySchema
};

export enum CalendarEntryTypes {
    event,
    training,
    metric
};

export class CalendarEntry extends BaseEntity implements IBaseEntity 
{
    start: Date;
    end?: Date;
    title: string;
    type: CalendarEntryTypes;
    typeLinkGuid: string;
    hexColor: string;
    allDay?: boolean;
    
    constructor(
        start: Date,
        title: string,
        type: CalendarEntryTypes,
        typeLinkGuid?: string,
        end?: Date,
        hexColor?: string,
        allDay?: boolean
    ) 
    {
        super();

        this.start = start;
        this.end = end;
        this.title = title;
        this.type = type;
        this.typeLinkGuid = typeLinkGuid;
        this.hexColor = hexColor;
        this.allDay = allDay;
    }
}