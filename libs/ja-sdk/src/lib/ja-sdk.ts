import {API_KEY_HEADER} from "./consts";
import {Storage, StorageOptions} from './storage'
import {advancedThrottle} from "./utils";


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
}

export class JaSdk {
    apiEndpoint: string;
    apiKey: string;
    config: any;
    rrweb: any
    storage: Storage;
    intervalSyncData: number;
    intervalId?: any;
    websiteInfo?: WebsiteInfoOptions;
    sessionId?: string;

    constructor(options: JaSdkOptions & StorageOptions) {
        this.apiEndpoint = options.apiEndpoint ?? 'https://ja-measurement.wolfx.app';
        if (!options.apiKey) {
            throw new Error('Api Key not found');
        }
        this.apiKey = options.apiKey;
        this.intervalSyncData = options.intervalSyncData ?? 5000;

        this.storage = new Storage({
            dbName: options.dbName,
            storeName: options.storeName
        });
        // advancedThrottle(() => this.init(), 300, {leading: true})();
        this.init()
    }

    async init() {
        await this.getConfig();
        this.rrweb = await import('rrweb');
        this.startRecording().then(() => {
            console.log('end recording session')
        })
        this.syncRecording().then(() => {
            console.log('end sync session data')
        })
    }

    getHeaders(headers: any = {}) {
        if (this.apiKey) {
            headers[API_KEY_HEADER] = `JaKey${this.apiKey}`;
        }

        return headers;
    }

    async getConfig() {
        this.getWebsiteInfo();
        if (this.websiteInfo) {
            const response = await fetch(
                `${this.apiEndpoint}/api/v1/project/config?` + new URLSearchParams({
                    domain: this.websiteInfo?.domain,
                    title: this.websiteInfo.title,
                    screen: this.websiteInfo?.screen,
                }).toString(),
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-ja-api-key': `JaKey${this.apiKey}`
                    },
                }
            ).then(res => res.json())
                .catch((err) => {
                    console.error(err)
                })
            this.sessionId = response.session
        }
    }

    async startRecording() {
        if (this.rrweb) {
            this.rrweb.record({
                emit: (event: any) => {
                    // if (event.type !== 3) {
                    this.storage.addEvent(event)
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
                const events = await this.storage.getAllEvents();
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
                                }
                            )

                            if (response.ok) {
                                await this.storage.clearAllEvents()
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

                    await this.storage.clearAllEvents();
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
            title: document.title,
            screen: window.location.pathname
        }
    }
}
