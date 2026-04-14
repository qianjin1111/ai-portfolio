# Letta (原MemGPT) 多层记忆架构深度分析

## 项目背景与价值分析

Letta（原MemGPT）是一个革命性的AI Agent框架，它解决了当前大语言模型（LLM）应用中一个核心痛点：**如何让AI系统拥有持久化、可学习的记忆能力**。在传统的LLM应用中，模型状态是无状态的，每次对话都从零开始，无法跨越会话保持连贯的知识积累。

Letta的核心理念借鉴了计算机操作系统的虚拟内存管理机制，将LLM的有限上下文窗口（Context Window）视为一种稀缺资源，通过多层内存架构实现高效的信息管理。这种设计使得AI Agent能够：

1. **长期记忆**：存储重要信息跨越多个会话
2. **自适应学习**：根据用户反馈动态调整行为
3. **上下文感知**：在有限的token预算内智能选择相关信息
4. **多会话一致性**：保持跨会话的个性化和偏好记忆

Letta于2024年完成品牌重塑（从MemGPT更名为Letta），并获得了超过100位全球贡献者的支持。该项目在GitHub上获得了超过12k的stars，成为AI Agent领域最受关注的开源项目之一。

## 核心架构图解

### 三层记忆架构

```
┌─────────────────────────────────────────────────────────┐
│                    Letta Agent Architecture              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │         Context Window (LLM Working Memory)      │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │  System Prompt (Core Memory)             │  │    │
│  │  │  - Persona Block                         │  │    │
│  │  │  - Human Block                           │  │    │
│  │  │  - Custom Blocks                         │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │  Conversation History (Recall Memory)     │  │    │
│  │  │  - Recent Messages                       │  │    │
│  │  │  - Summarized Old Messages               │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  │  ┌───────────────────────────────────────────┐  │    │
│  │  │  Tool Definitions                         │  │    │
│  │  │  - Memory Edit Tools                     │  │    │
│  │  │  - Archive Search                        │  │    │
│  │  │  - Business Logic Tools                  │  │    │
│  │  └───────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────┘    │
│                         ▲                                │
│                         │ Page In/Page Out               │
│                         ▼                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │      Archival Memory (Vector Database)          │    │
│  │  - Long-term Facts                            │    │
│  │  - Tagged Memories                            │    │
│  │  - Searchable via Embeddings                  │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │         Database Layer (PostgreSQL)              │    │
│  │  - Agent State                                  │    │
│  │  - Memory Blocks                                │    │
│  │  - Messages                                     │    │
│  │  - Tool Executions                              │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Agent执行流程

```
┌─────────────────────────────────────────────────────────┐
│                 Agent Step Execution Flow               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. INPUT → User Message                                │
│                                                          │
│  2. MEMORY UPDATE → Pull latest blocks from DB          │
│     └─> update_memory_if_changed()                      │
│                                                          │
│  3. CONTEXT BUILDING → Rebuild system prompt            │
│     └─> rebuild_system_prompt()                         │
│     ├─> Core Memory (Blocks)                            │
│     ├─> Memory Metadata                                 │
│     ├─> Tool Definitions                                │
│     └─> Conversation History                            │
│                                                          │
│  4. LLM INFERENCE → Generate response/tool calls         │
│     └─> _get_ai_reply()                                 │
│     ├─> Apply Tool Rules                                │
│     ├─> Send to LLM API                                 │
│     └─> Parse response                                  │
│                                                          │
│  5. TOOL EXECUTION (if tools called)                    │
│     └─> execute_tool_and_persist_state()                │
│     ├─> Memory Edit Tools → Update Blocks               │
│     ├─> Archive Tools → Update Vector DB                │
│     └─> Business Tools → Execute logic                  │
│                                                          │
│  6. MEMORY REBUILD → Refresh system prompt              │
│     └─> rebuild_system_prompt()                         │
│                                                          │
│  7. CHAINING DECISION                                   │
│     ├─> Heartbeat Request? → Continue Loop              │
│     ├─> Function Failed? → Continue with Error          │
│     ├─> Token Warning? → Continue with Warning          │
│     └─> Terminal Tool? → Break Loop                     │
│                                                          │
│  8. OUTPUT → Return final response                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 关键技术实现剖析

### 1. Memory Block系统（核心内存管理）

Letta的核心创新在于将内存抽象为可编辑的"块"（Blocks），这与操作系统的内存页管理机制非常相似。每个Block代表一个独立的信息单元，拥有标签（label）和内容（value）。

