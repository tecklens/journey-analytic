import {EventType} from "../../consts";

export interface IEvent {
  id: string;
  eventType: EventType;
  projectId: string;
  sessionId: string;

  data?: any;

  time: number; // thời gian tạo
}