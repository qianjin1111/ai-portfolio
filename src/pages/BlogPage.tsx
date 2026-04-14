import React, { useState } from 'react';
import { Calendar, Clock, Tag, ChevronRight, Search, BookOpen } from 'lucide-react';
import { blogPosts, BlogPost } from '../data/posts';
import { Link } from 'react-router-dom';

const categories = ['全部', 'AI Agent', 'RAG', 'Prompt', '工程实践', 'Tech Analysis', '技术对比'];
console.log('BlogPage categories:', categories);

const BlogCard = ({ post, onClick }: { post: BlogPost; onClick: (post: BlogPost) => void }) => (
  <article className="card-hover bg-card border border-border rounded-xl overflow-hidden cursor-pointer" onClick={() => onClick(post)}>
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
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

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

        {/* Tech Analysis CTA */}
        {selectedCategory === 'Tech Analysis' && (
          <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg">
                  <BookOpen className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">GitHub 项目深度学习系列</h3>
                  <p className="text-gray-400 text-sm">
                    包含完整的架构图、代码片段、性能分析和改进建议
                  </p>
                </div>
              </div>
              <Link
                to="/tech-analysis"
                className="px-6 py-3 bg-primary text-dark font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                查看完整文章
              </Link>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} onClick={setSelectedPost} />
          ))}
        </div>

        {/* Article Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto" onClick={() => setSelectedPost(null)}>
            <div className="min-h-screen py-8 px-4 flex items-start justify-center">
              <article className="bg-card border border-border rounded-xl max-w-4xl w-full my-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-8">
                  {/* Header */}
                  <div className="mb-8">
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="text-gray-400 hover:text-white mb-6 flex items-center gap-2"
                    >
                      ← 返回列表
                    </button>
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                      <span className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary">
                        {selectedPost.category}
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{selectedPost.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{selectedPost.readTime}</span>
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">{selectedPost.title}</h1>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-500 flex items-center space-x-1 px-2 py-1 bg-dark rounded">
                          <Tag size={12} />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose prose-invert prose-lg max-w-none">
                    <div
                      className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: selectedPost.content.replace(/\n/g, '<br/>').replace(/```/g, '') }}
                    />
                  </div>
                </div>
              </article>
            </div>
          </div>
        )}

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
