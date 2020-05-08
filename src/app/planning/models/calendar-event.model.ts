import { IBaseEntity, BaseEntity } from 'src/app/shared/models/base-entity.model';

export class CalendarEventTypeModel extends BaseEntity implements IBaseEntity 
{    
    title: string;
};

export class CalendarEventModel extends BaseEntity implements IBaseEntity
{
    id: string;
    start: Date;
    end?: Date;
    title: string;
    type: CalendarEventTypeModel;
    hexColor: string;
    allDay?: boolean;

    constructor(
        start: Date,
        title: string,
        type: CalendarEventTypeModel,
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
        this.hexColor = hexColor;
        this.allDay = allDay;
    }
}
