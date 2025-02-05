import { EventType } from "../../consts/index.js";
export interface IEvent {
    id: string;
    eventType: EventType;
    projectId: string;
    sessionId: string;
    data?: any;
    time: number;
}
//# sourceMappingURL=event.interface.d.ts.map