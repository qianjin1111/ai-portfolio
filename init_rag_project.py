#!/usr/bin/env python3
"""
智能 RAG 知识库问答系统 - 项目初始化脚本

使用方法：
python init_project.py

这个脚本会创建项目的基本目录结构和配置文件。
"""

import os
import shutil
from pathlib import Path

def create_project_structure():
    """创建项目目录结构"""
    base_dir = Path(__file__).parent

    # 定义目录结构
    directories = [
        "app/api",
        "app/core",
        "app/models",
        "app/services",
        "app/utils",
        "frontend/src/components",
        "frontend/src/pages",
        "frontend/src/services",
        "tests/unit",
        "tests/integration",
        "tests/e2e",
        "docs",
        "scripts",
        "docker",
        "data/uploads",
        "data/chroma",
        "logs",
    ]

    # 创建目录
    print("📁 创建项目目录结构...")
    for directory in directories:
        dir_path = base_dir / directory
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"  ✓ {directory}")

    # 创建 __init__.py 文件
    print("\n📄 创建 Python 包文件...")
    for directory in directories:
        if directory.startswith("app"):
            init_file = base_dir / directory / "__init__.py"
            if not init_file.exists():
                init_file.write_text("")
                print(f"  ✓ {directory}/__init__.py")

def create_config_files():
    """创建配置文件"""
    base_dir = Path(__file__).parent

    print("\n⚙️  创建配置文件...")

    # .env.example
    env_example = """# OpenAI 配置
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
OPENAI_EMBEDDING_MODEL=text-embedding-ada-002

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/smart_rag
REDIS_URL=redis://localhost:6379/0

# ChromaDB 配置
CHROMA_PERSIST_DIR=./data/chroma
CHROMA_COLLECTION_NAME=documents

# FastAPI 配置
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# 日志配置
LOG_LEVEL=INFO
LOG_FILE=./logs/app.log

# 文档上传配置
UPLOAD_DIR=./data/uploads
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_EXTENSIONS=pdf,docx,md,txt

# 检索配置
TOP_K=5
SIMILARITY_THRESHOLD=0.7
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
"""
    env_file = base_dir / ".env.example"
    env_file.write_text(env_example)
    print("  ✓ .env.example")

    # requirements.txt
    requirements = """# FastAPI 和 ASGI 服务器
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0

# LangChain
langchain==0.1.0
langchain-openai==0.0.2
langchain-community==0.0.10

# 向量数据库
chromadb==0.4.18

# 数据库
sqlalchemy==2.0.23
alembic==1.13.0
psycopg2-binary==2.9.9
redis==5.0.1

# 文档解析
pypdf==3.17.4
python-docx==1.1.0
markdown==3.5.1
python-multipart==0.0.6

# 工具库
python-dotenv==1.0.0
aiofiles==23.2.1
httpx==0.25.2

# 日志和监控
loguru==0.7.2

# 测试
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
"""
    requirements_file = base_dir / "requirements.txt"
    requirements_file.write_text(requirements)
    print("  ✓ requirements.txt")

    # pyproject.toml
    pyproject = """[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "smart-rag-qa-system"
version = "0.1.0"
description = "智能 RAG 知识库问答系统"
readme = "README.md"
requires-python = ">=3.10"
authors = [
    {name = "qianjin1111"}
]
classifiers = [
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Framework :: FastAPI",
    "Intended Audience :: Developers",
]

[tool.setuptools.packages.find]
where = ["app"]

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
asyncio_mode = "auto"

[tool.black]
line-length = 100
target-version = ['py310']

[tool.isort]
profile = "black"
line_length = 100
"""
    pyproject_file = base_dir / "pyproject.toml"
    pyproject_file.write_text(pyproject)
    print("  ✓ pyproject.toml")

    # .gitignore
    gitignore = """# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
build/
dist/
*.egg-info/

# 环境变量
.env

# IDE
.vscode/
.idea/
*.swp
*.swo

# 数据和日志
data/uploads/*
!data/uploads/.gitkeep
data/chroma/*
!data/chroma/.gitkeep
logs/*
!logs/.gitkeep

# 测试
.pytest_cache/
.coverage
htmlcov/

# 前端
frontend/node_modules/
frontend/dist/
frontend/.env

# Docker
.dockerignore
"""
    gitignore_file = base_dir / ".gitignore"
    gitignore_file.write_text(gitignore)
    print("  ✓ .gitignore")

