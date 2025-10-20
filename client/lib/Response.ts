/**
 * Unified API response class
 */
export class ApiResponse<T = any> {
    /**
     * Status code
     */
    public code: number;

    /**
     * Custom message
     */
    public msg: string;

    /**
     * Business data, can be object or array
     */
    public data: T;

    constructor(code: number, msg: string, data: T) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    /**
     * Success response
     * @param data Business data
     * @param msg Success message, default is "Operation successful"
     * @param code Success status code, default is 200
     */
    static success<T>(msg: string = "Operation successful", code: number = 200, data: T): ApiResponse<T> {
        return new ApiResponse(code, msg, data);
    }

    /**
     * Error response
     * @param msg Error message
     * @param code Error status code, default is 500
     * @param data Optional error data
     */
    static error<T = null>(msg: string, code: number = 500, data: T = null as T): ApiResponse<T> {
        return new ApiResponse(code, msg, data);
    }

    /**
     * Bad request response
     * @param msg Error mesldsage, default is "Bad request"
     * @param data Optional error data
     */
    static badRequest<T = null>(msg: string = "Bad request", data: T = null as T): ApiResponse<T> {
        return new ApiResponse(400, msg, data);
    }

    /**
     * Unauthorized response
     * @param msg Error message, default is "Unauthorized"
     * @param data Optional error data
     */
    static unauthorized<T = null>(msg: string = "Unauthorized", data: T = null as T): ApiResponse<T> {
        return new ApiResponse(401, msg, data);
    }

    /**
     * Forbidden response
     * @param msg Error message, default is "Forbidden"
     * @param data Optional error data
     */
    static forbidden<T = null>(msg: string = "Forbidden", data: T = null as T): ApiResponse<T> {
        return new ApiResponse(403, msg, data);
    }

    /**
     * Not found response
     * @param msg Error message, default is "Resource not found"
     * @param data Optional error data
     */
    static notFound<T = null>(msg: string = "Resource not found", data: T = null as T): ApiResponse<T> {
        return new ApiResponse(404, msg, data);
    }

    /**
     * Internal server error response
     * @param msg Error message, default is "Internal server error"
     * @param data Optional error data
     */
    static internalError<T = null>(msg: string = "Internal server error", data: T = null as T): ApiResponse<T> {
        return new ApiResponse(500, msg, data);
    }
}

/**
 * Status code constants
 */
export const StatusCode = {
    SUCCESS: 200,           // Success
    CREATED: 201,           // Created successfully
    NO_CONTENT: 204,        // No content
    BAD_REQUEST: 400,       // Bad request
    UNAUTHORIZED: 401,      // Unauthorized
    FORBIDDEN: 403,         // Forbidden
    NOT_FOUND: 404,         // Not found
    METHOD_NOT_ALLOWED: 405, // Method not allowed
    CONFLICT: 409,          // Conflict
    INTERNAL_ERROR: 500,    // Internal server error
    NOT_IMPLEMENTED: 501,   // Not implemented
    BAD_GATEWAY: 502,       // Bad gateway
    SERVICE_UNAVAILABLE: 503 // Service unavailable
} as const;

export default ApiResponse;