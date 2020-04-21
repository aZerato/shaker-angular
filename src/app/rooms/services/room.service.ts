import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Room } from '../models/room.model';
import { UserChat } from '../models/user-chat.model';
import { Message } from '../models/message.model';
import { AuthenticationService } from 'src/app/users/services/authentication.service';

@Injectable({
 providedIn: 'root'
})
export class RoomService
{
    private rooms: Room[] = [];

    constructor(private authicationServication: AuthenticationService) { }

    private getCurrentUser(): UserChat {
        const user = this.authicationServication.getUserConnected();
        return new UserChat(user.key, user.name, user.fullname, user.imgPath, '');
    }

    getAllRooms(): Observable<Room[]> {
        return of(this.rooms);
    }

    getRoomByGuid(guid: string): Room {
        return this.rooms.find(room => room.guid === guid);
    }

    addRoom(): string {
        const guid = Date.now().toString();
        
const messageBot = new Message("Hello", 
                        new UserChat("Bot", 
                            "Bot", 
                            "Bot", 
                            "https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=Acir9Xn4", 
                            "bot"),
                            false,
                            '');

        this.rooms.push(new Room(
            guid,
            'Conversation',
            [this.getCurrentUser()],
            [messageBot], 
            ''
        ));

        return guid;
    }

    addMessage(room: Room, content: string): void {
        const user = this.getCurrentUser();
        const message = new Message(content, user, true, 'ok');
        this.getRoomByGuid(room.guid).messages.push(message);
    }
}