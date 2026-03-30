import React, { useState } from 'react';
import { Calendar, Clock, Tag, ChevronRight, Search } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '构建多Agent协作系统：从理论到实践',
    excerpt: '深入探讨如何使用LangGraph构建复杂的多Agent系统，实现任务分解、协作执行和结果汇总。',
    content: '',
    date: '2025-03-28',
    readTime: '15 min',
    category: 'AI Agent',
    tags: ['LangGraph', 'Multi-Agent', 'Python'],
  },
  {
    id: 2,
    title: 'RAG系统优化指南：提升检索质量的10个技巧',
    excerpt: '分享在实际项目中总结的RAG系统优化经验，包括文档切分、嵌入模型选择、重排序策略等。',
    content: '',
    date: '2025-03-20',
    readTime: '12 min',
    category: 'RAG',
    tags: ['RAG', 'Vector DB', 'Optimization'],
  },
  {
    id: 3,
    title: 'Prompt Engineering进阶：让LLM更听话',
    excerpt: '从基础到高级的Prompt技巧，包括Few-shot、CoT、ReAct等模式的应用实例。',
    content: '',
    date: '2025-03-15',
    readTime: '10 min',
    category: 'Prompt',
    tags: ['Prompt', 'LLM', 'Best Practices'],
  },
  {
    id: 4,
    title: 'AI应用性能监控：从日志到可观测性',
    excerpt: '如何构建完整的AI应用监控体系，追踪Token消耗、响应延迟、错误率等关键指标。',
    content: '',
    date: '2025-03-10',
    readTime: '8 min',
    category: '工程实践',
    tags: ['Monitoring', 'Observability', 'DevOps'],
  },
  {
    id: 5,
    title: 'CrewAI实战：自动化内容生产工作流',
    excerpt: '使用CrewAI构建一个完整的内容生产团队，包括研究员、写手、编辑等角色。',
    content: '',
    date: '2025-03-05',
    readTime: '18 min',
    category: 'AI Agent',
    tags: ['CrewAI', 'Automation', 'Content'],
  },
  {
    id: 6,
    title: '向量数据库选型：ChromaDB vs Pinecone vs Weaviate',
    excerpt: '对比主流向量数据库的优缺点，帮助你选择适合自己项目的向量存储方案。',
    content: '',
    date: '2025-02-28',
    readTime: '14 min',
    category: '技术对比',
    tags: ['Vector DB', 'ChromaDB', 'Pinecone'],
  },
];

const categories = ['全部', 'AI Agent', 'RAG', 'Prompt', '工程实践', '技术对比'];

const BlogCard = ({ post }: { post: BlogPost }) => (
  <article className="card-hover bg-card border border-border rounded-xl overflow-hidden cursor-pointer">
    <div className="p-6">
      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
        <span className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary">
          {post.category}
        </span>
        <span className="flex items-center space-x-1">
          <Calendar size={14} />
          <span>{post.date}</span>
        </span>
        <span className="flex items-center space-x-1">
          <Clock size={14} />
          <span>{post.readTime}</span>
        </span>
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 hover:text-primary transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-gray-500 flex items-center space-x-1">
              <Tag size={12} />
              <span>{tag}</span>
            </span>
          ))}
        </div>
        <span className="text-primary text-sm flex items-center space-x-1">
          <span>阅读更多</span>
          <ChevronRight size={16} />
        </span>
      </div>
    </div>
  </article>
);

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === '全部' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">技术博客</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            分享AI应用开发经验、技术实践和学习心得。从理论到实战，记录我的AI技术成长之路。
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="搜索文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-dark'
                    : 'bg-card border border-border text-gray-400 hover:border-primary hover:text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400">没有找到相关文章</p>
          </div>
        )}

        {/* Subscribe CTA */}
        <div className="mt-16 bg-card border border-border rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">订阅更新</h3>
          <p className="text-gray-400 mb-6">获取最新的AI技术文章和项目动态</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="输入你的邮箱"
              className="w-full px-4 py-3 bg-dark border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
            <button className="w-full sm:w-auto px-6 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-colors">
              订阅
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
