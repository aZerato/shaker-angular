export class UserChat {
    guid: string;
    name: string;
    fullname: string;
    imgPath: string;
    surname: string;

    constructor(guid: string, name: string, fullname: string, imgPath: string, surname: string) 
    {
        this.guid = guid;
        this.name = name;
        this.fullname = fullname;
        this.imgPath = imgPath;
        this.surname = surname;
    }
}