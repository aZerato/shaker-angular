import { JSONSchema } from '@ngx-pwa/local-storage';

import { BaseEntity } from 'src/app/shared/models/base-entity.model';

import { UserModel } from 'src/app/shared/models/user.model';

export const authenticationKey:string = 'authenticatedUser'; 

export const authenticationSchema: JSONSchema = {
    type: 'object',
    properties: {
        date: { type: 'string' },
        guid: { type: 'string' }
    },
    required: [
        'date',
        'guid'
    ]
};

export class AuthenticationModel extends BaseEntity
{
    private date: string;
    email: string;
    password: string;
    rememberMe: boolean;

    constructor(user: UserModel, rememberMe: boolean)
    {
        super();

        this.date = Date.now().toString();
        this.email = user.email;
        this.password = user.password;
        this.rememberMe = rememberMe;
    }

    prepareSave(): void
    {
        delete this.email;
        delete this.password;
        delete this.rememberMe;
    }
}