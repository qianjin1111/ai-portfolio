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
    title: '智能 RAG 知识库问答系统',
    description: '企业级检索增强生成系统，支持多模态文档解析、向量检索、重排序和智能问答。基于 LangChain + ChromaDB + OpenAI 构建，优化后检索准确率达 85%。',
    tech: ['Python', 'ChromaDB', 'OpenAI', 'Docker', 'FastAPI', 'LangChain'],
    github: 'https://github.com/qianjin1111/smart-rag-qa-system',
    stars: 256,
    forks: 48,
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
          <p className="text-gray-400 max-w-3xl mx-auto">
            智能RAG知识库问答系统 - 企业级检索增强生成方案
          </p>
        </div>

        {/* Single Project */}
        <div className="max-w-4xl mx-auto">
          <ProjectCard key={projects[0].id} project={projects[0]} />
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
