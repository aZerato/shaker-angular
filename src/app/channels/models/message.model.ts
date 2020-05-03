import { BaseEntity, IBaseEntity } from 'src/app/shared/models/base-entity.model';

export class Message extends BaseEntity implements IBaseEntity
{
    userId: string;
    channelId: string;
    type: string = "Message";
    content: string;
}