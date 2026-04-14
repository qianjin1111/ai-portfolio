# 智能 RAG 知识库问答系统 - 实施指南

本文档提供一步一步的实施指南，帮助开发者从零开始构建智能 RAG 知识库问答系统。

## 📅 实施路线图

### 阶段 1：基础 RAG 能力（1-2 周）

#### 第 1 天：项目初始化

**目标**：搭建项目基础框架

**任务清单**：
- [ ] 创建 GitHub 仓库
- [ ] 克隆项目到本地
- [ ] 运行初始化脚本：`python init_rag_project.py`
- [ ] 配置环境变量（`.env`）
- [ ] 安装依赖：`pip install -r requirements.txt`
- [ ] 启动 FastAPI 服务器验证：`python app/main.py`
- [ ] 访问 http://localhost:8000/docs 确认 API 文档可访问

**验证标准**：
- 项目目录结构完整
- FastAPI 服务器正常启动
- API 文档页面可访问

---

#### 第 2-3 天：文档解析模块

**目标**：实现文档上传和内容提取

**任务清单**：
- [ ] 实现文档上传 API（`app/api/documents.py`）
  - 支持文件上传接口
  - 文件类型验证
  - 文件大小限制
- [ ] 实现文档解析器（`app/core/document_parser.py`）
  - PDF 文本提取：使用 `pypdf`
  - Word 文本提取：使用 `python-docx`
  - Markdown 解析：使用 `markdown`
  - 纯文本读取
- [ ] 实现文档数据模型（`app/models/document.py`）
  - Document 模型定义
  - 数据库表结构
- [ ] 实现文档存储逻辑
  - 保存文件到 `data/uploads/`
  - 提取文档元数据（标题、作者、创建时间等）
- [ ] 编写单元测试

**验证标准**：
- 可以上传 PDF、Word、Markdown 文件
- 文档内容正确提取
- 文档元数据保存到数据库

**代码示例**：
```python
# app/core/document_parser.py
from pypdf import PdfReader
from docx import Document
from typing import Dict, Any

class DocumentParser:
    """文档解析器"""

    @staticmethod
    def parse_pdf(file_path: str) -> Dict[str, Any]:
        """解析 PDF 文件"""
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return {
            "content": text,
            "page_count": len(reader.pages),
            "metadata": reader.metadata
        }

    @staticmethod
    def parse_docx(file_path: str) -> Dict[str, Any]:
        """解析 Word 文件"""
        doc = Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return {"content": text, "metadata": doc.core_properties}

    @staticmethod
    def parse_markdown(file_path: str) -> Dict[str, Any]:
        """解析 Markdown 文件"""
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
        return {"content": text, "metadata": {}}
```

---

#### 第 4-5 天：文档分块模块

**目标**：实现智能文档分块策略

**任务清单**：
- [ ] 实现基础分块器（`app/core/chunker.py`）
  - 固定大小分块
  - 重叠分块
- [ ] 实现语义分块器
  - 基于段落和标题的分块
  - 基于语义相似度的分块
- [ ] 实现分块配置
  - `CHUNK_SIZE`：默认 1000 字符
  - `CHUNK_OVERLAP`：默认 200 字符
- [ ] 编写单元测试

**验证标准**：
- 文档正确分割成多个 chunk
- Chunk 之间有适当的重叠
- 不会破坏句子完整性

**代码示例**：
```python
# app/core/chunker.py
from typing import List, Dict

class DocumentChunker:
    """文档分块器"""

    def __init__(self, chunk_size: int = 1000, overlap: int = 200):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_text(self, text: str) -> List[Dict]:
        """将文本分块"""
        chunks = []
        start = 0

        while start < len(text):
            end = start + self.chunk_size

            # 尝试在句子边界处分割
            if end < len(text):
                end = self._find_sentence_boundary(text, end)

            chunk = text[start:end].strip()
            if chunk:
                chunks.append({
                    "content": chunk,
                    "metadata": {"start": start, "end": end}
                })

            start = end - self.overlap

        return chunks

    def _find_sentence_boundary(self, text: str, position: int) -> int:
        """查找句子边界"""
        punctuation = ['.', '!', '?', '。', '！', '？']

        # 向后查找最近的标点符号
        for i in range(position, min(position + 100, len(text))):
            if text[i] in punctuation:
                return i + 1

        return position
```

