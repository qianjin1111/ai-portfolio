# 智能 RAG 知识库问答系统 - 快速启动指南

## 🎯 第一步：创建 GitHub 项目

1. 访问 https://github.com/new
2. 填写项目信息：
   - **Repository name**: `smart-rag-qa-system`
   - **Description**: 企业级检索增强生成（RAG）系统，支持多模态文档解析、向量检索、重排序和智能问答
   - **Public/Private**: 选择 Public 或 Private
3. 点击 **Create repository**

## 📦 第二步：本地项目初始化

```bash
# 1. 克隆项目到本地
git clone https://github.com/qianjin1111/smart-rag-qa-system.git
cd smart-rag-qa-system

# 2. 下载初始化脚本
# 从 ai-portfolio 项目复制以下文件到当前项目：
# - smart-rag-qa-system-README.md
# - init_rag_project.py

# 3. 重命名 README
mv smart-rag-qa-system-README.md README.md

# 4. 运行初始化脚本
python init_rag_project.py

# 5. 提交初始代码
git add .
git commit -m "chore: 项目初始化"
git push origin master
```

## ⚙️ 第三步：配置环境变量

```bash
# 1. 复制环境变量模板
cp .env.example .env

# 2. 编辑 .env 文件，填入你的配置
# 必须配置：
# - OPENAI_API_KEY: 你的 OpenAI API Key
# - DATABASE_URL: PostgreSQL 数据库连接字符串
# - REDIS_URL: Redis 连接字符串
```

**`.env` 文件示例**：
```env
# OpenAI 配置
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002

# 数据库配置
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/smart_rag
REDIS_URL=redis://localhost:6379/0

# ChromaDB 配置
CHROMA_PERSIST_DIR=./data/chroma
CHROMA_COLLECTION_NAME=documents

# FastAPI 配置
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
```

## 🚀 第四步：启动开发服务器

```bash
# 1. 创建虚拟环境（推荐）
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. 安装依赖
pip install -r requirements.txt

# 3. 启动 FastAPI 服务器
python app/main.py
```

启动成功后，访问：
- **API 文档**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **健康检查**: http://localhost:8000/health

## 📚 第五步：查看项目文档

### 主要文档
- **README.md**: 项目概述、技术架构、快速开始
- **IMPLEMENTATION_GUIDE.md**: 详细的实施指南（需要创建）
- **docs/architecture.md**: 架构设计文档（需要创建）
- **docs/api.md**: API 文档（需要创建）

### 实施路线图

按照 `RAG_IMPLEMENTATION_GUIDE.md` 中的步骤进行开发：

**阶段 1：基础 RAG 能力（1-2 周）**
- ✅ 项目初始化
- ⏳ 文档解析模块
- ⏳ 文档分块模块
- ⏳ 向量化模块
- ⏳ 检索和问答模块
- ⏳ 前端界面
- ⏳ 测试和优化

**阶段 2：检索优化（2-3 周）**
- ⏳ 混合检索
- ⏳ 重排序
- ⏳ 查询优化

**阶段 3：企业级功能（3-4 周）**
- ⏳ 用户管理
- ⏳ 多知识库支持
- ⏳ 监控和分析

**阶段 4：高级特性（4-6 周）**
- ⏳ 多模态支持
- ⏳ 插件系统
- ⏳ 分布式部署

## 🛠️ 开发工具推荐

### IDE
- **PyCharm** / **VS Code**: Python 开发
- **Cursor**: AI 辅助编程

### 浏览器扩展
- **React Developer Tools**: 前端调试
- **Thunder Client**: API 测试

### 命令行工具
```bash
# 代码格式化
pip install black isort

# 类型检查
pip install mypy

# 测试框架
pip install pytest pytest-asyncio
```

## 📊 项目进度跟踪

使用 GitHub Projects 或类似工具跟踪进度：

```markdown
## 当前进度

- [ ] 阶段 1: 基础 RAG 能力
  - [x] 项目初始化
  - [ ] 文档解析模块
  - [ ] 文档分块模块
  - [ ] 向量化模块
  - [ ] 检索和问答模块
  - [ ] 前端界面
  - [ ] 测试和优化

## 下一步

- 实现文档解析模块（第 2-3 天）
- 参考 RAG_IMPLEMENTATION_GUIDE.md 中的代码示例
```

## 🆘 常见问题

### Q1: OpenAI API Key 如何获取？
1. 访问 https://platform.openai.com/api-keys
2. 登录或注册 OpenAI 账号
3. 点击 "Create new secret key"
4. 复制 API Key 到 `.env` 文件

### Q2: 如何启动 PostgreSQL 和 Redis？

**使用 Docker**（推荐）：
```bash
docker-compose -f docker/docker-compose.yml up -d postgres redis
```

**本地安装**：
```bash
# PostgreSQL (Ubuntu)
sudo apt install postgresql

# Redis (Ubuntu)
sudo apt install redis-server
```

### Q3: 前端如何启动？

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:3000

### Q4: 如何运行测试？

```bash
# 运行所有测试
pytest

# 运行特定测试文件
pytest tests/unit/test_document_parser.py

# 查看覆盖率
pytest --cov=app --cov-report=html
```

## 📖 学习资源

### 必读文档
- [LangChain 官方文档](https://python.langchain.com/)
- [ChromaDB 官方文档](https://docs.trychroma.com/)
- [FastAPI 教程](https://fastapi.tiangolo.com/tutorial/)
- [OpenAI API 文档](https://platform.openai.com/docs)

### 推荐教程
- [LangChain 快速入门](https://python.langchain.com/docs/get_started/introduction)
- [RAG 实战教程](https://www.deeplearning.ai/short-courses/)
- [向量数据库入门](https://www.pinecone.io/learn/)

## 🤝 贡献代码

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支: `git checkout -b feature/AmazingFeature`
3. 提交更改: `git commit -m 'Add some AmazingFeature'`
4. 推送到分支: `git push origin feature/AmazingFeature`
5. 开启 Pull Request

## 📞 获取帮助

- 📧 Email: your.email@example.com
- 🐛 Issues: https://github.com/qianjin1111/smart-rag-qa-system/issues
- 💬 Discussions: https://github.com/qianjin1111/smart-rag-qa-system/discussions

---

**祝你开发顺利！如有任何问题，请随时提 Issue！** 🚀
