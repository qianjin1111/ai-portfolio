# GitHub Project Learner Skill

## 快速开始

### 安装

```bash
# 1. 将skill复制到OpenClaw workspace
cp -r github-project-learner /workspace/projects/workspace/skills/

# 2. 配置skill
# 在openclaw.json中添加skill配置
```

### 基本用法

```python
# 在OpenClaw中使用这个skill
from workspace.skills.github_project_learner.tools import (
    clone_and_analyze,
    extract_core_files,
    analyze_code_structure,
    generate_architecture_diagram
)

# 1. 克隆并分析GitHub项目
metadata, structure, dependencies, local_path = clone_and_analyze(
    "https://github.com/letta-ai/letta"
)

# 2. 提取核心文件
core_files = extract_core_files(local_path)

# 3. 分析代码结构
code_structure = analyze_code_structure(local_path)

# 4. 生成架构图
diagram = generate_architecture_diagram(code_structure, metadata)
print(diagram)
```

## 使用示例

### 示例1：快速分析一个项目

```python
from workspace.skills.github_project_learner.tools import clone_and_analyze, print_summary

# 分析项目
metadata, structure, dependencies, local_path = clone_and_analyze(
    "https://github.com/mem0ai/mem0"
)

# 打印摘要
print_summary(metadata, core_files, code_structure)
```

### 示例2：提取关键代码

```python
from workspace.skills.github_project_learner.tools import extract_key_implementation

# 提取记忆相关代码
key_code = extract_key_implementation(
    project_dir="/tmp/mem0",
    file_path="mem0/memory/main.py",
    focus_areas=["memory", "search", "extract"]
)

print(key_code["classes"])
print(key_code["functions"])
```

### 示例3：生成学习检查清单

```python
from workspace.skills.github_project_learner.tools import generate_learning_checklist

# 生成检查清单
checklist = generate_learning_checklist("/tmp/mem0")

# 打印检查清单
print("📋 GitHub Project Learning Checklist:")
for i, item in enumerate(checklist, 1):
    print(f"  [{'x' if i <= 3 else ' '}] {item}")
```

## 学习流程

这个skill支持四层学习流程：

### Layer 1: 信息收集与初步了解

```python
# 1. 克隆项目
metadata, structure, dependencies, local_path = clone_and_analyze(repo_url)

# 2. 阅读README
print(metadata.description)

# 3. 查看项目结构
print(structure)

# 4. 分析依赖
print(dependencies)
```

### Layer 2: 代码结构与核心模块分析

```python
# 1. 识别核心文件
core_files = extract_core_files(local_path)

# 2. 分析代码结构
code_structure = analyze_code_structure(local_path)

# 3. 生成架构图
diagram = generate_architecture_diagram(code_structure, metadata)

# 4. 提取关键实现
key_code = extract_key_implementation(local_path, "src/agent.py")
```

### Layer 3: 深度分析与论证验证

```python
# 这个层次需要人工分析：
# - 查看Issue和PR讨论
# - 分析Commit历史
# - 对比同类项目
# - 识别局限性
```

### Layer 4: 知识沉淀与输出

```python
# 使用生成的信息撰写技术博客文章
# 参考SKILL.md中的文章模板
```

## 检查清单

### 项目分析检查清单

使用这个skill时，可以按照以下检查清单进行：

- [ ] 克隆项目并查看 README
- [ ] 理解项目定位和价值主张
- [ ] 分析项目目录结构
- [ ] 识别入口文件
- [ ] 读取配置文件
- [ ] 识别核心模块和文件
- [ ] 分析核心类/函数
- [ ] 绘制架构图
- [ ] 提取关键算法/设计模式
- [ ] 分析性能优化策略
- [ ] 查看测试用例
- [ ] 查看 Issue 和 PR 讨论
- [ ] 分析 Commit 历史
- [ ] 对比同类项目
- [ ] 识别局限性
- [ ] 思考改进方案

### 文章撰写检查清单

- [ ] 项目背景与价值分析
- [ ] 核心架构图解（≥2张）
- [ ] 关键技术实现剖析（≥3个代码片段）
- [ ] 性能优化点分析
- [ ] 个人思考与改进建议
- [ ] 实际应用场景探讨
- [ ] 字数 ≥ 2000 字
- [ ] 引用具体 commit/issue

