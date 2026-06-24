# 🏗️ 雪峰GPT — 赛博毒奶版张雪峰

纯娱乐向 Chat Agent，反串玩梗，绝不提供任何真实有效的升学或职业建议。

## 🚀 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/JGGY521/xuefeng-gpt.git
cd xuefeng-gpt

# 2. 安装依赖
npm install

# 3. 启动服务
npm start
```

浏览器打开 **http://localhost:3000** 开唠！

## ⚙️ 接入 AI 大模型（可选）

不配置也能玩——默认走内置的本地 Mock 模式，回复固定但一样搞笑。

想接入真正的 AI：

1. 打开 http://localhost:3000 → 点右上角 **⚙️ 配置大模型**
2. 填入 DeepSeek API Key → 保存
3. 配置自动存到 SQLite 数据库，下次打开还在

> 默认用 DeepSeek，也兼容任何 OpenAI 格式的 API。

## 📁 项目结构

```
├── server.js          # Express 后端
├── db.js              # SQLite 数据库（用户配置持久化）
├── xuefeng-memes.json # 张雪峰真人热梗语料库
├── public/
│   ├── index.html     # 聊天界面
│   ├── style.css      # 赛博工地橙风格
│   └── script.js      # 前端交互
└── package.json
```

## ⚠️ 免责声明

本项目纯属黑色幽默娱乐向作品，所有建议均为反串玩梗，**不构成任何真实有效的升学或职业建议**。信了提桶跑路的，后果自负。
