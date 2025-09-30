import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/Response';

// 扩展Request类型，添加user属性
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(ApiResponse.unauthorized('token unauthorized'));
    }

    const token = authHeader.split(' ')[1];

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET');

    // 将解码后的用户信息添加到请求对象中
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json(ApiResponse.unauthorized('unvalid token'));
  }
};