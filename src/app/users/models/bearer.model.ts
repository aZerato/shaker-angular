import { JSONSchema } from '@ngx-pwa/local-storage';

import { User } from 'src/app/shared/models/user.model';

export const bearerSchema:JSONSchema = {
    type: 'object',
    properties: {
        token: { type: 'string' },
    },
    required: [
        'token'
    ]
};

export const bearerKey:string = 'Bearer';

export class BearerModel
{
    token:string;
    
    constructor(user: User)
    {
        this.token = user.token;
    }
}