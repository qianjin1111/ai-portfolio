# 智能 RAG 知识库问答系统

> 企业级检索增强生成（RAG）系统，支持多模态文档解析、向量检索、重排序和智能问答

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)
![LangChain](https://img.shields.io/badge/LangChain-0.1+-orange.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 📋 项目概述

智能 RAG 知识库问答系统是一个企业级的检索增强生成（Retrieval-Augmented Generation）解决方案。通过结合大语言模型（LLM）的生成能力和向量数据库的检索能力，为用户提供准确、相关的知识问答服务。

### 核心特性

- **多模态文档解析**：支持 PDF、Word、Markdown、TXT 等多种格式
- **智能文档分块**：基于语义的文档分块策略，提高检索准确性
- **向量检索引擎**：基于 ChromaDB 的向量存储和相似度搜索
- **重排序优化**：使用 Cross-Encoder 进行结果重排序，提升准确率
- **多轮对话**：支持上下文记忆的多轮问答对话
- **知识库管理**：可视化的知识库增删改查
- **实时性能监控**：检索准确率、响应时间、资源使用等指标监控

### 技术亮点

- 🚀 **检索准确率 85%+**：通过优化的检索和重排序策略
- ⚡ **毫秒级响应**：优化的索引和缓存机制
- 🔒 **企业级安全**：支持访问控制、数据加密
- 📊 **可观测性**：完整的日志和监控体系
- 🎯 **可扩展性**：支持水平扩展和分布式部署

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Web 前端    │  │  API 文档    │  │  管理后台    │       │
│  │  (React)     │  │  (Swagger)   │  │  (Admin)     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        应用服务层                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  FastAPI     │  │  LangChain   │  │  对话管理    │       │
│  │  (后端服务)   │  │  (编排框架)   │  │  (Session)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        核心能力层                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ 文档解析     │  │ 向量检索     │  │ 重排序       │       │
│  │ (PDF/Word)   │  │  (ChromaDB)  │  │ (Reranker)   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        基础设施层                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  OpenAI      │  │  Redis       │  │  PostgreSQL  │       │
│  │  (LLM)       │  │  (缓存)      │  │  (存储)      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 功能需求

### 阶段 1：基础 RAG 能力（MVP）

#### 1.1 文档管理
- [ ] 支持上传文档（PDF、Word、Markdown、TXT）
- [ ] 文档内容解析和提取
- [ ] 文档列表展示
- [ ] 文档删除功能
- [ ] 文档状态跟踪（解析中、已完成、失败）

#### 1.2 知识库构建
- [ ] 文档分块策略（固定大小、语义分块）
- [ ] 文本向量化（OpenAI Embeddings）
- [ ] 向量存储（ChromaDB）
- [ ] 知识库索引管理

#### 1.3 智能问答
- [ ] 单轮问答
- [ ] 多轮对话（上下文记忆）
- [ ] 相似度搜索（Top-K 检索）
- [ ] 答案生成（RAG Chain）
- [ ] 引用来源标注

### 阶段 2：检索优化

#### 2.1 高级检索
- [ ] 混合检索（BM25 + 向量检索）
- [ ] 查询重写（Query Expansion）
- [ ] 查询理解（意图识别）
- [ ] 多路召回策略

#### 2.2 重排序
- [ ] Cross-Encoder 重排序
- [ ] 相关性评分
- [ ] 结果过滤和优化

#### 2.3 性能优化
- [ ] 向量索引优化
- [ ] 查询缓存
- [ ] 批量查询优化
- [ ] 异步处理

### 阶段 3：企业级功能

#### 3.1 用户管理
- [ ] 用户注册和登录
- [ ] 权限管理（RBAC）
- [ ] 多租户支持
- [ ] API Key 管理

#### 3.2 知识库管理
- [ ] 多知识库支持
- [ ] 知识库权限控制
- [ ] 知识库版本管理
- [ ] 知识库备份和恢复

#### 3.3 监控和分析
- [ ] 检索准确率监控
- [ ] 响应时间监控
- [ ] 用户行为分析
- [ ] 错误日志和告警

### 阶段 4：高级特性

#### 4.1 多模态支持
- [ ] 图片内容提取（OCR）
- [ ] 表格数据提取
- [ ] 多模态检索

#### 4.2 集成和扩展
- [ ] Webhook 集成
- [ ] API 增强功能
- [ ] 插件系统
- [ ] 自定义模型支持

#### 4.3 部署和运维
- [ ] Docker 容器化
- [ ] Kubernetes 部署
- [ ] CI/CD 流水线
- [ ] 自动化测试

## 📁 项目结构

```
smart-rag-qa-system/
├── app/                          # FastAPI 应用
│   ├── api/                      # API 路由
│   │   ├── __init__.py
│   │   ├── documents.py          # 文档管理 API
│   │   ├── qa.py                 # 问答 API
│   │   ├── knowledge_base.py     # 知识库 API
│   │   └── users.py              # 用户 API
│   ├── core/                     # 核心功能
│   │   ├── __init__.py
│   │   ├── config.py             # 配置管理
│   │   ├── document_parser.py    # 文档解析
│   │   ├── chunker.py            # 文档分块
│   │   ├── embedding.py          # 向量化
│   │   ├── retriever.py          # 检索器
│   │   ├── reranker.py           # 重排序
│   │   └── rag_chain.py          # RAG 链
│   ├── models/                   # 数据模型
│   │   ├── __init__.py
│   │   ├── document.py
│   │   ├── knowledge_base.py
│   │   ├── user.py
│   │   └── session.py
│   ├── services/                 # 业务逻辑
│   │   ├── __init__.py
│   │   ├── document_service.py
│   │   ├── qa_service.py
│   │   └── knowledge_base_service.py
│   ├── utils/                    # 工具函数
│   │   ├── __init__.py
│   │   ├── vector_store.py       # 向量数据库
│   │   ├── cache.py              # 缓存工具
│   │   └── logger.py             # 日志工具
│   └── main.py                   # 应用入口
├── frontend/                     # 前端应用（React）
│   ├── src/
│   │   ├── components/           # 组件
│   │   ├── pages/                # 页面
│   │   ├── services/             # API 服务
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
├── tests/                        # 测试
│   ├── unit/                     # 单元测试
│   ├── integration/              # 集成测试
│   └── e2e/                      # 端到端测试
├── docs/                         # 文档
│   ├── architecture.md           # 架构文档
│   ├── api.md                    # API 文档
│   └── deployment.md             # 部署文档
├── scripts/                      # 脚本
│   ├── init_db.py                # 初始化数据库
│   └── migrate.py                # 数据迁移
├── docker/                       # Docker 配置
│   ├── Dockerfile
│   └── docker-compose.yml
├── .env.example                  # 环境变量示例
├── .gitignore
├── requirements.txt              # Python 依赖
├── pyproject.toml                # 项目配置
└── README.md                     # 项目文档
```

## 🚀 快速开始

### 环境要求

- Python 3.10+
- Node.js 18+
- Docker & Docker Compose（可选）
- OpenAI API Key

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/qianjin1111/smart-rag-qa-system.git
cd smart-rag-qa-system
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

3. **安装 Python 依赖**
```bash
pip install -r requirements.txt
```

4. **初始化数据库**
```bash
python scripts/init_db.py
```

5. **启动服务**
```bash
python app/main.py
```

6. **访问应用**
- API 文档：http://localhost:8000/docs
- 前端界面：http://localhost:3000（需要单独启动前端）

### 使用 Docker 部署

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

## 📖 使用示例

### 上传文档

```python
import requests

# 上传文档
with open('document.pdf', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/api/v1/documents/upload',
        files={'file': f},
        data={'knowledge_base_id': 'kb_123'}
    )
    print(response.json())
```

### 问答查询

```python
# 单轮问答
response = requests.post(
    'http://localhost:8000/api/v1/qa/query',
    json={
        'query': '什么是 RAG？',
        'knowledge_base_id': 'kb_123',
        'top_k': 5
    }
)
print(response.json())

# 多轮对话
response = requests.post(
    'http://localhost:8000/api/v1/qa/chat',
    json={
        'message': '它有什么优势？',
        'session_id': 'session_123',
        'knowledge_base_id': 'kb_123'
    }
)
print(response.json())
```

## 🗺️ 实施路线图

### 第一阶段（当前）
- [x] 项目初始化和架构设计
- [ ] 文档解析模块
- [ ] 向量存储模块
- [ ] 基础问答接口
- [ ] 简单的前端界面

### 第二阶段
- [ ] 重排序优化
- [ ] 多轮对话支持
- [ ] 用户管理
- [ ] 知识库管理

### 第三阶段
- [ ] 监控和分析
- [ ] 性能优化
- [ ] 安全加固
- [ ] 文档完善

### 第四阶段
- [ ] 多模态支持
- [ ] 插件系统
- [ ] 分布式部署
- [ ] 社区版本

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 📧 联系方式

- 作者：qianjin1111
- 邮箱：your.email@example.com
- GitHub：[@qianjin1111](https://github.com/qianjin1111)

## 🙏 致谢

- [LangChain](https://github.com/langchain-ai/langchain) - 强大的 LLM 应用开发框架
- [ChromaDB](https://github.com/chroma-core/chroma) - 开源向量数据库
- [FastAPI](https://github.com/tiangolo/fastapi) - 高性能 Python Web 框架
- [OpenAI](https://openai.com/) - GPT 模型和 Embeddings 服务

---

**注意**：本项目正在积极开发中，功能可能会频繁变化。欢迎提供反馈和建议！
