import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/users/services/authentication.service';

import { UserChat } from '../models/user-chat.model';
import { UserModel } from 'src/app/shared/models/user.model';

@Injectable({
 providedIn: 'root'
})
export class UserChatService
{
    constructor(private authenticationService: AuthenticationService) { }

    getCurrentUser(): UserChat {
        const user = this.authenticationService.getUserConnected();
        return new UserChat(user);
    }

    getUserChat(userGuid: string): Observable<UserChat> 
    {
        if (userGuid === this.botGuid) return this.botUserChat;

        return this.authenticationService
            .getUserByGuid(userGuid)
            .pipe<UserChat>(
                map((user: UserModel) => {
                    return new UserChat(user);
                })
            );
    }

    private botGuid = "bot";
    private userBot = new UserModel(
        "Bot", 
        "Bot",
        "password",
        "Botty", 
        "/assets/img/bot-avatar.png")
        .setGuid(this.botGuid);

    userChatBot:UserChat = new UserChat(this.userBot);

    botUserChat: Observable<UserChat> = of(this.userChatBot);
}