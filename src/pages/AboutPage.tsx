import React from 'react';
import { Mail, MapPin, Calendar, Briefcase, GraduationCap, Award, Code2, Brain, Zap, User } from 'lucide-react';

const SkillBar = ({ skill, level }: { skill: string; level: number }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-2">
      <span className="text-white font-medium">{skill}</span>
      <span className="text-primary">{level}%</span>
    </div>
    <div className="w-full bg-border rounded-full h-2">
      <div
        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-1000"
        style={{ width: `${level}%` }}
      />
    </div>
  </div>
);

const TimelineItem = ({ icon: Icon, title, subtitle, date, description }: { icon: any; title: string; subtitle: string; date: string; description: string }) => (
  <div className="relative pl-8 pb-8 border-l-2 border-border last:pb-0">
    <div className="absolute -left-2.5 top-0 w-5 h-5 bg-primary rounded-full border-4 border-dark" />
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center space-x-2 text-primary mb-2">
        <Icon size={18} />
        <span className="text-sm font-medium">{date}</span>
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-gray-400 text-sm mb-2">{subtitle}</p>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  </div>
);

const AboutPage = () => {
  const skills = {
    'LLM 应用开发': 95,
    'AI Agent 设计': 90,
    'RAG 系统': 88,
    'Python': 92,
    'TypeScript/React': 85,
    'Prompt Engineering': 90,
  };

  const techStack = [
    'OpenAI', 'Anthropic', 'DeepSeek', 'LangChain', 'LangGraph',
    'CrewAI', 'AutoGen', 'ChromaDB', 'Pinecone', 'FastAPI',
    'React', 'TypeScript', 'Node.js', 'Docker', 'Git',
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-4xl font-bold text-dark">
              AI
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">AI Agent 开发工程师</h1>
              <p className="text-gray-400 mb-4">
                专注于大语言模型应用开发，从概念到落地，打造能够真正理解、推理并执行复杂任务的AI应用。
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                <span className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>中国</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Mail size={16} />
                  <span>your.email@example.com</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>5年+ 开发经验</span>
                </span>
              </div>
              <div className="flex justify-center md:justify-start space-x-4 mt-6">
                <a
                  href="https://github.com/qianjin1111"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-dark border border-border rounded-lg text-white hover:border-primary hover:text-primary transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-dark border border-border rounded-lg text-white hover:border-primary hover:text-primary transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  <span>LinkedIn</span>
                </a>
                <a
                  href="mailto:your.email@example.com"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300"
                >
                  <Mail size={18} />
                  <span>联系我</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <User size={20} className="text-primary" />
                <span>关于我</span>
              </h2>
              <div className="text-gray-400 space-y-4">
                <p>
                  我是一名热衷于AI技术的全栈开发工程师，专注于大语言模型（LLM）的应用开发和AI Agent系统设计。
                  在过去几年中，我深入研究和实践了多种AI框架和工具，包括LangChain、LangGraph、CrewAI等。
                </p>
                <p>
                  我的核心能力在于将复杂的AI技术转化为实际可用的产品解决方案。从智能客服系统到自动化工作流平台，
                  从RAG知识库到多Agent协作系统，我致力于打造能够真正提升生产力的AI应用。
                </p>
                <p>
                  除了技术能力，我也注重工程实践和系统架构设计。我相信好的AI产品不仅需要强大的模型能力，
                  还需要稳定的系统架构、优秀的用户体验和持续的性能优化。
                </p>
              </div>
            </section>

            {/* Experience */}
            <section className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Briefcase size={20} className="text-primary" />
                <span>工作经历</span>
              </h2>
              <div className="space-y-6">
                <TimelineItem
                  icon={Briefcase}
                  title="高级AI工程师"
                  subtitle="某知名科技公司"
                  date="2023 - 至今"
                  description="负责AI Agent平台架构设计和核心功能开发，带领团队完成多个企业级AI项目落地。"
                />
                <TimelineItem
                  icon={Briefcase}
                  title="全栈开发工程师"
                  subtitle="某互联网公司"
                  date="2021 - 2023"
                  description="参与公司核心产品的前后端开发，主导AI功能模块的设计和实现。"
                />
                <TimelineItem
                  icon={Briefcase}
                  title="软件开发工程师"
                  subtitle="某创业公司"
                  date="2020 - 2021"
                  description="负责产品后端开发和系统架构优化，积累了丰富的工程实践经验。"
                />
              </div>
            </section>

            {/* Education */}
            <section className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <GraduationCap size={20} className="text-primary" />
                <span>教育背景</span>
              </h2>
              <div className="space-y-6">
                <TimelineItem
                  icon={GraduationCap}
                  title="计算机科学与技术"
                  subtitle="某重点大学"
                  date="2016 - 2020"
                  description="主修计算机科学与技术专业， GPA 3.8/4.0，获得优秀毕业生称号。"
                />
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Skills */}
            <section className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Code2 size={20} className="text-primary" />
                <span>技能水平</span>
              </h2>
              {Object.entries(skills).map(([skill, level]) => (
                <SkillBar key={skill} skill={skill} level={level} />
              ))}
            </section>

            {/* Tech Stack */}
            <section className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Zap size={20} className="text-primary" />
                <span>技术栈</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* Achievements */}
            <section className="bg-card border border-border rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Award size={20} className="text-primary" />
                <span>成就</span>
              </h2>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>开源项目累计获得 1000+ Stars</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>技术博客月阅读量 10万+</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>主导完成 10+ 企业级AI项目</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>公司年度优秀员工（2023）</span>
                </li>
              </ul>
            </section>

            {/* Contact CTA */}
            <section className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-6 text-center">
              <Brain size={40} className="text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">有项目想法？</h3>
              <p className="text-gray-400 text-sm mb-4">
                无论是AI应用开发、技术咨询还是合作交流，都欢迎联系我。
              </p>
              <a
                href="mailto:your.email@example.com"
                className="inline-block w-full px-4 py-2 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                开始对话
              </a>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
