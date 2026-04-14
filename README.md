# AI Portfolio（GitHub Pages）

- 在线访问：https://qianjin1111.github.io/ai-portfolio/
- 仓库地址：https://github.com/qianjin1111/ai-portfolio
- 最后更新：2026-04-14 16:40

简洁科技风个人作品展示站点，包含「项目展示 / 博客 / 关于我」三个板块，适配 GitHub Pages 静态部署。

## 功能

- 项目展示：项目卡片、技术标签、外链入口
- 博客：文章列表、分类筛选、搜索
- 关于我：技能栈、经历、联系方式

## 技术栈

- Create React App + TypeScript
- Tailwind CSS
- React Router（HashRouter，适配 GitHub Pages）

## 本地开发

```bash
npm install
npm start
```

打开 http://localhost:3000

## 构建与部署（GitHub Pages）

本项目使用 GitHub Pages 的「Deploy from a branch」，部署目录为：

- Branch：master
- Folder：/docs

构建命令会把产物输出到 `docs/`（供 Pages 直接发布）：

```bash
npm run build
```

## 更新站点

每次更新站点内容后，按以下流程即可自动更新线上站点：

```bash
npm run build
git add -A
git commit -m "chore: update site"
git push
```

GitHub Pages 会在 `master/docs` 变更后自动重新发布（通常 1-5 分钟生效）。
