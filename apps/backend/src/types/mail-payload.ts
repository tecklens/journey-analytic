export interface MailPayload {
  subject: string;
  to: string;
  from: string;
  content?: string;
  html?: string;
  context?: any;
  template?: string;
}
