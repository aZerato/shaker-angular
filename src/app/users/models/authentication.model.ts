import { JSONSchema } from '@ngx-pwa/local-storage';

export class AuthenticationModel
{
    static staticKey() { 
        return 'authenticatedUser'; 
    }

    static schema: JSONSchema = {
        type: 'object',
        properties: {
            date: { type: 'string' },
            email: { type: 'string' }
        },
        required: [
            'date',
            'email'
        ]
    };

    private date: string;
    email: string;
    password: string;
    rememberMe: boolean;

    constructor(email: string, password: string, rememberMe: boolean)
    {
        this.date = Date.now().toString();
        this.email = email;
        this.password = password;
        this.rememberMe = rememberMe;
    }

    prepareSave() {
        delete this.password;
        delete this.rememberMe;
    }
}