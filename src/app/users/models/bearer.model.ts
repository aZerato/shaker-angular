import { JSONSchema } from '@ngx-pwa/local-storage';

import { User } from 'src/app/shared/models/user.model';

export const bearerSchema:JSONSchema = {
    type: 'object',
    properties: {
        token: { type: 'string' },
        userId: { type: 'integer' },
    },
    required: [
        'token',
        'userId'
    ]
};

export const bearerKey:string = 'Bearer';

export class Bearer
{
    userId: number;
    token:string;
    
    constructor(user: User)
    {
        this.userId = user.id;
        this.token = user.token;
    }
}