---

#### 第 6-7 天：向量化模块

**目标**：实现文本向量化

**任务清单**：
- [ ] 实现向量化器（`app/core/embedding.py`）
  - 使用 OpenAI Embeddings API
  - 批量向量化（提高效率）
  - 向量缓存（避免重复计算）
- [ ] 实现向量存储工具（`app/utils/vector_store.py`）
  - ChromaDB 集成
  - 向量索引管理
  - 相似度搜索
- [ ] 实现数据模型
  - Chunk 模型
  - 向量数据存储
- [ ] 编写单元测试

**验证标准**：
- 文本可以正确向量化
- 向量存储到 ChromaDB
- 可以执行相似度搜索

**代码示例**：
```python
# app/core/embedding.py
from openai import OpenAI
from typing import List
import numpy as np

class EmbeddingService:
    """向量化服务"""

    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)
        self.model = "text-embedding-ada-002"

    def embed_text(self, text: str) -> List[float]:
        """将文本向量化"""
        response = self.client.embeddings.create(
            model=self.model,
            input=text
        )
        return response.data[0].embedding

    def embed_batch(self, texts: List[str], batch_size: int = 100) -> List[List[float]]:
        """批量向量化"""
        embeddings = []

        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            response = self.client.embeddings.create(
                model=self.model,
                input=batch
            )
            embeddings.extend([item.embedding for item in response.data])

        return embeddings

    def calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """计算余弦相似度"""
        vec1 = np.array(embedding1)
        vec2 = np.array(embedding2)

        similarity = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))
        return float(similarity)
```

---

#### 第 8-10 天：检索和问答模块

**目标**：实现 RAG 检索和问答功能

**任务清单**：
- [ ] 实现检索器（`app/core/retriever.py`）
  - 向量相似度搜索
  - Top-K 检索
  - 相似度阈值过滤
- [ ] 实现 RAG Chain（`app/core/rag_chain.py`）
  - 检索 Prompt 模板
  - LLM 生成答案
  - 上下文管理
- [ ] 实现问答 API（`app/api/qa.py`）
  - 单轮问答接口
  - 多轮对话接口
  - 答案返回格式
- [ ] 编写集成测试

**验证标准**：
- 可以根据问题检索相关文档
- LLM 可以基于检索到的文档生成答案
- 答案包含引用来源

**代码示例**：
```python
# app/core/rag_chain.py
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from typing import List, Dict

class RAGChain:
    """RAG 问答链"""

    def __init__(self, api_key: str):
        self.llm = ChatOpenAI(
            api_key=api_key,
            model="gpt-4",
            temperature=0.7
        )
        self.prompt_template = self._create_prompt_template()

    def _create_prompt_template(self) -> ChatPromptTemplate:
        """创建 Prompt 模板"""
        template = """你是一个专业的知识库问答助手。请根据以下检索到的文档内容回答用户的问题。

文档内容：
{context}

用户问题：
{question}

请回答问题，并在答案中引用相关的文档内容。如果文档中没有相关信息，请明确告知。

回答："""

        return ChatPromptTemplate.from_template(template)

    def generate_answer(self, question: str, retrieved_docs: List[Dict]) -> str:
        """生成答案"""
        # 构建上下文
        context = "\n\n".join([
            f"文档 {i+1}：{doc['content']}"
            for i, doc in enumerate(retrieved_docs)
        ])

        # 生成 Prompt
        prompt = self.prompt_template.format(
            context=context,
            question=question
        )

        # 调用 LLM
        response = self.llm.invoke(prompt)

        return response.content
```

---

#### 第 11-12 天：前端界面

**目标**：实现简单的前端界面

**任务清单**：
- [ ] 搭建 React 项目（Vite）
- [ ] 实现文档上传页面
  - 文件选择器
  - 上传进度显示
  - 文档列表展示