def create_core_files():
    """创建核心文件"""
    base_dir = Path(__file__).parent

    print("\n💻 创建核心文件...")

    # app/main.py
    main_py = '''"""
FastAPI 应用主入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import documents, qa, knowledge_base

# 创建 FastAPI 应用
app = FastAPI(
    title="智能 RAG 知识库问答系统",
    description="企业级检索增强生成系统",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境需要配置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(documents.router, prefix="/api/v1/documents", tags=["documents"])
app.include_router(qa.router, prefix="/api/v1/qa", tags=["qa"])
app.include_router(knowledge_base.router, prefix="/api/v1/knowledge-base", tags=["knowledge-base"])

@app.get("/")
async def root():
    """根路径"""
    return {
        "message": "智能 RAG 知识库问答系统 API",
        "version": "0.1.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )
'''
    main_file = base_dir / "app" / "main.py"
    main_file.write_text(main_py)
    print("  ✓ app/main.py")

    # app/core/config.py
    config_py = '''"""
配置管理
"""
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    """应用配置"""

    # OpenAI
    OPENAI_API_KEY: str
    OPENAI_API_BASE: str = "https://api.openai.com/v1"
    OPENAI_MODEL: str = "gpt-4"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-ada-002"

    # 数据库
    DATABASE_URL: str
    REDIS_URL: str = "redis://localhost:6379/0"

    # ChromaDB
    CHROMA_PERSIST_DIR: str = "./data/chroma"
    CHROMA_COLLECTION_NAME: str = "documents"

    # FastAPI
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True

    # 日志
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "./logs/app.log"

    # 文档上传
    UPLOAD_DIR: str = "./data/uploads"
    MAX_FILE_SIZE: int = 10485760  # 10MB
    ALLOWED_EXTENSIONS: list = ["pdf", "docx", "md", "txt"]

    # 检索
    TOP_K: int = 5
    SIMILARITY_THRESHOLD: float = 0.7
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    """获取配置实例（缓存）"""
    return Settings()

settings = get_settings()
'''
    config_file = base_dir / "app" / "core" / "config.py"
    config_file.write_text(config_py)
    print("  ✓ app/core/config.py")

    # .gitkeep files
    gitkeep_dirs = [
        "data/uploads",
        "data/chroma",
        "logs"
    ]
    for directory in gitkeep_dirs:
        gitkeep_file = base_dir / directory / ".gitkeep"
        gitkeep_file.write_text("")
        print(f"  ✓ {directory}/.gitkeep")

def create_placeholder_files():
    """创建占位文件"""
    base_dir = Path(__file__).parent

    print("\n📝 创建占位文件...")

    placeholders = {
        "app/api/documents.py": "# 文档管理 API 路由\n# TODO: 实现文档上传、列表、删除等功能\nfrom fastapi import APIRouter\n\nrouter = APIRouter()\n",
        "app/api/qa.py": "# 问答 API 路由\n# TODO: 实现问答接口、多轮对话等功能\nfrom fastapi import APIRouter\n\nrouter = APIRouter()\n",
        "app/api/knowledge_base.py": "# 知识库管理 API 路由\n# TODO: 实现知识库 CRUD 操作\nfrom fastapi import APIRouter\n\nrouter = APIRouter()\n",
        "app/core/document_parser.py": "# 文档解析模块\n# TODO: 实现文档内容提取和解析\n",
        "app/core/chunker.py": "# 文档分块模块\n# TODO: 实现文档分块策略\n",
        "app/core/embedding.py": "# 向量化模块\n# TODO: 实现文本向量化\n",
        "app/core/retriever.py": "# 检索器模块\n# TODO: 实现相似度搜索\n",
        "app/core/reranker.py": "# 重排序模块\n# TODO: 实现结果重排序\n",
        "app/utils/vector_store.py": "# 向量数据库工具\n# TODO: 实现 ChromaDB 集成\n",
        "frontend/package.json": '''{\n  "name": "smart-rag-qa-frontend",\n  "version": "0.1.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build",\n    "preview": "vite preview"\n  },\n  "dependencies": {\n    "react": "^18.2.0",\n    "react-dom": "^18.2.0",\n    "react-router-dom": "^6.20.0",\n    "axios": "^1.6.2"\n  },\n  "devDependencies": {\n    "@vitejs/plugin-react": "^4.2.0",\n    "vite": "^5.0.5"\n  }\n}\n''',
        "docker/Dockerfile": '''FROM python:3.10-slim\n\nWORKDIR /app\n\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\nCOPY app ./app\nCOPY .env.example .env\n\nEXPOSE 8000\n\nCMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]\n''',
        "docker/docker-compose.yml": '''version: "3.8"\n\nservices:\n  api:\n    build:\n      context: ..\n      dockerfile: docker/Dockerfile\n    ports:\n      - "8000:8000"\n    environment:\n      - DATABASE_URL=postgresql://user:password@postgres:5432/smart_rag\n      - REDIS_URL=redis://redis:6379/0\n    depends_on:\n      - postgres\n      - redis\n    volumes:\n      - ../data:/app/data\n\n  postgres:\n    image: postgres:15\n    environment:\n      - POSTGRES_USER=user\n      - POSTGRES_PASSWORD=password\n      - POSTGRES_DB=smart_rag\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n\n  redis:\n    image: redis:7\n    volumes:\n      - redis_data:/data\n\nvolumes:\n  postgres_data:\n  redis_data:\n'''
    }

    for filepath, content in placeholders.items():
        file_path = base_dir / filepath
        file_path.write_text(content)
        print(f"  ✓ {filepath}")

def print_next_steps():
    """打印下一步操作"""
    print("\n" + "="*60)
    print("✅ 项目初始化完成！")
    print("="*60)
    print("\n📋 下一步操作：")
    print("\n1. 配置环境变量：")
    print("   cp .env.example .env")
    print("   编辑 .env 文件，填入你的配置")
    print("\n2. 安装 Python 依赖：")
    print("   pip install -r requirements.txt")
    print("\n3. 启动开发服务器：")
    print("   python app/main.py")
    print("\n4. 访问 API 文档：")
    print("   http://localhost:8000/docs")
    print("\n5. 查看 README.md 了解详细使用说明")
    print("\n" + "="*60)

def main():
    """主函数"""
    print("🚀 开始初始化智能 RAG 知识库问答系统项目...\n")

    create_project_structure()
    create_config_files()
    create_core_files()
    create_placeholder_files()
    print_next_steps()

if __name__ == "__main__":
    main()
