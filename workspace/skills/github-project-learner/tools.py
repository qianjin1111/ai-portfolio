"""
GitHub Project Learner - Core Tools
系统性分析GitHub开源项目的工具集
"""

import os
import subprocess
import json
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from enum import Enum


class FilePriority(Enum):
    """文件优先级"""
    P0 = "必读"
    P1 = "重要"
    P2 = "辅助"


@dataclass
class ProjectMetadata:
    """项目元数据"""
    name: str
    description: str
    stars: int
    forks: int
    contributors: int
    language: str
    license: Optional[str]
    url: str


@dataclass
class CoreFiles:
    """核心文件列表"""
    p0: List[str]  # 必读文件
    p1: List[str]  # 重要文件
    p2: List[str]  # 辅助文件


@dataclass
class CodeStructure:
    """代码结构"""
    modules: List[str]
    classes: List[str]
    functions: List[str]
    dependencies: Dict[str, List[str]]
    call_graph: Dict[str, List[str]]


def clone_and_analyze(repo_url: str, depth: int = 1) -> tuple:
    """
    克隆GitHub项目并执行初步分析

    Args:
        repo_url: GitHub仓库URL
        depth: 克隆深度，1表示浅克隆

    Returns:
        (metadata, structure, dependencies)
    """
    # 提取项目名称
    project_name = repo_url.rstrip('/').split('/')[-1]
    local_path = f"/tmp/{project_name}"

    # 克隆项目
    print(f"📥 Cloning {repo_url}...")
    result = subprocess.run(
        f"git clone --depth {depth} {repo_url} {local_path}",
        shell=True,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        raise Exception(f"Failed to clone repo: {result.stderr}")

    # 分析元数据
    metadata = extract_metadata(repo_url, local_path)

    # 分析结构
    structure = analyze_structure(local_path)

    # 分析依赖
    dependencies = extract_dependencies(local_path)

    return metadata, structure, dependencies, local_path


def extract_metadata(repo_url: str, local_path: str) -> ProjectMetadata:
    """提取项目元数据"""
    # 读取README获取描述
    description = ""
    readme_files = ["README.md", "README.rst", "README.txt"]
    for readme in readme_files:
        readme_path = os.path.join(local_path, readme)
        if os.path.exists(readme_path):
            with open(readme_path, 'r', encoding='utf-8') as f:
                content = f.read()
                # 提取第一段作为描述
                lines = content.split('\n\n')
                if lines:
                    description = lines[0][:200]  # 限制长度
            break

    # 提取语言（简化版，实际应该使用GitHub API）
    language = "Unknown"

    # 提取license
    license_file = os.path.join(local_path, "LICENSE")
    license_text = None
    if os.path.exists(license_file):
        with open(license_file, 'r', encoding='utf-8') as f:
            license_text = f.read()[:50]  # 读取前50个字符

    return ProjectMetadata(
        name=repo_url.rstrip('/').split('/')[-1],
        description=description,
        stars=0,  # 需要GitHub API
        forks=0,  # 需要GitHub API
        contributors=0,  # 需要GitHub API
        language=language,
        license=license_text,
        url=repo_url
    )


def analyze_structure(local_path: str) -> List[str]:
    """分析项目结构"""
    result = subprocess.run(
        f"cd {local_path} && find . -type f -name '*.py' -o -name '*.ts' -o -name '*.js' | head -50",
        shell=True,
        capture_output=True,
        text=True
    )

    files = result.stdout.strip().split('\n') if result.stdout.strip() else []
    return files


def extract_dependencies(local_path: str) -> Dict[str, List[str]]:
    """提取依赖"""
    dependencies = {}

    # Python dependencies
    if os.path.exists(os.path.join(local_path, "requirements.txt")):
        with open(os.path.join(local_path, "requirements.txt"), 'r') as f:
            dependencies['pip'] = [line.strip() for line in f if line.strip()]

    # Node.js dependencies
    if os.path.exists(os.path.join(local_path, "package.json")):
        with open(os.path.join(local_path, "package.json"), 'r') as f:
            package = json.load(f)
            dependencies['npm'] = list(package.get('dependencies', {}).keys())

    return dependencies


def extract_core_files(project_dir: str) -> CoreFiles:
    """
    识别核心文件并按优先级排序

    Args:
        project_dir: 项目目录

    Returns:
        CoreFiles 对象
    """
    p0_files = []
    p1_files = []
    p2_files = []

    # P0 文件（必读）
    p0_patterns = [
        "README.md", "README.rst", "README.txt",
        "package.json", "setup.py", "pyproject.toml", "Cargo.toml",
        "main.py", "index.ts", "index.js", "__init__.py"
    ]

    # P1 文件（重要）
    p1_patterns = [
        "src/core/*", "src/services/*", "src/agent*", "src/memory*",
        "lib/*", "core/*",
        "tests/*", "test/*"
    ]

    # P2 文件（辅助）
    p2_patterns = [
        "examples/*", "example/*", "docs/*", "config/*", ".github/*"
    ]

    # 扫描文件
    for root, dirs, files in os.walk(project_dir):
        for file in files:
            relative_path = os.path.relpath(os.path.join(root, file), project_dir)

            # 检查 P0
            if file in p0_patterns or file == "index.ts" or file == "main.py":
                p0_files.append(relative_path)

            # 检查 P1
            elif any(pattern in relative_path for pattern in p1_patterns):
                p1_files.append(relative_path)

            # 检查 P2
            elif any(pattern in relative_path for pattern in p2_patterns):
                p2_files.append(relative_path)

    return CoreFiles(p0=p0_files, p1=p1_files, p2=p2_files)


def analyze_code_structure(project_dir: str) -> CodeStructure:
    """
    分析代码结构和模块关系

    Args:
        project_dir: 项目目录

    Returns:
        CodeStructure 对象
    """
    modules = []
    classes = []
    functions = []
    dependencies = {}
    call_graph = {}

    # 扫描Python/TypeScript文件
    for root, dirs, files in os.walk(project_dir):
        # 跳过隐藏目录和构建目录
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ['node_modules', 'build', 'dist', '__pycache__']]

        for file in files:
            if file.endswith(('.py', '.ts', '.js')):
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, project_dir)

                # 添加到模块列表
                if not file.endswith('.js') or file in p0_files:
                    modules.append(relative_path)

                # 简化的代码分析（实际应该使用AST解析）
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()

                        # 提取类定义
                        if 'class ' in content:
                            import re
                            class_matches = re.findall(r'class\s+(\w+)', content)
                            classes.extend([f"{relative_path}:{cls}" for cls in class_matches])

                        # 提取函数定义
                        if 'def ' in content or 'function ' in content:
                            func_matches = re.findall(r'(?:def|function)\s+(\w+)', content)
                            functions.extend([f"{relative_path}:{func}" for func in func_matches])

                except Exception as e:
                    print(f"Error reading {file_path}: {e}")

    return CodeStructure(
        modules=modules,
        classes=classes,
        functions=functions,
        dependencies=dependencies,
        call_graph=call_graph
    )