- [ ] 实现问答页面
  - 对话界面
  - 消息展示
  - 引用来源展示
- [ ] 集成 API 调用
- [ ] 样式美化

**验证标准**：
- 可以上传文档
- 可以提问并查看答案
- 界面美观易用

---

#### 第 13-14 天：测试和优化

**目标**：完善测试和性能优化

**任务清单**：
- [ ] 完善单元测试（覆盖率 > 80%）
- [ ] 编写集成测试
- [ ] 性能优化
  - 向量检索优化
  - 缓存机制
  - 异步处理
- [ ] 错误处理和日志
- [ ] 文档完善

**验证标准**：
- 所有测试通过
- 响应时间 < 3 秒
- 错误日志完整

---

### 阶段 2：检索优化（2-3 周）

**目标**：提高检索准确率和性能

**主要任务**：
- [ ] 混合检索（BM25 + 向量检索）
- [ ] 查询重写
- [ ] Cross-Encoder 重排序
- [ ] 批量查询优化
- [ ] 缓存机制

**预期成果**：
- 检索准确率提升到 85%+
- 响应时间降低 50%

---

### 阶段 3：企业级功能（3-4 周）

**目标**：支持多用户和多知识库

**主要任务**：
- [ ] 用户认证和授权
- [ ] 多知识库管理
- [ ] 权限控制
- [ ] 监控和分析
- [ ] API 文档完善

**预期成果**：
- 支持多用户使用
- 支持多个知识库
- 完整的监控体系

---

### 阶段 4：高级特性（4-6 周）

**目标**：支持多模态和高级功能

**主要任务**：
- [ ] 图片 OCR
- [ ] 表格数据提取
- [ ] 插件系统
- [ ] 分布式部署
- [ ] 性能优化

**预期成果**：
- 支持图片内容检索
- 支持自定义扩展
- 支持大规模部署

---

## 📊 进度跟踪

使用以下表格跟踪项目进度：

| 阶段 | 任务 | 状态 | 完成日期 | 备注 |
|------|------|------|----------|------|
| 阶段 1 | 项目初始化 | ⏳ 进行中 | - | - |
| 阶段 1 | 文档解析模块 | ⏸️ 未开始 | - | - |
| 阶段 1 | 文档分块模块 | ⏸️ 未开始 | - | - |
| 阶段 1 | 向量化模块 | ⏸️ 未开始 | - | - |
| 阶段 1 | 检索和问答模块 | ⏸️ 未开始 | - | - |
| 阶段 1 | 前端界面 | ⏸️ 未开始 | - | - |
| 阶段 1 | 测试和优化 | ⏸️ 未开始 | - | - |
| 阶段 2 | 检索优化 | ⏸️ 未开始 | - | - |
| 阶段 3 | 企业级功能 | ⏸️ 未开始 | - | - |
| 阶段 4 | 高级特性 | ⏸️ 未开始 | - | - |

---

## 🛠️ 常用命令

### 开发
```bash
# 启动开发服务器
python app/main.py

# 运行测试
pytest

# 代码格式化
black app/
isort app/

# 类型检查
mypy app/
```

### 数据库
```bash
# 初始化数据库
python scripts/init_db.py

# 运行迁移
alembic upgrade head

# 创建迁移
alembic revision --autogenerate -m "描述"
```

### Docker
```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

---

## 📚 参考资料

- [LangChain 文档](https://python.langchain.com/)
- [ChromaDB 文档](https://docs.trychroma.com/)
- [FastAPI 文档](https://fastapi.tiangolo.com/)
- [OpenAI API 文档](https://platform.openai.com/docs)

---

## 💡 最佳实践

1. **代码质量**：遵循 PEP 8 规范，使用类型注解
2. **测试优先**：为每个功能编写测试
3. **文档完善**：及时更新文档和注释
4. **性能监控**：使用日志和监控工具
5. **安全第一**：注意 API Key 和敏感信息保护

---

**祝你开发顺利！如有问题，欢迎提 Issue 或 Pull Request！**
