/**
 * 配置管理模块
 * 根据 NODE_ENV 自动加载对应的环境配置
 */

interface Config {
    nodeEnv: string;
    port: number;
    mongoUri: string;
    jwtSecret: string;
    clientUrl: string;
    isDevelopment: boolean;
    isProduction: boolean;
}

/**
 * 获取配置
 * 优先级：环境变量 > .env 文件
 */
export const config: Config = {
    // 环境
    nodeEnv: process.env.NODE_ENV || 'development',

    // 端口
    port: parseInt(process.env.PORT || '5000', 10),

    // 数据库
    mongoUri: process.env.MONGO_URI || '',

    // JWT
    jwtSecret: process.env.JWT_SECRET || '',

    // 前端地址
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

    // 环境判断
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
};

/**
 * 验证必需的配置项
 */
export function validateConfig(): void {
    const required = ['MONGO_URI', 'JWT_SECRET'];
    const missing: string[] = [];

    for (const key of required) {
        if (!process.env[key]) {
            missing.push(key);
        }
    }

    if (missing.length > 0) {
        throw new Error(
            `❌ Missing required environment variables: ${missing.join(', ')}\n` +
            `Please check your .env file or environment settings.`
        );
    }
}

/**
 * 打印配置信息（隐藏敏感信息）
 */
export function printConfig(): void {
    console.log('\n📋 Configuration:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌍 Environment:  ${config.nodeEnv}`);
    console.log(`🔌 Port:         ${config.port}`);
    console.log(`🗄️  Database:     ${maskConnectionString(config.mongoUri)}`);
    console.log(`🔐 JWT Secret:   ${config.jwtSecret ? '✅ Set' : '❌ Not Set'}`);
    console.log(`🌐 Client URL:   ${config.clientUrl}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * 隐藏数据库连接字符串中的密码
 */
function maskConnectionString(uri: string): string {
    if (!uri) return '❌ Not Set';

    // 隐藏密码部分
    const regex = /:\/\/([^:]+):([^@]+)@/;
    const masked = uri.replace(regex, (_, username) => {
        return `://${username}:****@`;
    });

    // 截断显示
    return masked.length > 60 ? masked.substring(0, 60) + '...' : masked;
}

export default config;