def generate_architecture_diagram(structure: CodeStructure, metadata: ProjectMetadata) -> str:
    """
    生成ASCII格式的架构图

    Args:
        structure: 代码结构对象
        metadata: 项目元数据

    Returns:
        ASCII架构图字符串
    """
    diagram = f"""
┌─────────────────────────────────────────────────────────────┐
│         {metadata.name} Architecture                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Modules ({len(structure.modules)})                         │
│  {chr(10).join(['  ├─ ' + m for m in structure.modules[:5]])}"""

    if len(structure.modules) > 5:
        diagram += f"\n  ├─ ... ({len(structure.modules) - 5} more)"

    diagram += f"""
│                                                              │
│  Key Classes ({len(structure.classes)})                     │
│  {chr(10).join(['  ├─ ' + c.split(':')[-1] for c in structure.classes[:5]])}"""

    if len(structure.classes) > 5:
        diagram += f"\n  ├─ ... ({len(structure.classes) - 5} more)"

    diagram += f"""
│                                                              │
│  Key Functions ({len(structure.functions)})                 │
│  {chr(10).join(['  ├─ ' + f.split(':')[-1] for f in structure.functions[:5]])}"""

    if len(structure.functions) > 5:
        diagram += f"\n  ├─ ... ({len(structure.functions) - 5} more)"

    diagram += """
│                                                              │
└─────────────────────────────────────────────────────────────┘
"""

    return diagram


