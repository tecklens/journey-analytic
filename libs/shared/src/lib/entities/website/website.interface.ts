export interface IWebsite {
  id: string;
  title: string;
  keywords?: string[];
  projectId: string;

  domain: string;

  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}