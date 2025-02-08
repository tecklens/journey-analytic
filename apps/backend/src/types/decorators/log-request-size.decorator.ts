import { SetMetadata } from '@nestjs/common';

export const LOG_REQUEST_SIZE_KEY = 'logRequestSize';
export const LogRequestSize = () => SetMetadata(LOG_REQUEST_SIZE_KEY, true);