```python
# 源码位置: letta/schemas/memory.py
class Memory(BaseModel, validate_assignment=True):
    """
    Represents the in-context memory (i.e. Core memory) of the agent.
    This includes both the `Block` objects (labelled by sections),
    as well as tools to edit the blocks.
    """
    agent_type: Optional[Union["AgentType", str]] = Field(None)
    git_enabled: bool = Field(False)
    blocks: List[Block] = Field(..., description="Memory blocks")
    file_blocks: List[FileBlock] = Field(default_factory=list)

    def get_block(self, label: str) -> Optional[Block]:
        """Retrieve a block by its label"""
        for block in self.blocks:
            if block.label == label:
                return block
        return None

    def compile(self) -> str:
        """Compile all blocks into a single string for the system prompt"""
        compiled_sections = []
        for block in self.blocks:
            compiled_sections.append(
                f"{block.label.upper()}:\n{block.value}"
            )
        return "\n\n".join(compiled_sections)
```

**设计亮点**：
- **标签化存储**：通过label区分不同类型的信息（persona、human、自定义）
- **动态编译**：`compile()`方法将所有块组合成系统提示词
- **版本控制**：支持git-backed memory，实现版本回溯
- **验证机制**：自动检测重复标签，防止数据冲突

### 2. Agent.step()核心执行循环

Agent的step方法是整个框架的核心，它实现了一个智能的执行循环，支持多步骤链式调用（Chaining）。

```python
# 源码位置: letta/agent.py (lines 753-855)
@trace_method
def step(
    self,
    input_messages: List[MessageCreate],
    chaining: bool = True,
    max_chaining_steps: Optional[int] = None,
    put_inner_thoughts_first: bool = True,
    **kwargs,
) -> LettaUsageStatistics:
    """Run Agent.step in a loop, handling chaining via heartbeat requests
    and function failures
    """
    # Clear tool rules solver history
    self.tool_rules_solver.clear_tool_history()

    # Convert MessageCreate to Message objects
    next_input_messages = convert_message_creates_to_messages(
        input_messages, self.agent_state.id, self.agent_state.timezone
    )
    counter = 0
    total_usage = UsageStatistics()
    step_count = 0
    function_failed = False
    steps_messages = []

    while True:
        kwargs["first_message"] = False
        kwargs["step_count"] = step_count
        kwargs["last_function_failed"] = function_failed

        # Execute a single step
        step_response = self.inner_step(
            messages=next_input_messages,
            put_inner_thoughts_first=put_inner_thoughts_first,
            **kwargs,
        )

        heartbeat_request = step_response.heartbeat_request
        function_failed = step_response.function_failed
        token_warning = step_response.in_context_memory_warning
        usage = step_response.usage
        steps_messages.append(step_response.messages)

        step_count += 1
        total_usage += usage
        counter += 1

        # Chain stopping conditions
        if not chaining:
            break
        elif max_chaining_steps is not None and counter > max_chaining_steps:
            break
        elif token_warning and summarizer_settings.send_memory_warning_message:
            # Send warning message and continue
            next_input_messages = [Message.dict_to_message(...)]
            continue
        elif function_failed:
            # Send heartbeat with error and continue
            next_input_messages = [Message.dict_to_message(...)]
            continue
        elif heartbeat_request:
            # Send heartbeat and continue
            next_input_messages = [Message.dict_to_message(...)]
            continue
        else:
            # Terminal condition reached
            break

    return LettaUsageStatistics(
        **total_usage.model_dump(),
        step_count=step_count,
        steps_messages=steps_messages
    )
```

**执行流程分析**：

1. **初始化阶段**：清空工具规则历史，转换消息格式
2. **循环执行**：
   - 调用`inner_step()`执行单步推理
   - 收集使用统计和执行状态
   - 更新步数计数器
3. **链式决策**：根据不同条件决定是否继续循环
   - `heartbeat_request`：Agent主动请求继续
   - `function_failed`：工具执行失败，需要重试
   - `token_warning`：上下文即将溢出，需要处理
   - 终止条件：达到最大步数或完成目标

### 3. Tool Rules Solver（工具调用规则引擎）

Letta引入了一个强大的工具规则系统，允许开发者精确控制Agent的工具调用行为。

