import ApiResponse from "../utils/Response";
import rateLimit from "express-rate-limit";


export const likeLimiter = rateLimit({
    windowMs: 1000, // 1秒
    max: 1,         // 1次请求
    //return json object
    message: (req: any, res: any) => res.status(429).json(ApiResponse.tooManyRequests("Too many like requests, please slow down")),
    keyGenerator: (req) => `${req.body.userId}-${req.params.id}`
});