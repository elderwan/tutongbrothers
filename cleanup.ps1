# ==========================================
# 项目文件清理和整理脚本
# ==========================================

Write-Host "🧹 开始清理和整理项目文件..." -ForegroundColor Green
Write-Host ""

# 定义颜色
$success = "Green"
$warning = "Yellow"
$error = "Red"
$info = "Cyan"

# 工作目录
$rootPath = "D:\workspace\VSCode\blog"
Set-Location $rootPath

# ==========================================
# 1. 移动文档文件到 docs 目录
# ==========================================
Write-Host "📁 整理文档文件..." -ForegroundColor $info

# 部署相关文档
$deploymentDocs = @(
    "RENDER_DEPLOYMENT.md",
    "VERCEL_DEPLOYMENT_FIX.md",
    "render.yaml"
)

foreach ($doc in $deploymentDocs) {
    if (Test-Path $doc) {
        Move-Item $doc "docs/deployment/" -Force
        Write-Host "  ✓ 移动 $doc -> docs/deployment/" -ForegroundColor $success
    }
}

# 功能相关文档
$featureDocs = @(
    "PHOTO_WALL_GUIDE.md"
)

foreach ($doc in $featureDocs) {
    if (Test-Path $doc) {
        Move-Item $doc "docs/features/" -Force
        Write-Host "  ✓ 移动 $doc -> docs/features/" -ForegroundColor $success
    }
}

# md 目录下的所有文档
if (Test-Path "md") {
    Move-Item "md/*" "docs/features/" -Force
    Write-Host "  ✓ 移动 md/* -> docs/features/" -ForegroundColor $success
    Remove-Item "md" -Force
    Write-Host "  ✓ 删除空目录 md/" -ForegroundColor $success
}

Write-Host ""

# ==========================================
# 2. 清理无用文件
# ==========================================
Write-Host "🗑️  清理无用文件..." -ForegroundColor $info

# 根目录无用文件
$unusedRootFiles = @(
    "package.json",
    "package-lock.json"
)

foreach ($file in $unusedRootFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ 删除 $file" -ForegroundColor $success
    }
}

# client 目录无用文件
Set-Location "client"

$unusedClientFiles = @(
    "design.json",
    "deploy-vercel.sh",
    "deploy-vercel.ps1"
)

foreach ($file in $unusedClientFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ 删除 client/$file" -ForegroundColor $success
    }
}

# 删除废弃的 type 目录（已被 types 替代）
if (Test-Path "type") {
    Write-Host "  ⚠️  检测到废弃的 type 目录，建议迁移到 types 目录" -ForegroundColor $warning
}

Set-Location $rootPath
Write-Host ""

# ==========================================
# 3. 清理构建产物和缓存
# ==========================================
Write-Host "🧼 清理构建产物和缓存..." -ForegroundColor $info

# 清理 client 构建产物
if (Test-Path "client/.next") {
    Remove-Item "client/.next" -Recurse -Force
    Write-Host "  ✓ 删除 client/.next/" -ForegroundColor $success
}

if (Test-Path "client/out") {
    Remove-Item "client/out" -Recurse -Force
    Write-Host "  ✓ 删除 client/out/" -ForegroundColor $success
}

# 清理 backend 构建产物
if (Test-Path "backend/dist") {
    Remove-Item "backend/dist" -Recurse -Force
    Write-Host "  ✓ 删除 backend/dist/" -ForegroundColor $success
}

Write-Host ""

# ==========================================
# 4. 整理 backend 环境变量文件
# ==========================================
Write-Host "🔧 整理 backend 环境变量..." -ForegroundColor $info

Set-Location "backend"

# 检查 .env 文件
if (-not (Test-Path ".env.example")) {
    Write-Host "  ⚠️  缺少 .env.example 文件" -ForegroundColor $warning
}

if (Test-Path ".env") {
    Write-Host "  ✓ .env 文件存在（已在 .gitignore 中）" -ForegroundColor $success
}

if (Test-Path ".env.development") {
    Write-Host "  ✓ .env.development 文件存在" -ForegroundColor $success
}

if (Test-Path ".env.production") {
    Write-Host "  ✓ .env.production 文件存在" -ForegroundColor $success
}

Set-Location $rootPath
Write-Host ""

# ==========================================
# 5. 检查 .gitignore 配置
# ==========================================
Write-Host "📋 检查 .gitignore 配置..." -ForegroundColor $info

$gitignoreCheck = @(
    "node_modules/",
    ".env",
    ".next/",
    "dist/",
    ".vercel/"
)

$gitignoreContent = Get-Content ".gitignore" -Raw

foreach ($pattern in $gitignoreCheck) {
    if ($gitignoreContent -match [regex]::Escape($pattern)) {
        Write-Host "  ✓ $pattern 已配置" -ForegroundColor $success
    }
    else {
        Write-Host "  ⚠️  $pattern 未配置" -ForegroundColor $warning
    }
}

Write-Host ""

# ==========================================
# 完成
# ==========================================
Write-Host "✅ 文件整理完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📊 项目结构已优化为：" -ForegroundColor $info
Write-Host "  blog/" -ForegroundColor Cyan
Write-Host "    ├── docs/               📚 所有文档" -ForegroundColor Cyan
Write-Host "    │   ├── deployment/     🚀 部署相关" -ForegroundColor Cyan
Write-Host "    │   └── features/       ✨ 功能说明" -ForegroundColor Cyan
Write-Host "    ├── client/             💻 前端项目" -ForegroundColor Cyan
Write-Host "    ├── backend/            ⚙️  后端项目" -ForegroundColor Cyan
Write-Host "    └── .gitignore          🔒 Git 配置" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  注意：请手动检查并处理以下内容：" -ForegroundColor $warning
Write-Host "  1. 迁移 client/type/User.ts 到 client/types/user.types.ts" -ForegroundColor $warning
Write-Host "  2. 更新相关导入语句" -ForegroundColor $warning
Write-Host "  3. 检查 backend/.env.example 是否需要创建" -ForegroundColor $warning
Write-Host ""
