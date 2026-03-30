import React from 'react';
import { ExternalLink, Star, GitFork } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  stars?: number;
  forks?: number;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'AI Agent 框架',
    description: '多Agent协作系统，支持任务分解、自主执行和结果汇总。内置多种Agent角色，可扩展自定义Agent行为。',
    tech: ['LangGraph', 'FastAPI', 'Python', 'React'],
    github: '#',
    demo: '#',
    stars: 128,
    forks: 32,
  },
  {
    id: 2,
    title: '智能 RAG 引擎',
    description: '企业级检索增强生成系统，支持多模态文档解析、向量检索、重排序和智能问答。',
    tech: ['Python', 'ChromaDB', 'OpenAI', 'Docker'],
    github: '#',
    stars: 256,
    forks: 48,
  },
  {
    id: 3,
    title: '自动化工作流平台',
    description: 'AI驱动的业务流程自动化平台，通过自然语言描述即可创建复杂的工作流。',
    tech: ['CrewAI', 'React', 'TypeScript', 'Node.js'],
    github: '#',
    demo: '#',
    stars: 89,
    forks: 15,
  },
  {
    id: 4,
    title: '智能客服系统',
    description: '基于LLM的客户服务Agent，支持多轮对话、知识库检索、工单自动分类和情感分析。',
    tech: ['OpenAI', 'TypeScript', 'Redis', 'PostgreSQL'],
    github: '#',
    stars: 167,
    forks: 28,
  },
  {
    id: 5,
    title: 'Prompt 管理工具',
    description: 'Prompt版本管理、A/B测试、性能监控一体化平台，帮助团队优化Prompt效果。',
    tech: ['Vue.js', 'Python', 'MongoDB', 'FastAPI'],
    github: '#',
    demo: '#',
    stars: 234,
    forks: 56,
  },
  {
    id: 6,
    title: '代码审查助手',
    description: 'AI驱动的代码审查工具，自动检测代码问题、生成审查意见和优化建议。',
    tech: ['Python', 'GitHub API', 'OpenAI', 'Celery'],
    github: '#',
    stars: 312,
    forks: 67,
  },
];

const TechBadge = ({ tech }: { tech: string }) => (
  <span className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-medium">
    {tech}
  </span>
);

const ProjectCard = ({ project }: { project: Project }) => (
  <div className="card-hover bg-card border border-border rounded-xl overflow-hidden">
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        <div className="flex items-center space-x-3 text-gray-400 text-sm">
          {project.stars && (
            <span className="flex items-center space-x-1">
              <Star size={14} />
              <span>{project.stars}</span>
            </span>
          )}
          {project.forks && (
            <span className="flex items-center space-x-1">
              <GitFork size={14} />
              <span>{project.forks}</span>
            </span>
          )}
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-4 line-clamp-3">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tech.map((t) => (
          <TechBadge key={t} tech={t} />
        ))}
      </div>
      <div className="flex items-center space-x-4">
        {project.github && (
          <a
            href={project.github}
            className="flex items-center space-x-1 text-gray-400 hover:text-primary transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            <span>源码</span>
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            className="flex items-center space-x-1 text-gray-400 hover:text-primary transition-colors text-sm"
          >
            <ExternalLink size={16} />
            <span>演示</span>
          </a>
        )}
      </div>
    </div>
  </div>
);

const ProjectsPage = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">项目展示</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            探索我的AI项目作品集，涵盖Agent系统、RAG引擎、自动化工具等多个领域。
            每个项目都是我对AI技术应用的一次实践。
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">查看更多项目</p>
          <a
            href="https://github.com/qianjin1111"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-card border border-border rounded-lg text-white hover:border-primary hover:text-primary transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            <span>访问 GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