## 工具说明

### 1. `clone_and_analyze`

克隆GitHub项目并执行初步分析。

**参数:**
- `repo_url`: GitHub仓库URL
- `depth`: 克隆深度（默认为1）

**返回:**
- `metadata`: 项目元数据
- `structure`: 文件结构列表
- `dependencies`: 依赖字典
- `local_path`: 本地路径

### 2. `extract_core_files`

识别核心文件并按优先级排序。

**参数:**
- `project_dir`: 项目目录

**返回:**
- `CoreFiles` 对象，包含 p0, p1, p2 文件列表

### 3. `analyze_code_structure`

分析代码结构和模块关系。

**参数:**
- `project_dir`: 项目目录

**返回:**
- `CodeStructure` 对象，包含模块、类、函数、依赖、调用图

### 4. `generate_architecture_diagram`

生成ASCII格式的架构图。

**参数:**
- `structure`: 代码结构对象
- `metadata`: 项目元数据

**返回:**
- ASCII架构图字符串

### 5. `extract_key_implementation`

提取关键实现代码。

**参数:**
- `project_dir`: 项目目录
- `file_path`: 文件路径（相对于项目根目录）
- `focus_areas`: 关注的领域列表（可选）

**返回:**
- 包含类和函数定义的字典

### 6. `generate_learning_checklist`

生成学习检查清单。

**参数:**
- `project_dir`: 项目目录

**返回:**
- 检查清单列表

## 输出格式

### 架构图示例

```
┌─────────────────────────────────────────────────────────────┐
│         Letta Architecture                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Modules (15)                                                │
│  ├─ letta/agent.py                                          │
│  ├─ letta/llm.py                                            │
│  ├─ letta/memory/memory.py                                  │
│  ├─ letta/schemas/memory.py                                 │
│  ├─ letta/prompts/prompt_generator.py                       │
│                                                              │
│  Key Classes (8)                                             │
│  ├─ Agent                                                   │
│  ├─ Memory                                                   │
│  ├─ Block                                                   │
│  ├─ LLMConfig                                               │
│                                                              │
│  Key Functions (25)                                          │
│  ├─ step                                                    │
│  ├─ inner_step                                              │
│  ├─ rebuild_system_prompt                                   │
│  ├─ compile                                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 最佳实践

1. **从整体到局部**
   - 先使用 `clone_and_analyze` 了解项目概况
   - 再使用 `extract_core_files` 定位核心文件
   - 最后使用 `analyze_code_structure` 深入分析

2. **聚焦关键模块**
   - 使用 `focus_areas` 参数过滤关注的代码
   - 优先分析核心算法和数据结构
   - 理解设计模式和技术选型

3. **持续迭代**
   - 多次运行分析工具，逐步深入
   - 结合Issue和PR讨论理解设计决策
   - 对比不同版本了解架构演进

4. **输出知识**
   - 使用生成的架构图撰写技术文章
   - 提取可复用的模式和实践
   - 创建新的工具或skill

## 限制和注意事项

1. **GitHub API限制**
   - 当前版本不使用GitHub API，无法获取stars、forks等数据
   - 可以通过配置GitHub API token来启用

2. **代码分析深度**
   - 当前版本使用简单的正则表达式提取
   - 对于复杂的代码结构，建议使用AST解析

3. **语言支持**
   - 当前版本主要支持Python和TypeScript/JavaScript
   - 其他语言的支持可以扩展

4. **大项目支持**
   - 对于超大型项目，建议使用浅克隆（depth=1）
   - 可以指定特定的目录进行分析

## 扩展开发

### 添加新的分析工具

```python
def custom_analyzer(project_dir: str) -> Dict[str, Any]:
    """自定义分析器"""
    # 实现你的分析逻辑
    return result
```

### 集成到OpenClaw

在 `openclaw.json` 中配置：

```json
{
  "skills": {
    "github-project-learner": {
      "enabled": true,
      "config": {
        "default_depth": 1,
        "include_dependencies": true,
        "generate_diagrams": true
      }
    }
  }
}
```

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！
