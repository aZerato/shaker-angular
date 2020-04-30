import { BaseEntity, IBaseEntity } from 'src/app/shared/models/base-entity.model';

import { Message } from './message.model';

export class Channel extends BaseEntity implements IBaseEntity
{   
    name: string;
    description: string;
    imgPath: string;
    messages: Message[] = [];
}