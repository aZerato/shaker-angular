import { JSONSchema } from '@ngx-pwa/local-storage';

export class UserModel
{
    static schema: JSONSchema = {
        type: 'object',
        properties: {
            key: { type: 'string' },
            name: { type: 'string' },
            fullname: { type: 'string' },
            imgPath: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
        },
        required: [
            'key',
            'email', 
            'password'
        ],
    };
    
    key: string;
    name: string;
    fullname: string;
    imgPath: string;
    email: string;
    password: string;

    constructor(name: string, email: string, password: string, fullname?: string, imgPath?: string)
    {
        this.key = email;
        this.name = name;
        this.email = email;
        this.password = password;

        this.fullname = fullname ?? '';
        this.imgPath = imgPath ?? './assets/img/avatar.png';
    }
}