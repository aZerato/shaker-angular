import { BaseEntity, IBaseEntity } from 'src/app/shared/models/base-entity.model';

export class MovementModel extends BaseEntity implements IBaseEntity
{
    id: string;
    name: string;
    description: string;
    movementTypeId: string;
    imgPath: string;

    constructor(name: string) 
    {
        super();
        
        this.name = name;
        this.imgPath = "./assets/img/bot-avatar.png";
    }
}