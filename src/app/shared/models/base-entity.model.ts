export class BaseEntity implements IBaseEntity
{   
    id: string;
    creation: string;
    error: string;
}

export interface IBaseEntity {
    id: string;
    creation: string;
    error: string;
}