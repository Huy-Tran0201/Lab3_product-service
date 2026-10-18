import {
  Injectable,
  NestMiddleware,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

// Middleware xác thực: Product Service KHÔNG tự kiểm tra token và KHÔNG đọc DB của Auth Service.
// Nó chuyển tiếp header "Authorization: Bearer <token>" tới Auth Service (Bài TH2): GET /auth
// - Auth Service trả 200  -> token hợp lệ, cho đi tiếp
// - Auth Service trả 401  -> token thiếu / sai / hết hạn / đã đăng xuất -> trả 401
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException('Thiếu token. Dùng header Authorization: Bearer <token>');
    }

    const authUrl = (process.env.AUTH_SERVICE_URL || 'http://localhost:3000') + '/auth';

    let response: any;
    try {
      response = await fetch(authUrl, { headers: { authorization } });
    } catch {
      throw new ServiceUnavailableException('Không kết nối được Auth Service. Hãy chạy Auth Service (Bài TH2) trước.');
    }

    const body: any = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new UnauthorizedException(body.message || 'Token không hợp lệ');
    }

    (req as any).user = body.user; // thông tin user lấy từ Auth Service
    next();
  }
}
