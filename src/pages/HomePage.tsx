import React, { useEffect, useState } from 'react';
import { ArrowRight, Code2, Brain, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TypingText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span className="typing-cursor">
      {displayText}
    </span>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="card-hover bg-card border border-border rounded-xl p-6">
    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
      <Icon className="text-primary" size={24} />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium mb-6">
              🤖 AI Agent Developer
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            构建智能
            <span className="gradient-text"> AI 系统</span>
          </h1>
          <div className="text-xl sm:text-2xl text-gray-400 mb-8 h-8">
            <TypingText text="LLM | RAG | Multi-Agent Systems" delay={500} />
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            专注于大语言模型应用开发，从概念到落地，打造能够真正理解、推理并执行复杂任务的AI应用。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/projects"
              className="group flex items-center space-x-2 px-8 py-4 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 glow"
            >
              <span>查看项目</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="flex items-center space-x-2 px-8 py-4 border border-border text-white font-semibold rounded-lg hover:border-primary hover:text-primary transition-all duration-300"
            >
              <span>了解更多</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-darker">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">核心能力</h2>
            <p className="text-gray-400">全栈AI应用开发，从底层到前端</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Brain}
              title="LLM 应用开发"
              description="深度掌握OpenAI、Anthropic、DeepSeek等主流大模型API，构建智能对话、文本生成、代码辅助等应用。"
            />
            <FeatureCard
              icon={Code2}
              title="Agent 系统设计"
              description="使用LangChain、LangGraph、CrewAI等框架，设计多Agent协作系统，实现复杂任务自主执行。"
            />
            <FeatureCard
              icon={Zap}
              title="RAG 知识库"
              description="构建企业级检索增强生成系统，支持向量数据库、文档解析、智能问答等核心功能。"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '2.8M+', label: 'Token 消耗' },
              { value: '15K+', label: 'API 调用' },
              { value: '180+', label: '编码小时' },
              { value: '10+', label: 'AI 项目' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-darker">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">准备好开始你的AI项目了吗？</h2>
          <p className="text-gray-400 mb-8">无论是AI应用开发、Agent系统设计还是技术咨询，我都可以帮助你。</p>
          <Link
            to="/about"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            <span>联系我</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
