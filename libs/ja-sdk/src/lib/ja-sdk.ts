import {API_KEY_HEADER, SCRIPT_KEY} from "./consts";
import {Storage, StorageOptions} from './storage'
import {EventType} from "./event.type";

export interface WebsiteInfoOptions {
  domain: string;
  userArgent: string;
  title: string;
  screen: string;
}

export interface JaSdkOptions {
  userId?: string
  apiEndpoint?: string;
  apiKey: string;
  intervalSyncData?: number
  logging?: boolean;
}

export class JaSdk {
  apiEndpoint: string;
  apiKey: string;
  config: any;
  rrweb: any
  storageRREvent: Storage;
  storageEvent: Storage;
  intervalSyncData: number;
  intervalId?: any;
  websiteInfo?: WebsiteInfoOptions;
  sessionId?: string;
  enableReplay: boolean;
  logging?: boolean;
  userId?: string | null;

  constructor(options?: JaSdkOptions & StorageOptions) {
    this.apiEndpoint = options?.apiEndpoint ?? this.getAttribute(SCRIPT_KEY.API_ENDPOINT) ?? 'https://ja-measurement.wolfx.app';
    if (!options?.apiKey && !this.getAttribute(SCRIPT_KEY.API_KEY)) {
      throw new Error('Api Key not found');
    }
    this.apiKey = options?.apiKey ?? this.getAttribute(SCRIPT_KEY.API_KEY) ?? '';
    this.intervalSyncData = options?.intervalSyncData ?? parseInt(this.getAttribute(SCRIPT_KEY.INTERVAL_SYNC_DATA) ?? '5000');

    this.storageRREvent = new Storage({
      dbName: options?.dbName ?? this.getAttribute(SCRIPT_KEY.DB_NAME),
      storeName: this.getAttribute(SCRIPT_KEY.STORE_RR_EVENT) ?? 'rr-events'
    });
    this.storageEvent = new Storage({
      dbName: this.getAttribute(SCRIPT_KEY.DB_NAME),
      storeName: this.getAttribute(SCRIPT_KEY.STORE_EVENT) ?? 'events'
    });

    this.enableReplay = false;
    this.userId = options?.userId ?? this.getAttribute(SCRIPT_KEY.USER_ID);
    this.logging = this.getAttribute(SCRIPT_KEY.LOGGING) == 'true';

    // advancedThrottle(() => this.init(), 300, {leading: true})();
    this.init()
  }

  async init() {
    await this.getConfig();

    // * detect original event
    /**
     * pageview
     * firstvisits
     */
    window.addEventListener("load", (event) => {
      this.log('location changed!');
      this.trackingEventPageView(EventType.page_view)
    })
    window.addEventListener("beforeunload", (event) => {
      this.log('location changed!');

      this.trackingEventPageView(EventType.session_end)
    })

    const pushState = history.pushState
    history.pushState = () => {
      // @ts-ignore
      pushState.apply(history, arguments);
      this.trackingEventPageView(EventType.page_view)
    }

    if (this.enableReplay) {
      this.rrweb = await import('rrweb');
      this.startRecording().then(() => {
        this.log('end recording session')
      })
      this.syncRecording().then(() => {
        this.log('end sync session data')
      })
    }
  }

  async trackingEventPageView(type: EventType) {
    if (this.sessionId) {
      const payload = {
        event: type,
        sessionId: this.sessionId,
        domain: this.websiteInfo?.domain,
        title: this.getTitle(),
        screen: window.location.pathname,
        referrer: document.referrer,
        lang: navigator.language,
        time: new Date().getTime()
      }

      await this.storageEvent.addEvent(payload)
    }
  }

  getHeaders(headers: any = {}) {
    if (this.apiKey) {
      headers[API_KEY_HEADER] = `JaKey${this.apiKey}`;
    }

    return headers;
  }

