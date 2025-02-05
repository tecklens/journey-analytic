export interface IProject {
  id: string;
  name: string;
  website: string;

  tags: string[];

  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}