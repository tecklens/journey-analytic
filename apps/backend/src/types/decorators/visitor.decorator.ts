import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import * as crypto from 'crypto';
import { Request } from 'express';

// Danh sách IP nội bộ cần bỏ qua
const PRIVATE_IP_RANGES = [
    /^127\./,      // Localhost
    /^192\.168\./, // Mạng nội bộ
    /^10\./,       // Mạng nội bộ
    /^::1$/,       // IPv6 Localhost
    /^fc00:/,      // IPv6 private
    /^fe80:/       // IPv6 link-local
];

/**
 * Lấy IP thực của client một cách bảo mật hơn
 * @param req Request object từ Express
 * @returns Địa chỉ IP của client
 */
export function getClientIp(req: Request): string | null {
    let ip: string | null = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress as string;

    if (process.env.NODE_ENV === 'dev') return ip;

    // Nếu có nhiều IP (Proxy chain), lấy IP đầu tiên
    if (ip) {
        ip = ip.split(',')[0].trim();
    }

    // Nếu không có X-Forwarded-For hoặc bị nghi ngờ, lấy từ socket
    if (!ip || PRIVATE_IP_RANGES.some((regex) => regex.test(<string>ip))) {
        ip = req.socket.remoteAddress || null;
    }

    // Nếu vẫn là IP nội bộ, return null (không tin cậy)
    if (ip && PRIVATE_IP_RANGES.some((regex) => regex.test(ip))) {
        return null;
    }

    return ip;
}

export const VisitorId = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    // Lấy IP, User-Agent, Accept-Language từ request headers
    const ip = getClientIp(request) || 'unknown';
    const userAgent = request.headers['user-agent'] || '';
    const acceptLanguage = request.headers['accept-language'] || '';

    // Tạo session_id bằng cách hash thông tin visitor
    return crypto
        .createHash('sha256')
        .update(`${ip}-${userAgent}-${acceptLanguage}`)
        .digest('hex');
});
