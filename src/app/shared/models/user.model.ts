import { JSONSchema, JSONSchemaArray } from '@ngx-pwa/local-storage';
import { BaseEntity, IBaseEntity } from './base-entity.model';

export const userSchema:JSONSchema = {
    type: 'object',
    properties: {
        guid: { type: 'string' },
        name: { type: 'string' },
        fullname: { type: 'string' },
        imgPath: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
    },
    required: [
        'guid',
        'email', 
        'password'
    ]
};

export const usersKey:string = 'Users';
export const usersSchemaArr:JSONSchemaArray = {
    type: 'array',
    items: userSchema
};

export class UserModel extends BaseEntity implements IBaseEntity
{   
    name: string;
    fullname: string;
    imgPath: string;
    email: string;
    password: string;

    constructor(name: string, email: string, password: string, fullname?: string, imgPath?: string)
    {
        super();
        
        this.name = name;
        this.email = email;
        this.password = password;

        this.fullname = fullname ?? '';
        this.imgPath = imgPath ?? './assets/img/avatar.png';
    }

    setGuid(guid: string) : UserModel {
        this.guid = guid;
        return this;
    }
}