import { BaseEntity, IBaseEntity } from 'src/app/shared/models/base-entity.model';

export class Message extends BaseEntity implements IBaseEntity
{
    channelId: number;
    
    userId: number;
    
    content: string;
    date: string;

    type: string = "Message";
}