def extract_key_implementation(project_dir: str, file_path: str, focus_areas: List[str] = None) -> Dict[str, Any]:
    """
    提取关键实现代码

    Args:
        project_dir: 项目目录
        file_path: 文件路径（相对于项目根目录）
        focus_areas: 关注的领域列表

    Returns:
        包含关键实现的字典
    """
    full_path = os.path.join(project_dir, file_path)

    if not os.path.exists(full_path):
        return {"error": "File not found"}

    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 提取类定义
    import re
    classes = re.findall(r'class\s+(\w+)[^:]*:(.*?)(?=\nclass|\Z)', content, re.DOTALL)

    # 提取函数定义
    functions = re.findall(r'(?:def|async def|function)\s+(\w+)\([^)]*\)[^:]*:(.*?)(?=\n(?:def|async def|function|class)|\Z)', content, re.DOTALL)

    # 过滤关注的领域
    if focus_areas:
        classes = [(name, body) for name, body in classes if any(area in name.lower() or area in body.lower() for area in focus_areas)]
        functions = [(name, body) for name, body in functions if any(area in name.lower() or area in body.lower() for area in focus_areas)]

    return {
        "file": file_path,
        "classes": [{"name": name, "body": body[:500]} for name, body in classes[:3]],
        "functions": [{"name": name, "body": body[:500]} for name, body in functions[:3]],
        "line_count": len(content.split('\n'))
    }


def generate_learning_checklist(project_dir: str) -> List[str]:
    """
    生成学习检查清单

    Args:
        project_dir: 项目目录

    Returns:
        检查清单列表
    """
    checklist = [
        "克隆项目并查看 README",
        "理解项目定位和价值主张",
        "分析项目目录结构",
        "识别入口文件",
        "读取配置文件（package.json, setup.py 等）",
        "识别核心模块和文件",
        "分析核心类/函数",
        "绘制架构图",
        "提取关键算法/设计模式",
        "分析性能优化策略",
        "查看测试用例",
        "查看 Issue 和 PR 讨论",
        "分析 Commit 历史",
        "对比同类项目",
        "识别局限性",
        "思考改进方案"
    ]

    return checklist


def print_summary(metadata: ProjectMetadata, core_files: CoreFiles, structure: CodeStructure):
    """打印分析摘要"""
    print("\n" + "="*60)
    print("📊 GitHub Project Analysis Summary")
    print("="*60)
    print(f"\n📁 Project: {metadata.name}")
    print(f"📝 Description: {metadata.description[:100]}...")
    print(f"🌐 URL: {metadata.url}")

    print("\n📄 Core Files:")
    print(f"  P0 (Must Read): {len(core_files.p0)} files")
    for f in core_files.p0[:5]:
        print(f"    ├─ {f}")

    print(f"\n  P1 (Important): {len(core_files.p1)} files")
    for f in core_files.p1[:5]:
        print(f"    ├─ {f}")

    print(f"\n  P2 (Auxiliary): {len(core_files.p2)} files")

    print("\n🏗️  Code Structure:")
    print(f"  Modules: {len(structure.modules)}")
    print(f"  Classes: {len(structure.classes)}")
    print(f"  Functions: {len(structure.functions)}")

    print("\n✅ Next Steps:")
    print("  1. Review P0 files (README, package.json, entry point)")
    print("  2. Analyze core modules")
    print("  3. Extract key implementations")
    print("  4. Generate architecture diagram")
    print("  5. Write technical blog article")

    print("\n" + "="*60 + "\n")


if __name__ == "__main__":
    # 示例用法
    import sys

    if len(sys.argv) < 2:
        print("Usage: python tools.py <github-repo-url>")
        sys.exit(1)

    repo_url = sys.argv[1]

    try:
        # 克隆并分析
        metadata, structure, dependencies, local_path = clone_and_analyze(repo_url)

        # 提取核心文件
        core_files = extract_core_files(local_path)

        # 分析代码结构
        code_structure = analyze_code_structure(local_path)

        # 生成架构图
        diagram = generate_architecture_diagram(code_structure, metadata)

        # 打印摘要
        print_summary(metadata, core_files, code_structure)

        # 生成学习检查清单
        checklist = generate_learning_checklist(local_path)
        print("\n📋 Learning Checklist:")
        for i, item in enumerate(checklist, 1):
            print(f"  [{'x' if i <= 3 else ' '}] {item}")

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