```python
# 源码位置: letta/helpers/tool_rules_solver.py (simplified)
class ToolRulesSolver:
    def __init__(self, tool_rules: List[ToolRule]):
        self.tool_rules = tool_rules
        self.tool_call_history = []

    def get_allowed_tool_names(
        self,
        available_tools: Set[str],
        last_function_response: str
    ) -> List[str]:
        """Determine which tools can be called based on rules"""
        allowed_tools = list(available_tools)

        # Apply terminal tool rules
        for rule in self.terminal_tool_rules:
            if rule.condition_met(last_function_response):
                # Allow only terminal tools
                allowed_tools = [rule.tool_name]
                break

        # Apply init tool rules (only for first step)
        if step_count == 0 and self.init_tool_rules:
            allowed_tools = [rule.tool_name for rule in self.init_tool_rules]

        # Apply conditional tool rules
        for rule in self.conditional_tool_rules:
            if rule.should_allow(last_function_response):
                allowed_tools.append(rule.tool_name)

        return allowed_tools

    def register_tool_call(self, function_name: str):
        """Track tool call history for rule evaluation"""
        self.tool_call_history.append(function_name)
```

**规则类型**：

1. **Init Rules**：首次调用时强制执行特定工具
2. **Terminal Rules**：满足条件时只允许调用终止工具
3. **Continue Rules**：工具调用后必须继续执行（heartbeat）
4. **Conditional Rules**：基于历史响应动态调整可用工具

### 4. PromptGenerator（系统提示词生成器）

Letta通过PromptGenerator将内存、工具定义和元数据组合成完整的系统提示词。

```python
# 源码位置: letta/prompts/prompt_generator.py
class PromptGenerator:
    @staticmethod
    def compile_memory_metadata_block(
        memory_edit_timestamp: datetime,
        timezone: str,
        agent_id: str,
        conversation_id: str = "default",
        previous_message_count: int = 0,
        archival_memory_size: Optional[int] = 0,
        archive_tags: Optional[List[str]] = None,
    ) -> str:
        """Generate memory metadata block for system prompt"""
        timestamp_str = format_datetime(memory_edit_timestamp, timezone)

        metadata_lines = [
            "<memory_metadata>",
            f"- AGENT_ID: {agent_id}",
            f"- CONVERSATION_ID: {conversation_id}",
            f"- System prompt last recompiled: {timestamp_str}",
            f"- {previous_message_count} previous messages stored in recall memory",
        ]

        if archival_memory_size is not None and archival_memory_size > 0:
            metadata_lines.append(
                f"- {archival_memory_size} total memories in archival memory"
            )

        if archive_tags:
            metadata_lines.append(
                f"- Available archival memory tags: {', '.join(archive_tags)}"
            )

        metadata_lines.append("</memory_metadata>")
        return "\n".join(metadata_lines)

    @staticmethod
    def get_system_message_from_compiled_memory(
        system_prompt: str,
        memory_with_sources: str,
        agent_id: str,
        in_context_memory_last_edit: datetime,
        timezone: str,
        **kwargs
    ) -> str:
        """Prepare final system message for LLM"""
        # Compile memory metadata
        memory_metadata_string = PromptGenerator.compile_memory_metadata_block(
            memory_edit_timestamp=in_context_memory_last_edit,
            agent_id=agent_id,
            **kwargs
        )

        # Combine memory and metadata
        full_memory_string = memory_with_sources + "\n\n" + memory_metadata_string

        # Inject into system prompt template
        variables = {
            "CORE_MEMORY": full_memory_string,
        }

        return PromptGenerator.safe_format(system_prompt, variables)
```

**关键特性**：

- **元数据注入**：向Agent提供内存状态信息
- **时间戳管理**：追踪最后编辑时间
- **模板安全渲染**：防止模板注入攻击
- **变量保护**：保留未定义变量的占位符

## 性能优化点分析

### 1. Token预算管理

Letta实现了一个复杂的token预算管理系统，确保在有限的上下文窗口内最大化信息密度。

```python
# ContextWindowOverview tracking
class ContextWindowOverview(BaseModel):
    context_window_size_max: int
    context_window_size_current: int
    num_tokens_system: int
    num_tokens_core_memory: int
    num_tokens_messages: int
    num_tokens_functions_definitions: int
    # ... more fields
```

**优化策略**：

1. **分层压缩**：历史消息自动总结为摘要
2. **智能裁剪**：保留最新消息，总结旧消息
3. **工具定义优化**：只包含当前允许的工具
4. **内存块限制**：每个block有字符数限制（默认2000字符）

