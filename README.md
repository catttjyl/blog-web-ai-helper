# blog-web-ai-helper

> 基于 React 前端框架，结合 Express 后端框架与 MySQL 数据库，构建 Next.js SSR 博客系统，配有 AI 辅助写作，支持 markdown 编辑器。

- 支持 markdown 编辑
  react-markdown
  remark-gfm 插件（支持 GitHub 风格 Markdown）
  支持单屏切换预览当前编辑效果

理念：AI 不应该是代替用户写文章，而是**辅助创作** + **提升效率** + **保留用户表达**

启动数据库（用 docker）

> 如果你没有 docker 客户端，需要[前往下载](https://www.docker.com/products/docker-desktop/)

目标代码结构

```javascript
my-blog-project
├── server/                 // 后端（Express + MySQL）
│   ├── index.js            // Express 主入口
│   ├── routes/
│   │   └── posts.js        // GET/POST /posts
│   ├── db/
│   │   └── index.js        // MySQL 连接池
│   ├── controllers/
│   │   └── posts.js        // 逻辑处理
│   ├── package.json
│   └── .env
│
├── client/                 // 前端（Next.js SSR）
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js         // SSR 首页
│   │   └── post.js         // SSR 详情页
│   ├── components/         // 复用组件
│   ├── package.json
│   └── next.config.mjs
│
└── README.md
```

长期目标：分离 Python AI 微服务
支持向量数据库（检索增强）、文本分析、NLP、embedding 管理
