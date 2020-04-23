import { UserModel } from 'src/app/shared/models/user.model';

export class UserChat {
    guid: string;
    name: string;
    fullname: string;
    imgPath: string;
    surname: string;

    constructor(user: UserModel) 
    {
        this.guid = user.guid;
        this.name = user.name;
        this.fullname = user.fullname;
        this.imgPath = user.imgPath;
    }
}