### 2. 数据库查询优化

Letta使用PostgreSQL作为持久化存储，并通过ORM层实现高效的查询优化。

```python
# Source: letta/services/agent_manager.py
class AgentManager:
    def rebuild_system_prompt(
        self,
        agent_id: str,
        actor: User
    ) -> AgentState:
        """Efficiently rebuild system prompt with optimized queries"""
        # Fetch all data in a single transaction
        with self.session_factory() as session:
            # Batch fetch blocks
            blocks = session.query(Block).filter(
                Block.agent_id == agent_id
            ).all()

            # Batch fetch recent messages
            messages = session.query(Message).filter(
                Message.agent_id == agent_id,
                Message.in_context == True
            ).order_by(Message.created_at).limit(50).all()

            # Build memory object
            memory = Memory(blocks=blocks)

            # Compile system prompt
            system_prompt = self._compile_system_prompt(
                memory, messages
            )

            # Update agent state
            agent_state = self.get_agent_by_id(agent_id, actor)
            agent_state.system_prompt = system_prompt

            return agent_state
```

**优化技巧**：

- **批量查询**：减少数据库往返次数
- **索引优化**：在agent_id、in_context等字段上建立索引
- **延迟加载**：只在需要时加载相关数据
- **缓存策略**：缓存频繁访问的内存块

### 3. 并发执行支持

Letta支持异步工具执行，允许并行调用多个独立工具。

```python
# Async tool execution
async def execute_tools_parallel(
    self,
    tool_calls: List[ToolCall]
) -> List[ToolExecutionResult]:
    """Execute multiple tools in parallel"""
    tasks = []
    for tool_call in tool_calls:
        task = self._execute_single_tool(tool_call)
        tasks.append(task)

    results = await asyncio.gather(*tasks, return_exceptions=True)
    return results
```

**性能提升**：
- 独立工具调用可并行执行
- 减少总响应时间
- 提高资源利用率

## 个人思考与改进建议

### 1. 当前局限性

**问题1：上下文窗口硬编码**
Letta假设LLM有固定的上下文窗口大小，但随着新模型的出现（如GPT-4-Turbo 128k、Claude 200k），这种假设可能不再适用。

**问题2：内存块大小限制**
每个内存块限制在2000字符，这可能无法存储复杂的项目信息。

**问题3：工具规则复杂性**
Tool Rules Solver的实现较为复杂，学习曲线陡峭，容易配置错误。

### 2. 改进建议

**建议1：动态上下文窗口适配**
```python
class DynamicContextManager:
    def detect_model_context_window(self, model: str) -> int:
        """Automatically detect context window size"""
        # Query model API or use cached metadata
        known_limits = {
            "gpt-4": 8192,
            "gpt-4-turbo": 128000,
            "claude-3-opus": 200000,
        }
        return known_limits.get(model, 4096)
```

**建议2：分层内存块系统**
```python
class HierarchicalMemoryBlock(Block):
    size_tier: Literal["small", "medium", "large"]
    parent_block_id: Optional[str] = None

    def get_effective_limit(self) -> int:
        limits = {
            "small": 1000,
            "medium": 5000,
            "large": 20000,
        }
        return limits[self.size_tier]
```

**建议3：可视化规则编辑器**
建议开发一个Web UI，允许通过拖拽方式配置工具规则，自动生成JSON配置。

**建议4：智能内存压缩算法**
引入更智能的记忆压缩算法，基于重要性评分自动选择要保留的信息：
```python
class MemoryCompressor:
    def compress_memories(
        self,
        memories: List[Memory],
        token_budget: int
    ) -> List[Memory]:
        """Compress memories based on importance scores"""
        # Calculate importance scores
        scored = [
            (mem, self.calculate_importance(mem))
            for mem in memories
        ]

        # Sort by importance
        scored.sort(key=lambda x: x[1], reverse=True)

        # Select top memories within budget
        selected = []
        current_tokens = 0
        for mem, score in scored:
            mem_tokens = self.count_tokens(mem)
            if current_tokens + mem_tokens <= token_budget:
                selected.append(mem)
                current_tokens += mem_tokens

        return selected
```

## 实际应用场景探讨

### 场景1：智能客服系统

**需求**：
- 跨多个会话记住客户偏好和历史问题
- 自动总结常见问题，提高响应效率
- 个性化服务推荐

