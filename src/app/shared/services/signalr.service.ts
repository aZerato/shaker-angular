import { Injectable, OnDestroy } from '@angular/core';
import { 
  HubConnection, 
  HubConnectionBuilder, 
  HubConnectionState, 
  IHubProtocol, 
  LogLevel, 
  HttpTransportType } from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import { Subscription, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService implements OnDestroy
{
  public connectionEstablished = new Subject<boolean>();
  public startConnectionTimeoutDelay: number = 3000;
  public protocol: IHubProtocol = new MessagePackHubProtocol();
  public autoReconnect: boolean = true;

  private _userId: number = 0;
  private _connectionIsEstablished: boolean = false;
  private _hubConnection: HubConnection;

  private connectedSubscription: Subscription;

  constructor()
  {
  }

  createConnection(huburl: string, userId: number)
  {
    this._userId = userId;

    if (!this._hubConnection && this._userId > 0)
    {
      let hubConnectionBuilder: HubConnectionBuilder = new HubConnectionBuilder();

      hubConnectionBuilder.withUrl(huburl,{
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      });
      hubConnectionBuilder.withHubProtocol(this.protocol);
      hubConnectionBuilder.configureLogging(LogLevel.Information);

      if (this.autoReconnect)
      {
        hubConnectionBuilder.withAutomaticReconnect([0, 1000, 1000, 1000, 1000, 1000, 2000, 5000, 10000, 20000, 30000, null]);
      }

      this._hubConnection = hubConnectionBuilder.build();

      this.hubConnection.onclose((msg) =>
      {
        console.log(msg.message);
        this.startConnection();
      });

      this.hubConnection.onreconnected((connectionId: string) =>
      {
        this.hubConnection.invoke("RegisterConnection", this._userId)
      });
    }
  }

  startConnection()
  {
    if (this._hubConnection.state == HubConnectionState.Disconnected)
    {
      this._hubConnection
        .start()
        .then(() =>
        {
          this._connectionIsEstablished = true;
          console.log('Hub connection started');
          this.connectionEstablished.next(true);

          this.hubConnection.invoke("RegisterConnection", this._userId);
        })
        .catch(err =>
        {
          this._connectionIsEstablished = false;
          console.log('Error while establishing connection, retrying...');

          setTimeout(() =>
          {
            this.startConnection();
          }, this.startConnectionTimeoutDelay);
        });
    }
  }

  // ...args: any[] allows you to pass any number of arguments
  run(method: string, ...args: any[])
  {
    switch (this.hubConnection.state)
    {
      case HubConnectionState.Connected: ;
        this.hubConnection.invoke(method, ...args);
        break;
      case HubConnectionState.Connecting:
        this.connectedSubscription = this.connectionEstablished.subscribe((data: any) =>
        {
          this.hubConnection.invoke(method, ...args);

          this.connectedSubscription.unsubscribe();
        });
        break;
      default:
        this.hubConnection.start()
          .then(() =>
          {
            this.hubConnection.invoke(method, args)

            this.hubConnection.invoke("RegisterConnection", this._userId);
          })
          .catch(err => console.error(err.toString()));
        break;
    }
  }

  get connectionIsEstablished(): boolean
  {
    return this._connectionIsEstablished;
  }

  get hubConnection(): HubConnection
  {
    return this._hubConnection;
  }

  ngOnDestroy()
  {   
    this.connectedSubscription?.unsubscribe();
  }
}  