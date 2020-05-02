import { Observable, Subject, Observer, interval } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { takeWhile, share, distinctUntilChanged } from 'rxjs/operators';

export class WebSocketService<T> extends Subject<T> 
{
  private reconnectionObservable: Observable<number>;
  private wsSubjectConfig;
  private socket: WebSocketSubject<any>;
  private connectionObserver: Observer<boolean>;
  public connectionStatus: Observable<boolean>;

  constructor(
    private url: string,
    private reconnectInterval: number = 5000,
    private reconnectAttempts: number = 10,
  ) {
    super();

    this.connectionStatus = new Observable((observer: Observer<boolean>) => {
      this.connectionObserver = observer;
    }).pipe(
      share(),
      distinctUntilChanged()
    );

    this.wsSubjectConfig = {
      url: this.url,
      closeObserver: {
        next: (_e: CloseEvent) => {
          this.socket = null;
          this.connectionObserver.next(false);
        }
      },
      openObserver: {
        next: (_e: Event) => {
          this.connectionObserver.next(true);
        }
      },
      resultSelector: (e: MessageEvent) => {
        return e.data;
      }
    };

    this.connect();

    this.connectionStatus.subscribe((isConnected) => {
      if (!this.reconnectionObservable && typeof(isConnected) === 'boolean' && !isConnected) {
        this.reconnect();
      }
    });
  }

  connect(): void {
    this.socket = new WebSocketSubject(this.wsSubjectConfig);
    this.socket.subscribe(
      (m) => {
        this.next(m);
      },
      (_error: Event) => {
        if (!this.socket) {
          this.reconnect();
        }
      });
  }

  reconnect(): void {
    this.reconnectionObservable = interval(this.reconnectInterval)
      .pipe(
        takeWhile((_v, index) => {
          return index < this.reconnectAttempts && !this.socket;
        })
      );
    this.reconnectionObservable.subscribe(
      () => {
        if(this.isStopped) return;
        this.connect();
      },
      null,
      () => {
        this.reconnectionObservable = null;
        if (!this.socket) {
          this.complete();
          this.connectionObserver.complete();
        }
      });
  }

  send(data: any): void {
    this.socket.next(data);
  }
}