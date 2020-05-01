import { BaseEntity, IBaseEntity } from './base-entity.model';

export class User extends BaseEntity implements IBaseEntity
{   
    userName: string;
    firstName: string; 
    name: string;
    email: string; 
    imgPath: string;
    token: string;
}