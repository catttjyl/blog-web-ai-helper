# 全栈博客系统（AI助手）
> 基于 Next.js App Router (SSR) + Express + MySQL 的全栈博客系统，配有 AI 辅助写作功能，支持 markdown 编辑器，首屏快速加载、SEO 友好。

> [!IMPORTANT]
> 理念：AI 不应该是代替用户写文章，而是**辅助创作** + **提升效率** + **保留用户表达**

## 功能支持
### 1. SSR 页面
  * 博客列表页（支持不同排序类型、分页切换）
  * 博客详情页
    * 新增/编辑（支持单屏切换预览当前Markdown效果、保存、放弃编辑）
    * 浏览（Markdown展示）
### 2. 后端API
  * 博客文章
    * 获取文章列表（GET/posts）
    * 获取单篇文章内容（GET/posts/:id）
    * 新增文章（POST/posts，文章标题和内容必传）
    * 更新文章（POST/posts/:id，只允许更新有修改记录的文章）
    * 删除文章（DELETE/posts，支持批量删除）
  * 评论系统
    * 获取评论（GET/comments/:postId）
    * 发表评论（POST/comments/:postId，评论内容必传）
    * 删除评论（DELETE/comments/:id）
  * AI助手
    * 自动生成文章大纲（POST/ai/outline，文章概括和风格必传）
    * 修改文章选中部分（POST/ai/rephrase，完成文章内容和选择字段必传）
### 3. 数据库
  * MySQL（id字段自动increment，日期相关的字段自动取当前时间）


## 技术栈
项目采用 “前端 SSR + 后端 Express + MYSQL 数据库” 的完整工程化结构，涵盖了从页面渲染到数据持久化的完整链路。
技术  | 作用/优点
------------- | -------------
[Next.js 16（App Router）](https://nextjs.org/blog/next-16)  | 提供 SSR、文件路由管理，实现首屏渲染快、SEO 友好
[react-markdown](https://www.npmjs.com/package/react-markdown) + [remark-gfm](https://www.npmjs.com/package/remark-gfm)  | 支持 GitHub Markdown 风格
[Express](https://expressjs.com/en/starter/hello-world.html)  | 后端 REST API 框架；负责处理 CRUD 逻辑、参数校验、路由管理
[mysql2](https://sidorares.github.io/node-mysql2/docs)  | MySQL 数据库驱动
[Docker](https://www.docker.com/get-started/)  | 用容器快速启动 MySQL，无需本地安装数据库
[Grop Moonshot API](https://console.groq.com/playground?model=moonshotai/kimi-k2-instruct-0905) & [Google Gemini API](https://ai.google.dev/gemini-api/docs/quickstart) |  LLM API 调用大语言模型


## 效果展示

* 博客列表页

<img width="1180" height="981" alt="image" src="https://github.com/user-attachments/assets/0609e668-28e2-4761-92a8-9f07bf029bcf" />

* 博客详情页（浏览态）
<img width="1180" height="981" alt="image" src="https://github.com/user-attachments/assets/950afdf4-a28f-4215-a509-348c30caa411" />

* 博客详情页（编辑态）
<img width="1180" height="981" alt="image" src="https://github.com/user-attachments/assets/6a61b9bd-edb4-4c3b-84c3-0c6e3e6643b2" />

* AI初始大纲生成
<img width="1036" height="605" alt="image" src="https://github.com/user-attachments/assets/94dc4fbc-5332-49a1-9fc8-a1277165d311" />

* AI修改文本选中字段，可选择是否替换文本
<img width="822" height="436" alt="image" src="https://github.com/user-attachments/assets/2d150bed-4876-49b5-b9a6-4b20ed635a84" />
<img width="1040" height="675" alt="image" src="https://github.com/user-attachments/assets/52166bab-6711-4f8a-a6d9-83283242ff06" />



## 代码结构

```javascript
my-blog-project
├── client/                         // 前端（Next.js SSR）
│   ├── app/
│   │   ├── layout.js
│   │   ├── global.css
│   │   ├── page.js                 // SSR 首页
│   │   └── posts/
│   │       ├── page.js             // SSR 博客列表页
│   │       ├── [id]/       
│   │       │    └── page.js        // SSR 博客详情/编辑页
│   │       └── new/
│   │            └── page.js        // SSR 博客新增页
│   ├── components/                 // Client Component 复用组件
│   │    ├── PostList.jsx           // 博客列表展示
│   │    ├── TextArea.jsx           // 博客编辑/展示区
│   │    ├── CommentArea.jsx        // 博客评论区
│   │    └── AIGenerationForm.jsx   // AI初始生成表单
│   ├── package.json
│   └── next.config.mjs
│
├── server/                         // 后端（Express + MySQL）
│   ├── index.js                    // Express 主入口
│   ├── routes/
│   │   ├── posts.js                // GET/POST /posts
│   │   ├── comments.js             // GET/POST /comments
│   │   └── ai-helper.js            // GET/POST /ai
│   ├── db/                         // MySQL 连接池
│   │   └── index.js
│   ├── controllers/                // 逻辑处理
│   │   ├── posts.js
│   │   ├── comments.js
│   │   └── ai-helper.js
│   ├── package.json
│   └── .env                        // 环境变量（db info，AI API key）
│
└── README.md
```
## 核心架构说明
### 1. SSR 渲染（React Server Components）
* 项目使用 Next.js App Router 的 RSC 实现 SSR
  * 列表页：在服务器端 fetch posts → 渲染 HTML
  * 详情页：在服务器端 fetch post → 渲染 HTML + 初始 Markdown 内容
  * 新建/编辑页：SSR 提供初始数据，编辑在 Client Component 里完成
* 优点：
  * ✔ 更快首屏
  * ✔ SEO 友好
  * ✔ 代码结构清晰
  * ✔ 数据直接注入页面，无需二次 fetch

### 2. Client Components（交互层）
* 示例：TextArea
  * useState管理文本
  * 用fetch调用Express API
  * 保存成功后router.refresh()，重新触发SSR
```
const router = useRouter();
await fetch(`/posts/${id}`, { method: "POST", body: JSON.stringify({...}) });
router.refresh(); // SSR 再渲染一次，拿到最新内容
```
### 3. Express + MySQL 后端分层结构
* routes：接收路由 → 调用 controller
* controllers：进行逻辑处理
* db：连接 MySQL，执行 SQL query

## 如何运行
1. 启动前端
```
cd client
npm install
npm run dev
```
2. 启动后端
```
cd server
npm install
npm run dev
```
按照.env.example内格式进行环境配置：
```cp .env.example .env```

> 免费获取一个[Groq API key](https://console.groq.com/keys)和[Gemini API key](https://aistudio.google.com/app/apikey?_gl=1*1c81p5h*_ga*NzM3NDQ1NTkyLjE3NjQ0MzkxNzQ.*_ga_P1DBVKWT6V*czE3NjQ1NTk4NjYkbzQkZzEkdDE3NjQ1NjA3NjUkajEyJGwwJGgxNjc1OTYyMjc0)

3. 启动数据库（用 docker）

> 如果你没有 docker 客户端，需要[前往下载](https://www.docker.com/products/docker-desktop/)

同样在.env中完成db环境配置
```docker compose up -d```



## 长期目标：
- [ ] 文章标签筛选
- [ ] 加密登录系统
- [ ] 支持文章AI续写
- [ ] task分离 Python AI 微服务
- [ ] 支持向量数据库（检索增强）、文本分析、NLP、embedding 管理
