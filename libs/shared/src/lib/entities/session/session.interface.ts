export interface ISession {
  id: string;
  projectId: string;
  websiteId: string;
  host: string;
  browser: string;
  os: string;
  device?: string;
  screen: string;
  language: string;
  country: string;
  city?: string;
  shareId?: string;
  referrer?: string;

  createdAt: Date;
  updatedAt: Date;
}