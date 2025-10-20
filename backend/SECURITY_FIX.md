# 清除 Git 历史中的敏感信息

## ⚠️ 警告
此操作会重写 Git 历史！如果有其他人克隆了你的仓库，他们需要重新克隆。

## 步骤 1：安装 BFG Repo-Cleaner

### Windows (使用 Chocolatey)
```powershell
choco install bfg-repo-cleaner
```

### 或者直接下载
下载 JAR 文件：https://rtyley.github.io/bfg-repo-cleaner/

## 步骤 2：备份仓库
```bash
cd d:/workspace/VSCode
cp -r blog blog-backup
```

## 步骤 3：使用 BFG 删除文件
```bash
cd blog
bfg --delete-files .env.development
bfg --delete-files .env.production
```

## 步骤 4：清理和推送
```bash
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

## 步骤 5：通知协作者
如果有其他人在使用这个仓库，通知他们：
1. 删除本地仓库
2. 重新克隆：`git clone https://github.com/elderwan/tutongbrothers.git`

---

## 更简单的方法（推荐）

直接更改密码和密钥，比清理历史简单得多！

1. MongoDB 密码 → 在 Atlas 修改
2. JWT_SECRET → 重新生成
3. 更新所有使用这些密钥的地方
