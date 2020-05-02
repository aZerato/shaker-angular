import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';

@Injectable({
  providedIn: 'root'
})
export class SignalRService 
{
  private _hubConnection: signalR.HubConnection;

  public connect(url: string): signalR.HubConnection
  {
    this._hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl(url, {
                              skipNegotiation: true,
                              transport: signalR.HttpTransportType.WebSockets
                            })
                            .withHubProtocol(new MessagePackHubProtocol())
                            .withAutomaticReconnect()
                            .configureLogging(signalR.LogLevel.Debug)
                            .build();

    this._hubConnection
      .start()
      .then(() => { 
        console.log('Hub connection started');
      })
      .catch(err => {
        console.log('Error while starting connection: ' + err);
      });

    return this._hubConnection;
  }
}