  async getConfig() {
    try {
      this.getWebsiteInfo();
      if (this.websiteInfo) {
        let params: any = {
          domain: this.websiteInfo?.domain,
          title: this.websiteInfo.title,
          screen: this.websiteInfo?.screen,
        }
        if (this.userId) {
          params.userId = this.userId;
        }
        const response = await fetch(
          `${this.apiEndpoint}/api/v1/project/config?` + new URLSearchParams(params).toString(),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-ja-api-key': `JaKey${this.apiKey}`
            },
            signal: AbortSignal.timeout(5000)
          }
        )
          .then(res => res.json())
          .catch((err) => {
            console.error(err)
          })
        this.sessionId = response.session
        this.sessionId = response.session
      }
    } catch (e) {
      this.log('err fetch config')
    }
  }

  async startRecording() {
    if (this.rrweb) {
      this.rrweb.record({
        emit: (event: any) => {
          // if (event.type !== 3) {
          this.storageRREvent.addEvent(event)
          // }
        },
        recordCanvas: false,
        sampling: {
          mousemove: 150,
          mouseInteraction: true,
          scroll: 200,
          input: 'last'
        },
        ignoreElements: (element: any) => {
          return (
            element.tagName === 'IFRAME'
            || element.tagName === 'VIDEO'
            || element.classList.contains('ignore-rr')
          )
        }
      });
    }
  }

  async syncRecording() {
    this.intervalId = setInterval(async () => {
      if (this.sessionId) {
        const events = await this.storageRREvent.getAllEvents();
        // console.log(events)

        if (events?.length > 0) {
          let attempts = 0;
          let success = false;
          while (attempts < 2 && !success) {
            try {
              const response = await fetch(
                `${this.apiEndpoint}/api/v1/event/collects`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-ja-api-key': `JaKey${this.apiKey}`
                  },
                  body: JSON.stringify({
                    sessionId: this.sessionId,
                    events
                  }),
                  signal: AbortSignal.timeout(1500)
                }
              )

              if (response.ok) {
                await this.storageRREvent.clearAllEvents()
                success = true;
                break;
              } else {
                console.error('Error when send data: ', response.statusText)

                await new Promise((res) => setTimeout(res, 2000))
              }

              attempts++;
            } catch (error) {
              console.error("Network error:", error)
              attempts++;
            }
          }

          await this.storageRREvent.clearAllEvents();
        }
      }
    }, this.intervalSyncData)
  }

  pause() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined;
    }
  }

  private getWebsiteInfo() {
    this.websiteInfo = {
      domain: window.location.hostname,
      userArgent: navigator.userAgent,
      title: this.getTitle(),
      screen: window.location.pathname
    }
  }

  log(...args: any[]) {
    if (this.logging) {
      console.log(...args)
    }
  }

  getTitle() {
    return document.title?.slice(0, 64)
  }

  getAttribute(key: string) {
    return document.currentScript?.getAttribute(key);
  }

  addEvent(key: string, data: Record<string, any>) {
    if (!key) {
      this.log('event key cannot be null or empty')
      return;
    }
    if (key.length > 36) {
      this.log('Max length event key is 36 characters')
      return;
    }

    // * validate data
    if (data) {
      const keys = Object.keys(data)
      const values = Object.values(data)

      if (keys.length > 10) {
        console.error('The number of variables cannot exceed 10')
        return;
      }

      for (let k of keys) {
        if (k && k.length > 36) {
          console.error('Variable name length cannot exceed 36 characters')
          return;
        }
      }

      for (let v of values) {
        if (typeof v === "string" && v.length > 36) {
          console.error('Variable value cannot exceed 36 characters')
          return;
        }
      }
    }

    if (this.sessionId) {
      const payload = {
        event: EventType.custom_event,
        key,
        sessionId: this.sessionId,
        domain: this.websiteInfo?.domain,
        title: this.getTitle(),
        screen: window.location.pathname,
        referrer: document.referrer,
        lang: navigator.language,
        time: new Date().getTime()
      }

      this.storageEvent.addEvent(payload).then(r => {
        this.log(`add event ${key}`)
      })
    }
  }
}

window.ja = new JaSdk()
