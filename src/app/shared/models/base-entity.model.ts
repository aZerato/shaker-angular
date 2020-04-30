export class BaseEntity implements IBaseEntity
{   
    id: number;
    creation: string;
    error: string;
}

export interface IBaseEntity {
    id: number;
    creation: string;
    error: string;
}