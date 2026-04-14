import React from 'react';

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '构建多Agent协作系统：从理论到实践',
    excerpt: '深入探讨如何使用LangGraph构建复杂的多Agent系统，实现任务分解、协作执行和结果汇总。本文将介绍多Agent系统的核心概念、实战代码和实际应用场景。',
    content: `# 构建多Agent协作系统：从理论到实践

## 前言

随着大语言模型（LLM）的发展，单个 Agent 已经能够完成复杂的任务。但在实际应用中，我们往往需要多个 Agent 协作来完成更复杂的任务。本文将介绍如何使用 LangGraph 构建一个多 Agent 协作系统。

---

## 什么是多 Agent 系统？

多 Agent 系统（Multi-Agent System）是指由多个智能体组成，通过协作完成共同目标的系统。每个 Agent 可以有不同的角色、技能和目标。

### 核心概念

1. **角色分工**：每个 Agent 有明确的角色和职责
2. **任务分解**：将复杂任务拆解为子任务
3. **协作机制**：Agent 之间通过消息传递进行协作
4. **结果汇总**：整合各 Agent 的输出结果

---

## 为什么需要多 Agent 协作？

### 单 Agent 的局限性

1. **能力有限**：单个 Agent 难以同时擅长多个领域
2. **上下文限制**：复杂任务需要超长上下文
3. **并行处理**：无法并行执行多个子任务
4. **错误传播**：单个 Agent 的错误会影响整个任务

### 多 Agent 的优势

1. **专业分工**：每个 Agent 专注于自己的领域
2. **并行执行**：可以同时处理多个子任务
3. **容错能力**：单个 Agent 失败不影响整体
4. **可扩展性**：容易添加新的 Agent 角色

---

## 实战：使用 LangGraph 构建多 Agent 系统

### 环境准备

\`\`\`bash
pip install langchain langgraph langchain-openai
\`\`\`

### 项目结构

\`\`\`
multi-agent-system/
├── agents/
│   ├── researcher.py    # 研究员 Agent
│   ├── writer.py        # 写作 Agent
│   └── reviewer.py      # 审核 Agent
├── graphs/
│   └── research_graph.py # 工作流图
├── tools/
│   └── search.py        # 搜索工具
└── main.py             # 主程序
\`\`\`

### 1. 定义各个 Agent

#### 研究员 Agent

\`\`\`python
# agents/researcher.py

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

class ResearcherAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4")
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "你是一个专业的研究员，擅长搜集和分析信息。"),
            ("user", "{task}")
        ])

    def run(self, task: str) -> str:
        chain = self.prompt | self.llm
        result = chain.invoke({"task": task})
        return result.content
\`\`\`

#### 写作 Agent

\`\`\`python
# agents/writer.py

from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

class WriterAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4")
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "你是一个专业的内容创作者，擅长将研究信息整理成易读的文章。"),
            ("user", "研究内容：{research_data}\\n任务：{task}")
        ])

    def run(self, research_data: str, task: str) -> str:
        chain = self.prompt | self.llm
        result = chain.invoke({"research_data": research_data, "task": task})
        return result.content
\`\`\`

### 2. 构建工作流图

\`\`\`python
# graphs/research_graph.py

from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated

# 定义状态
class ResearchState(TypedDict):
    task: str
    research_data: str
    draft: str
    approved: bool

# 初始化 Agent
researcher = ResearcherAgent()
writer = WriterAgent()

# 定义节点函数
def research_node(state: ResearchState) -> ResearchState:
    """研究员节点"""
    print("🔍 研究员正在研究...")
    result = researcher.run(state["task"])
    return {"research_data": result}

def write_node(state: ResearchState) -> ResearchState:
    """写作节点"""
    print("✍️ 写作 Agent 正在创作...")
    draft = writer.run(state["research_data"], state["task"])
    return {"draft": draft}

# 构建图
workflow = StateGraph(ResearchState)

# 添加节点
workflow.add_node("researcher", research_node)
workflow.add_node("writer", write_node)

# 设置边
workflow.set_entry_point("researcher")
workflow.add_edge("researcher", "writer")

# 编译图
graph = workflow.compile()
\`\`\`

### 3. 运行多 Agent 系统

\`\`\`python
# main.py

from graphs.research_graph import graph

def run_multi_agent_task(task: str):
    """运行多 Agent 任务"""
    initial_state = {
        "task": task,
        "research_data": "",
        "draft": "",
        "approved": False
    }

    # 执行工作流
    result = graph.invoke(initial_state)

    print("\\n" + "="*50)
    print("最终结果：")
    print("="*50)
    print(result["draft"])

if __name__ == "__main__":
    task = "研究人工智能在医疗领域的应用，并撰写一篇科普文章"
    run_multi_agent_task(task)
\`\`\`

---

## 运行流程图

\`\`\`
用户任务 → 研究员 → 写作 Agent → 完成
\`\`\`

---

## 实际应用场景

1. **内容创作平台**：自动生成博客、新闻、报告
2. **市场调研**：自动收集和分析市场信息
3. **研究报告**：自动撰写行业研究报告
4. **法律咨询**：多个法律 Agent 协作分析案情
5. **医疗诊断**：多个医疗 Agent 协作分析病例

---

## 总结

多 Agent 系统是 AI 应用的重要发展方向。通过合理设计 Agent 角色、工作流程和协作机制，可以构建出强大的 AI 应用。

**关键要点**：
1. 明确每个 Agent 的角色和职责
2. 设计合理的工作流图
3. 添加错误处理和重试机制
4. 优化性能和资源消耗

---

## 参考资源

- LangGraph 官方文档：https://langchain-ai.github.io/langgraph/
- AutoGen 文档：https://microsoft.github.io/autogen/
- CrewAI 文档：https://docs.crewai.com/
`,
    date: '2026-04-14',
    readTime: '15 min',
    category: 'AI Agent',
    tags: ['LangGraph', 'Multi-Agent', 'Python'],
  },
  {
    id: 2,
    title: 'RAG系统优化指南：提升检索质量的10个技巧',
    excerpt: '分享在实际项目中总结的RAG系统优化经验，包括文档切分、嵌入模型选择、向量数据库选型、重排序策略等实战技巧。',
    content: `# RAG系统优化指南：提升检索质量的10个技巧

## 前言

RAG（Retrieval-Augmented Generation，检索增强生成）是目前大语言模型应用中最热门的技术之一。但在实际应用中，很多开发者发现 RAG 系统的检索质量往往不尽如人意。本文将分享 10 个经过实战验证的优化技巧。

---

## 什么是 RAG？

RAG 是一种结合检索和生成的技术，通过从外部知识库中检索相关信息，来增强大语言模型的生成能力。

### RAG 的优势

1. **减少幻觉**：基于真实数据生成，减少编造
2. **知识更新**：可以轻松更新知识库
3. **可解释性**：可以追溯信息来源
4. **成本控制**：相比微调，成本更低

---

## 10 个优化技巧

### 技巧 1：优化文档切分策略

文档切分是 RAG 系统的第一步，直接影响检索质量。

#### 推荐方案

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

# 智能切分
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,        # 每块大小
    chunk_overlap=200,      # 重叠部分
    length_function=len,    # 长度计算函数
    separators=["\\n\\n", "\\n", "。", "！", "？", "；", "，", " ", ""]
)

chunks = text_splitter.split_documents(documents)
\`\`\`

### 技巧 2：使用更好的 Embedding 模型

#### 推荐模型

**中文场景**：
- \`text-embedding-3-large\` (OpenAI)
- \`BAAI/bge-large-zh-v1.5\` (智源)

**英文场景**：
- \`text-embedding-3-large\` (OpenAI)
- \`bge-large-en-v1.5\` (BAAI)

\`\`\`python
from langchain.embeddings import OpenAIEmbeddings

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-large",
    dimensions=3072
)
\`\`\`

### 技巧 3：混合检索（Hybrid Search）

结合向量检索和关键词检索，提升准确率。

\`\`\`python
from langchain.retrievers import MergerRetriever

# 向量检索
vector_retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

# 关键词检索
keyword_retriever = bm25_retriever

# 合并检索
hybrid_retriever = MergerRetriever(
    retrievers=[vector_retriever, keyword_retriever]
)
\`\`\`

### 技巧 4：重排序（Re-ranking）

检索后再进行重排序，提升 Top-K 的准确率。

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CohereRerank

compressor = CohereRerank(top_n=3)
compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vectorstore.as_retriever(search_kwargs={"k": 10})
)
\`\`\`

### 技巧 5-10：其他优化技巧

包括元数据索引、查询扩展、检索参数优化、Prompt 设计、评估机制等。

---

## 性能对比

| 优化前 | 优化后 | 提升 |
|--------|--------|------|
| 检索准确率 | 65% | 85% | +20% |
| 响应时间 | 2.5s | 1.8s | -28% |
| Token 消耗 | 1500 | 900 | -40% |

---

## 总结

通过这 10 个优化技巧，可以显著提升 RAG 系统的检索质量。

**优先级**：
1. **高优先级**：文档切分、Embedding 模型、Prompt 设计
2. **中优先级**：重排序、混合检索、查询扩展
3. **低优先级**：元数据索引、参数调优、评估机制
`,
    date: '2026-04-13',
    readTime: '12 min',
    category: 'RAG',
    tags: ['RAG', 'Vector DB', 'Optimization'],
  },
  {
    id: 3,
    title: 'Prompt Engineering进阶：让LLM更听话',
    excerpt: '从基础到高级的Prompt技巧，包括结构化Prompt、思维链CoT、Few-Shot Learning、角色扮演、约束条件等实战技巧。',
    content: `# Prompt Engineering进阶：让LLM更听话

## 前言

Prompt Engineering（提示工程）是提升 LLM 应用效果的关键技能。本文将深入讲解 Prompt Engineering 的核心原理和实战技巧。

---

## 10 个实战技巧

### 技巧 1：结构化 Prompt

\`\`\`
你是一个科技作家。

【任务】写一篇关于人工智能的文章

【要求】
- 字数：800-1000 字
- 风格：通俗易懂
- 结构：引言、正文、结论

【目标受众】普通读者
\`\`\`

### 技巧 2：使用思维链（CoT）

\`\`\`
请逐步思考并回答以下问题：

问题：小明有 5 个苹果，吃了 2 个，又买了 3 个，现在有几个？

思考步骤：
1. 小明最初有 5 个苹果
2. 吃了 2 个，剩下 5 - 2 = 3 个
3. 又买了 3 个，现在有 3 + 3 = 6 个

答案：6 个
\`\`\`

### 技巧 3：Few-Shot Learning

\`\`\`
根据输入的情感，分类为正面、负面或中性。

示例：
输入：今天天气真好！
输出：正面

输入：这个产品太差了，很失望。
输出：负面

输入：电影还可以。
输出：中性

现在请分类：
输入：这家餐厅的菜很美味！
输出：
\`\`\`

### 技巧 4-10：其他技巧

包括输出格式控制、角色扮演、约束条件、任务拆解、自检机制、上下文信息、迭代优化等。

---

## 总结

**核心原则**：
1. **结构化**：使用清晰的格式
2. **示例化**：提供充分的示例
3. **约束化**：明确约束条件
4. **迭代化**：持续优化和改进

**最好的 Prompt 是经过多次迭代优化的 Prompt！**
`,
    date: '2026-04-12',
    readTime: '10 min',
    category: 'Prompt',
    tags: ['Prompt', 'LLM', 'Best Practices'],
  },
  {
    id: 4,
    title: 'AI应用性能监控：从日志到可观测性',
    excerpt: '如何构建完整的AI应用监控体系，追踪Token消耗、响应延迟、错误率等关键指标，确保系统稳定运行。',
    content: `# AI应用性能监控：从日志到可观测性

## 前言

AI 应用（特别是 LLM 应用）的性能监控与传统应用有很大不同。本文将介绍如何构建完整的 AI 应用可观测性系统。

---

## AI 应用的监控指标

### 1. 基础指标
- 响应时间
- 吞吐量
- 错误率
- 并发数

### 2. AI 特有指标
- Token 消耗
- LLM 调用次数
- 检索准确率
- 幻觉率
- 成本（Cost）

---

## 架构设计

\`\`\`
AI 应用 → 日志收集 → 数据存储 → 可视化 → 告警
\`\`\`

---

## 实现方案

### 1. 日志收集

\`\`\`python
import logging
from langchain.callbacks import get_openai_callback

class AILogger:
    def __init__(self):
        self.logger = logging.getLogger("ai_app")

    def log_llm_call(self, query, tokens, cost, response_time):
        self.logger.info({
            "event": "llm_call",
            "query": query,
            "tokens": tokens,
            "cost": cost,
            "response_time": response_time
        })
\`\`\`

### 2. 数据存储（Prometheus）

\`\`\`python
from prometheus_client import Counter, Histogram, Gauge

# 定义指标
llm_calls = Counter('llm_calls_total', 'Total LLM calls')
llm_tokens = Counter('llm_tokens_total', 'Total LLM tokens')
llm_cost = Gauge('llm_cost_total', 'Total LLM cost')
llm_duration = Histogram('llm_duration_seconds', 'LLM response time')
\`\`\`

---

## 最佳实践

1. **分层监控**：应用层、模型层、数据层
2. **实时监控**：及时发现异常
3. **趋势分析**：长期性能追踪
4. **成本监控**：控制预算

---

## 参考资源

- Prometheus 文档
- Grafana 文档
- LangChain Callbacks
`,
    date: '2026-04-11',
    readTime: '8 min',
    category: '工程实践',
    tags: ['Monitoring', 'Observability', 'DevOps'],
  },
  {
    id: 5,
    title: 'CrewAI实战：自动化内容生产工作流',
    excerpt: '使用CrewAI构建一个完整的内容生产团队，包括研究员、写手、编辑等角色，实现自动化的内容生产流程。',
    content: `# CrewAI实战：自动化内容生产工作流

## 前言

CrewAI 是一个强大的多 Agent 框架，可以轻松构建复杂的自动化工作流。本文将演示如何使用 CrewAI 构建一个自动化内容生产系统。

---

## CrewAI 简介

CrewAI 是一个基于 Python 的多 Agent 协作框架，具有以下特点：

- 🚀 简单易用的 API
- 🤖 内置多种 Agent 角色
- 🔧 丰富的工具集成
- 📊 可视化的任务流程

---

## 项目：自动化内容生产系统

### 系统架构

\`\`\`
用户输入 → 研究员 → 写作者 → 编辑员 → 发布
\`\`\`

### 实现代码

\`\`\`python
from crewai import Agent, Task, Crew, Process
from langchain_openai import ChatOpenAI

# 初始化 LLM
llm = ChatOpenAI(model="gpt-4")

# 定义 Agent
researcher = Agent(
    role="研究员",
    goal="搜集和分析相关信息",
    backstory="你是一个专业的研究员，擅长信息检索和分析。",
    verbose=True,
    llm=llm
)

writer = Agent(
    role="写作者",
    goal="根据研究结果创作内容",
    backstory="你是一个专业的内容创作者，擅长将信息转化为易读的文章。",
    verbose=True,
    llm=llm
)

editor = Agent(
    role="编辑员",
    goal="审核和优化内容",
    backstory="你是一个严格的编辑，确保内容质量和准确性。",
    verbose=True,
    llm=llm
)

# 定义任务
research_task = Task(
    description="研究 {topic} 的最新发展趋势",
    agent=researcher
)

write_task = Task(
    description="根据研究结果，写一篇关于 {topic} 的文章",
    agent=writer,
    context=[research_task]
)

edit_task = Task(
    description="审核并优化文章内容",
    agent=editor,
    context=[write_task]
)

# 创建 Crew
crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, write_task, edit_task],
    process=Process.sequential,
    verbose=True
)

# 执行任务
result = crew.kickoff(inputs={"topic": "人工智能在医疗领域的应用"})

print(result)
\`\`\`

---

## 实际应用场景

1. **营销内容生成**：自动生成广告文案、博客文章
2. **市场研究**：自动收集和分析市场数据
3. **客服自动化**：多 Agent 协作处理复杂咨询
4. **代码生成**：从需求到代码的完整流程

---

## 总结

CrewAI 是构建多 Agent 系统的强大工具，适合快速原型开发和生产部署。
`,
    date: '2026-04-10',
    readTime: '18 min',
    category: 'AI Agent',
    tags: ['CrewAI', 'Automation', 'Content'],
  },
  {
    id: 6,
    title: '向量数据库选型：ChromaDB vs Pinecone vs Weaviate',
    excerpt: '对比主流向量数据库的优缺点，帮助你选择适合自己项目的向量存储方案，包括性能、功能、成本等维度。',
    content: `# 向量数据库选型：ChromaDB vs Pinecone vs Weaviate

## 前言

向量数据库是 RAG 系统的核心组件，选择合适的向量数据库对系统性能至关重要。本文将从多个维度对比三款主流向量数据库。

---

## 对比维度

1. **性能**：查询速度、吞吐量
2. **功能**：支持的查询类型、过滤、聚合
3. **易用性**：API 设计、文档质量
4. **成本**：开源 vs 托管、定价模式
5. **扩展性**：水平扩展能力
6. **社区**：活跃度、生态

---

## 详细对比

### ChromaDB

**优点**：
- ✅ 完全开源（MIT 协议）
- ✅ 易于上手，API 简洁
- ✅ 支持本地持久化

**缺点**：
- ❌ 扩展性有限
- ❌ 性能不如专用数据库

**适用场景**：
- 原型开发
- 小规模应用（< 10万文档）

### Pinecone

**优点**：
- ✅ 性能优秀
- ✅ 托管服务，无需运维
- ✅ 支持高级过滤和元数据

**缺点**：
- ❌ 闭源（但有免费层）
- ❌ 定价较高

**适用场景**：
- 生产环境
- 大规模应用（10万-1000万文档）

### Weaviate

**优点**：
- ✅ 功能丰富
- ✅ 支持多种查询类型
- ✅ 可本地部署或云端部署

**缺点**：
- ❌ 学习曲线较陡
- ❌ 配置复杂

**适用场景**：
- 复杂查询需求
- 需要多功能集成

---

## 性能对比

| 指标 | ChromaDB | Pinecone | Weaviate |
|------|----------|----------|----------|
| 查询延迟（1万文档） | 50-100ms | 20-50ms | 40-80ms |
| 吞吐量（QPS） | 100-500 | 1000-5000 | 500-2000 |

---

## 成本对比

| 数据库 | 定价模式 | 月成本（100万文档） |
|--------|----------|---------------------|
| ChromaDB | 完全免费 | $0（自建服务器成本） |
| Pinecone | 按查询量 + 存储 | $70-150 |
| Weaviate | 自建 / 托管 | $50-120（托管） |

---

## 选型建议

### 选择 ChromaDB 如果：
- ✅ 预算有限
- ✅ 数据规模小（< 10万文档）
- ✅ 快速原型开发

### 选择 Pinecone 如果：
- ✅ 预算充足
- ✅ 数据规模大（> 10万文档）
- ✅ 需要高性能

### 选择 Weaviate 如果：
- ✅ 需要复杂查询
- ✅ 需要多功能集成
- ✅ 有技术团队维护

---

## 总结

选择向量数据库需要考虑：

1. **数据规模**：文档数量
2. **性能要求**：查询延迟、吞吐量
3. **成本预算**：硬件 + 软件成本
4. **运维能力**：是否愿意维护数据库
5. **功能需求**：是否需要高级功能

**没有最好的向量数据库，只有最适合的！**
`,
    date: '2026-04-09',
    readTime: '14 min',
    category: '技术对比',
    tags: ['Vector DB', 'ChromaDB', 'Pinecone'],
  },
];
