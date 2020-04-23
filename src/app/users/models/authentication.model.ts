import { JSONSchema } from '@ngx-pwa/local-storage';
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

export class AuthenticationModel
{
    private date: string;
    guid: string;
    email: string;
    password: string;
    rememberMe: boolean;

    constructor(user: UserModel, rememberMe: boolean)
    {
        this.guid = user.guid;
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