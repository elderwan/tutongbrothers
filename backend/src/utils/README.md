# 统一响应类使用文档

## 概述

`ApiResponse` 类提供了一个统一的API响应格式，包含三个主要字段：
- `code`: 状态码
- `msg`: 自定义消息
- `data`: 业务数据（可以是对象或数组）

## 响应格式

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    // 业务数据
  }
}
```

## 使用方法

### 1. 导入响应类

```typescript
import ApiResponse from "../utils/Response";
```

### 2. 成功响应

```typescript
// 基本用法
const response = ApiResponse.success(data, "操作成功");
res.json(response);

// 自定义状态码
const response = ApiResponse.success(data, "创建成功", 201);
res.status(201).json(response);
```

### 3. 失败响应

```typescript
// 通用错误
const response = ApiResponse.error("操作失败", 500);
res.status(500).json(response);

// 参数错误
const response = ApiResponse.badRequest("参数不能为空");
res.status(400).json(response);

// 未授权
const response = ApiResponse.unauthorized("请先登录");
res.status(401).json(response);

// 资源未找到
const response = ApiResponse.notFound("用户不存在");
res.status(404).json(response);
```

## 预定义方法

### 成功响应
- `ApiResponse.success(data, msg?, code?)` - 成功响应

### 错误响应
- `ApiResponse.error(msg, code?, data?)` - 通用错误响应
- `ApiResponse.badRequest(msg?, data?)` - 400 参数错误
- `ApiResponse.unauthorized(msg?, data?)` - 401 未授权
- `ApiResponse.forbidden(msg?, data?)` - 403 禁止访问
- `ApiResponse.notFound(msg?, data?)` - 404 资源未找到
- `ApiResponse.internalError(msg?, data?)` - 500 内部服务器错误

## 状态码常量

```typescript
import { StatusCode } from "../utils/Response";

// 使用预定义状态码
const response = ApiResponse.success(data, "成功", StatusCode.SUCCESS);
```

## 完整示例

```typescript
import { Request, Response } from "express";
import ApiResponse from "../utils/Response";

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        if (!id) {
            const response = ApiResponse.badRequest("用户ID不能为空");
            res.status(400).json(response);
            return;
        }
        
        const user = await User.findById(id);
        
        if (!user) {
            const response = ApiResponse.notFound("用户不存在");
            res.status(404).json(response);
            return;
        }
        
        const response = ApiResponse.success(user, "获取用户信息成功");
        res.json(response);
        
    } catch (error) {
        console.error("获取用户失败:", error);
        const response = ApiResponse.internalError("获取用户信息失败");
        res.status(500).json(response);
    }
};
```

## 类型支持

这个响应类支持TypeScript泛型，可以为data字段指定具体类型：

```typescript
// 指定返回数据类型
const response = ApiResponse.success<User[]>(users, "获取用户列表成功");

// 错误响应也可以指定数据类型
const response = ApiResponse.error<ValidationError>("验证失败", 400, validationErrors);
```