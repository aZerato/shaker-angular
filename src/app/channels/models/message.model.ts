import { BaseEntity, IBaseEntity } from 'src/app/shared/models/base-entity.model';

export class Message extends BaseEntity implements IBaseEntity
{
    userId: number;
    channelId: number;
    type: string = "Message";
    content: string;

    constructor()
    {
        super();

        this.id = 0;
        this.userId = 0;
        this.channelId = 0;

        this.creation = Date.now().toString();
        this.error = "";
    }
}