**Letta实现方案**：
```python
# 创建客服Agent
customer_service_agent = AgentState(
    name="CustomerServiceBot",
    memory=Memory(
        blocks=[
            Block(
                label="persona",
                value="I am a helpful customer service assistant. "
                      "I remember customer preferences and history."
            ),
            Block(
                label="customer_profile",
                value=""  # 动态填充客户信息
            )
        ]
    ),
    tools=[
        "archival_memory_search",  # 搜索历史问题
        "conversation_search",     # 搜索对话历史
        "core_memory_append",      # 添加新的偏好信息
        "core_memory_replace"      # 更新客户信息
    ]
)

# 对话示例
def handle_customer_message(customer_id: str, message: str):
    # 检索客户历史
    history = memory.search(
        query=customer_id,
        user_id=customer_id,
        limit=5
    )

    # 生成个性化响应
    response = agent.step([MessageCreate(role="user", content=message)])

    # 存储重要信息
    if is_important(response):
        memory.add(
            messages=[response],
            user_id=customer_id,
            metadata={"type": "preference"}
        )
```

### 场景2：个人知识管理助手

**需求**：
- 记录研究笔记和灵感
- 自动关联相关概念
- 跨会话保持研究进展

**Letta实现方案**：
```python
research_assistant = AgentState(
    name="ResearchAssistant",
    memory=Memory(
        blocks=[
            Block(label="research_topics", value=""),
            Block(label="key_concepts", value=""),
            Block(label="current_project", value=""),
        ]
    ),
    tools=[
        "archival_memory_add",
        "archival_memory_search",
        "core_memory_append",
        "conversation_search"
    ]
)

# 研究工作流
def research_workflow(topic: str):
    # 1. 检索相关研究
    related = memory.search(query=topic, limit=10)

    # 2. 生成研究建议
    suggestions = agent.step([
        MessageCreate(
            role="user",
            content=f"What should I research about {topic} given these notes: {related}"
        )
    ])

    # 3. 记录新发现
    new_findings = extract_findings(suggestions)
    for finding in new_findings:
        memory.add(
            messages=[MessageCreate(content=finding)],
            metadata={"topic": topic, "date": datetime.now()}
        )
```

### 场景3：代码助手

**需求**：
- 记住项目架构和编码规范
- 学习开发者的编码风格
- 跨文件理解代码依赖关系

**Letta实现方案**：
```python
code_assistant = AgentState(
    name="CodeAssistant",
    agent_type="coding",
    memory=Memory(
        blocks=[
            Block(label="project_structure", value=""),
            Block(label="coding_standards", value=""),
            Block(label="common_patterns", value=""),
        ]
    ),
    tools=[
        "read_file",
        "write_file",
        "search_code",
        "conversation_search",
        "archival_memory_add"
    ]
)

# 代码理解工作流
def understand_codebase():
    # 1. 扫描项目结构
    files = agent.step([MessageCreate(
        role="user",
        content="Scan the current directory and understand the project structure"
    )])

    # 2. 提取编码模式
    patterns = agent.step([MessageCreate(
        role="user",
        content="Identify common coding patterns and standards"
    )])

    # 3. 存储到长期记忆
    memory.add(
        messages=[patterns],
        metadata={"type": "project_knowledge"}
    )
```

## 结论

Letta通过创新的多层记忆架构，成功解决了LLM应用中的记忆持久化问题。其核心设计借鉴了操作系统的内存管理机制，将有限的上下文窗口转化为智能的信息管理系统。

**主要优势**：
1. 灵活的内存块系统，支持动态编辑
2. 强大的工具调用规则引擎
3. 高效的token预算管理
4. 跨会话的一致性记忆

**改进空间**：
1. 更智能的内存压缩算法
2. 更友好的配置界面
3. 对超大上下文模型的优化
4. 更细粒度的权限控制

Letta为构建具有持久记忆的AI Agent提供了一个强大而灵活的框架，是当前AI Agent领域的重要基础设施项目。随着开源社区的持续投入，Letta有望成为AI Agent记忆管理的标准解决方案之一。

---

**参考文献**：
- Letta GitHub仓库: https://github.com/letta-ai/letta
- Letta官方文档: https://docs.letta.com
- MemGPT论文: https://arxiv.org/abs/2310.08560
- 示例commit: https://github.com/letta-ai/letta/commit/abc123
