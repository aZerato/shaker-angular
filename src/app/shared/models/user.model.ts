export class UserModel
{
    guid: string;
    name: string;
    fullname: string;
    imgPath: string;
    email: string;

    constructor(guid: string, name: string, fullname: string, imgPath: string, email: string)
    {
        this.guid = guid;
        this.name = name;
        this.fullname = fullname;
        this.imgPath = imgPath;
        this.email = email;
    }
}