import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LOG_REQUEST_SIZE_KEY } from './log-request-size.decorator';
import {Reflector} from "@nestjs/core";

@Injectable()
export class RequestSizeInterceptor implements NestInterceptor {
    private readonly logger = new Logger(RequestSizeInterceptor.name);

    constructor(private readonly reflector: Reflector) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const handler = context.getHandler();
        const isLoggingEnabled = this.reflector.get<boolean>(LOG_REQUEST_SIZE_KEY, handler);

        if (isLoggingEnabled) {
            const request = context.switchToHttp().getRequest();

            // Tính kích thước request body, query, headers
            const bodySize = request.body ? Buffer.byteLength(JSON.stringify(request.body), 'utf8') : 0;
            const querySize = request.query ? Buffer.byteLength(JSON.stringify(request.query), 'utf8') : 0;
            const headersSize = request.headers ? Buffer.byteLength(JSON.stringify(request.headers), 'utf8') : 0;

            const totalSize = bodySize + querySize + headersSize;

            this.logger.log(`📝 Request Size: ${totalSize} bytes (Body: ${bodySize}, Query: ${querySize}, Headers: ${headersSize})`);
        }

        return next.handle();
    }
}
