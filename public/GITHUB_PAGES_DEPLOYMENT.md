# GitHub Pages 部署问题排查与解决方案

## 问题描述

在 React 应用部署到 GitHub Pages 时，构建一直失败，导致网站无法正常更新。

## 问题现象

1. **本地构建成功**：`npm run build` 正常完成，生成 `docs/` 目录
2. **GitHub Actions 失败**：自定义 workflow 构建失败
3. **GitHub Pages 构建失败**：官方构建器构建失败
4. **网站无法更新**：即使代码已推送，GitHub Pages 仍显示旧版本

## 根本原因

GitHub Pages 默认使用 **Jekyll** 静态站点生成器来构建站点，但项目是 **React 应用**，需要直接提供构建好的静态文件。

Jekyll 尝试处理 React 应用的构建结果时失败，导致整个构建过程失败。

错误日志：
```
Build with Jekyll
Logging at level: debug
GitHub Pages: github-pages v232
GitHub Pages: jekyll v3.10.0
Theme: jekyll-theme-primer
```

## 解决方案

### 步骤 1：添加 `.nojekyll` 文件

在项目根目录和构建输出目录中添加 `.nojekyll` 文件：

```bash
# 在项目根目录创建
touch .nojekyll

# 复制到构建输出目录
cp .nojekyll docs/
```

`.nojekyll` 文件告诉 GitHub Pages 跳过 Jekyll 构建，直接提供静态文件。

### 步骤 2：配置 GitHub Pages

1. 访问 https://github.com/[username]/[repo]/settings/pages
2. 设置 **Source**: Deploy from a branch
3. 设置 **Branch**: master
4. 设置 **Folder**: /docs

### 步骤 3：推送代码

```bash
git add .nojekyll docs/.nojekyll
git commit -m "fix: 添加 .nojekyll 文件，禁用 Jekyll 构建以支持 React 应用"
git push origin master
```

## 技术背景

### Jekyll 是什么？

Jekyll 是一个用 Ruby 编写的静态站点生成器，主要用于：
- 处理 Markdown 文件
- 使用 Liquid 模板引擎
- 生成静态 HTML 页面

GitHub Pages 默认使用 Jekyll 来处理静态站点，以便支持：
- 博客文章
- 主题定制
- 插件扩展

### 为什么 React 应用不需要 Jekyll？

React 应用（使用 Create React App、Vite 等工具）已经在本地构建完成了：
- HTML 文件已生成
- CSS 文件已打包
- JavaScript 文件已编译
- 资源文件已优化

这些文件可以直接由 Web 服务器提供，不需要额外的构建步骤。

### `.nojekyll` 文件的作用

`.nojekyll` 文件是一个特殊的标记文件，当 GitHub Pages 检测到这个文件时：
- 跳过 Jekyll 构建过程
- 直接提供静态文件
- 支持以下划线 `_` 开头的文件和目录（React 应用常见）

## 常见问题

### Q1: 什么时候需要添加 `.nojekyll` 文件？

**需要添加的情况：**
- React、Vue、Angular 等前端框架应用
- 已经预编译的静态站点
- 使用 Create React App、Vite、Next.js 等工具构建的项目
- 项目中包含 `_` 开头的文件或目录

**不需要添加的情况：**
- 纯 Jekyll 项目
- 使用 Liquid 模板的项目
- 需要 Jekyll 插件的项目

### Q2: 如何验证 `.nojekyll` 文件是否生效？

1. 访问 https://github.com/[username]/[repo]/actions
2. 查看 `pages-build-deployment` workflow
3. 检查是否还有 "Build with Jekyll" 步骤
4. 如果没有，说明 `.nojekyll` 生效了

### Q3: 构建成功但网站还是旧版本怎么办？

**解决方案：**
1. 强制刷新浏览器：`Ctrl + Shift + R` 或 `Cmd + Shift + R`
2. 清除浏览器缓存
3. 访问 https://github.com/[username]/[repo]/settings/pages
4. 点击 "Rebuild" 按钮
5. 等待 1-3 分钟后再次验证

### Q4: GitHub Actions 失败但 GitHub Pages 成功怎么办？

**正常现象：**
- GitHub Actions 是自定义的 CI/CD 工作流
- GitHub Pages 有自己的构建系统
- 两者是独立的，互不影响
- 只要 GitHub Pages 构建成功，网站就能正常更新

## 最佳实践

### 1. 项目结构

```
ai-portfolio/
├── .gitignore              # Git 忽略文件配置
├── .nojekyll               # 禁用 Jekyll 构建
├── package.json            # Node.js 依赖配置
├── package-lock.json       # 依赖版本锁定
├── public/                 # 公共静态资源
│   ├── favicon.ico
│   └── ...
├── src/                    # 源代码
│   ├── App.tsx
│   ├── index.tsx
│   └── ...
├── docs/                   # GitHub Pages 部署目录
│   ├── index.html          # 入口文件
│   ├── .nojekyll           # 禁用 Jekyll 构建
│   ├── static/             # 静态资源
│   │   ├── css/
│   │   └── js/
│   └── ...
└── package.json
```

### 2. 构建脚本

在 `package.json` 中配置构建脚本：

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build && rm -rf docs && mv build docs && cp .nojekyll docs/",
    "test": "react-scripts test"
  }
}
```

这样每次构建时会自动：
1. 运行 `react-scripts build`
2. 删除旧的 `docs/` 目录
3. 将 `build/` 重命名为 `docs/`
4. 复制 `.nojekyll` 文件到 `docs/`

### 3. 部署流程

```bash
# 1. 构建项目
npm run build

# 2. 提交代码
git add docs/
git commit -m "chore: update site"
git push

# 3. 验证部署
# 等待 1-3 分钟后访问网站
# 强制刷新浏览器查看更新
```

### 4. 监控构建状态

1. 访问 https://github.com/[username]/[repo]/actions
2. 查看 `pages-build-deployment` workflow 状态
3. 检查是否有构建错误
4. 如有问题，查看详细日志

## 经验总结

### ✅ 正确做法

1. **添加 `.nojekyll` 文件**：禁用 Jekyll 构建
2. **使用 `docs/` 目录**：避免与 GitHub Pages 默认目录冲突
3. **配置正确的 Source**：Deploy from a branch
4. **等待构建完成**：给 GitHub Pages 足够的时间
5. **强制刷新浏览器**：清除缓存查看最新版本

### ❌ 错误做法

1. **忽略 `.nojekyll` 文件**：导致 Jekyll 构建失败
2. **使用 GitHub Actions 强制构建**：增加复杂度，容易出错
3. **频繁推送代码**：每次推送都会触发构建，浪费资源
4. **不验证构建状态**：不知道是否成功部署
5. **依赖浏览器缓存**：看不到最新的更新

## 相关资源

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [Jekyll 官方文档](https://jekyllrb.com/)
- [Create React App 部署指南](https://create-react-app.dev/docs/deployment/)
- [Vercel 部署指南](https://vercel.com/docs/deployments/overview)

## 更新日志

- **2026-04-14**: 首次记录 GitHub Pages Jekyll 构建问题及解决方案
- **2026-04-14**: 添加最佳实践和常见问题解答
