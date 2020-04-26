export class BaseEntity implements IBaseEntity
{   
    guid: string;

    constructor()
    {
        this.guid = Date.now().toString();
    }
}

export interface IBaseEntity {
    guid: string;
}