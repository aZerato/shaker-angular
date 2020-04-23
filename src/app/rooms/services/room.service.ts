import { Injectable } from '@angular/core';

import { Observable, Subject, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { StorageMap } from '@ngx-pwa/local-storage';

import { Room, roomsKeyArr, roomsSchemaArr } from '../models/room.model';
import { UserChat } from '../models/user-chat.model';
import { Message, messagesKeyArr, messagesSchemaArr } from '../models/message.model';
import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { UserModel } from 'src/app/shared/models/user.model';

@Injectable({
 providedIn: 'root'
})
export class RoomService
{
    constructor(private storageMap: StorageMap,
        private authicationService: AuthenticationService) { }

    private getCurrentUser(): UserChat {
        const user = this.authicationService.getUserConnected();
        return new UserChat(user);
    }

    getAllRooms(): Observable<Room[]> {
        return this.storageMap
            .get<Room[]>(roomsKeyArr, roomsSchemaArr);
    }

    getRoomByGuid(guid: string): Observable<Room> {
        return this.getAllRooms()
            .pipe<Room>(
                map((rooms: Room[]) => {
                    const room = rooms.find(room => room.guid === guid);

                    Room.prepareGet(room);
                    room.messages$ = this.getMessagesOfRoom(guid);
                    
                    return room;
                })
            );
    }

    getMessagesOfRoom(roomGuid: string): Observable<Message[]> 
    {
        const user:UserChat = this.getCurrentUser();

        return this.getAllMessages(roomGuid)
            .pipe<Message[]>(
                map((messages: Message[]) => {
                    
                    let msgs = messages?.filter(msg => msg.roomGuid === roomGuid);
                    
                    if (!msgs) {
                        return [];
                    }

                    msgs.forEach(msg => {
                        msg.isCurrentUser = user.guid === msg.userGuid; 
                        msg.userChat$ = this.getUserChat(msg.userGuid);
                    });

                    return msgs;
                })
            );
    }

    getUserChat(userGuid: string): Observable<UserChat> 
    {
        if (userGuid === this.botGuid) return this.botUserChat();

        return this.authicationService
            .getUserByGuid(userGuid)
            .pipe<UserChat>(
                map((user: UserModel) => {
                    return new UserChat(user);
                })
            );
    }

    getAllMessages(roomGuid: string): Observable<Message[]> 
    {
        return this.storageMap
            .get<Message[]>(
                `${messagesKeyArr}_${roomGuid}`,
                messagesSchemaArr
            ).pipe<Message[]>(
                map((messages: Message[]) => {
                    return messages?.filter(msg => msg.roomGuid === roomGuid);
                })
            );
    }

    roomAdded: Subject<Room> = new Subject<Room>();
    addRoom(): void 
    {
        const room = new Room(
            'Conversation',
            [this.getCurrentUser()]
        );
        
        this.addDefaultBotMessage(room.guid);

        this.getAllRooms()
            .subscribe((rooms: Room[]) => 
                {
                    const roomSave = room.prepareSave(room);
                    if (!rooms) rooms = [];
                    rooms.push(roomSave);
                    this.storageMap.set(
                        roomsKeyArr,
                        rooms,
                        roomsSchemaArr)
                        .subscribe(() => {
                            this.roomAdded.next(room);
                        });
                });
    }

    messageAdded: Subject<Message[]> = new Subject<Message[]>();
    addMessage(roomGuid: string, content: string): void {
        const user = this.getCurrentUser();
        const message = new Message(content, roomGuid, user.guid, true, 'ok');

        this.getAllMessages(roomGuid)
            .subscribe((messages: Message[]) => 
            {
                const msgSave = message.prepareSave(message);
                if (!messages) messages = [];
                messages.push(msgSave);
                this.storageMap.set(
                    `${messagesKeyArr}_${roomGuid}`,
                    messages,
                    messagesSchemaArr)
                    .subscribe(() => {
                        messages.forEach(msg => {
                            msg.isCurrentUser = user.guid === msg.userGuid; 
                            msg.userChat$ = this.getUserChat(msg.userGuid);
                        });
                        this.messageAdded.next(messages);
                    });
            });
    }

    private addDefaultBotMessage(roomGuid: string): void 
    {
        const message = new Message("Hello",
                        roomGuid, 
                        'bot',
                        false,
                        '');
        message.userChat$ = this.botUserChat();
        
        this.getAllMessages(roomGuid)
        .subscribe((messages: Message[]) => 
        {
            const msgSave = message.prepareSave(message);
            messages = [];
            messages.push(msgSave);
            this.storageMap.set(
                `${messagesKeyArr}_${roomGuid}`,
                messages,
                messagesSchemaArr)
                .subscribe(() => {
                    this.messageAdded.next(messages);
                });
        });
    }

    private botGuid = "bot";
    private userBot = new UserModel(
        "Bot", 
        "Bot",
        "password",
        "Botty", 
        "https://www.bounteous.com/sites/default/files/styles/insights_preview_image/public/insights/2018-10/previews/Understanding%20Bot%20and%20Spider%20Filtering%20from%20Google%20Analytics.jpg?itok=Acir9Xn4")
        .setGuid(this.botGuid);

    private userChatBot:UserChat = new UserChat(this.userBot);

    private botUserChat(): Observable<UserChat> {
        return of(this.userChatBot);
    }
}