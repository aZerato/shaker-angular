import { Injectable, OnDestroy } from '@angular/core';
import { 
  HubConnection, 
  HubConnectionBuilder, 
  HubConnectionState,
  LogLevel, 
  HttpTransportType } from '@microsoft/signalr';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import { Subscription, Subject } from 'rxjs';
import { AuthenticationService } from 'src/app/users/services/authentication.service';
import { Bearer } from 'src/app/users/models/bearer.model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService implements OnDestroy
{
  public connectionEstablished = new Subject<boolean>();
  public startConnectionTimeoutDelay: number = 3000;
  public autoReconnect: boolean = true;
  public maxAttempts: number = 10; 
  private _connectionIsEstablished: boolean = false;
  private _hubConnection: HubConnection;

  private connectedSubscription: Subscription;

  constructor(private _authService: AuthenticationService)
  {
  }

  createConnection(huburl: string, autoReconnect: boolean = false)
  {
    if (!this._hubConnection)
    {

      this._authService.getToken().subscribe((bearer: Bearer) => 
      {
        let hubConnectionBuilder: HubConnectionBuilder = new HubConnectionBuilder();
        hubConnectionBuilder.withUrl(huburl,{
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
          accessTokenFactory: () => bearer.token
        });
        hubConnectionBuilder.withHubProtocol(new MessagePackHubProtocol());
        hubConnectionBuilder.configureLogging(LogLevel.Information);
        
        this.autoReconnect = autoReconnect;
        if (this.autoReconnect)
        {
          hubConnectionBuilder.withAutomaticReconnect([0, 1000, 1000, 1000, 1000, 1000, 2000, 5000, 10000, 20000, 30000, null]);
        }

        this._hubConnection = hubConnectionBuilder.build();
        
        this._hubConnection.keepAliveIntervalInMilliseconds = 10000;
        
        this.hubConnection.onclose((msg) =>
        {
          console.log(msg.message);
          this.startConnection();
        });

        this.hubConnection.onreconnected((connectionId: string) =>
        {
          if (this.maxAttempts-- == 0)
          { 
            this.hubConnection.stop();
            return;
          }
          
          this.hubConnection.on("RegisterConnection", (userId: string) => {
            console.log(`It's ok the connection registered for user ${userId} a new time !`);
          });
        });

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

          this.hubConnection.on("RegisterConnection", (userId: string) => {
            console.log(`Connection Registered for user ${userId}`);
          });
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
    this._hubConnection.stop();
  }
}  