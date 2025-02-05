import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientIp = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    const forwardedFor = request.headers['x-forwarded-for'];
    const realIp = request.headers['x-real-ip'];

    // Nếu có nhiều IP trong X-Forwarded-For, lấy IP đầu tiên
    let clientIp = Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor?.split(',')[0].trim();

    // Nếu không có X-Forwarded-For, thử lấy X-Real-IP
    if (!clientIp && realIp) {
        clientIp = realIp as string;
    }

    // Nếu vẫn không có, lấy từ request.ip
    if (!clientIp) {
        clientIp = request.ip;
    }

    return clientIp;
});
