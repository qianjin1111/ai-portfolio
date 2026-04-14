import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Calendar, Clock, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { blogPosts } from '../data/posts';
import { Link } from 'react-router-dom';

const TechAnalysisPage = () => {
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

  // 只显示 Tech Analysis 分类的文章
  const techAnalysisPosts = blogPosts.filter(post => post.category === 'Tech Analysis');

  const togglePost = (postId: number) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-darker to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/blog"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>返回博客</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tech Analysis
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            GitHub 项目深度学习系列文章
          </p>
          <div className="flex items-center space-x-6 text-gray-500 text-sm">
            <span className="flex items-center space-x-2">
              <BookOpen size={16} />
              <span>{techAnalysisPosts.length} 篇文章</span>
            </span>
            <span className="flex items-center space-x-2">
              <Clock size={16} />
              <span>总计约 {techAnalysisPosts.reduce((sum, post) => sum + parseInt(post.readTime), 0)} 分钟阅读时间</span>
            </span>
          </div>
        </div>

        {/* Articles */}
        <div className="space-y-8">
          {techAnalysisPosts.map((post) => (
            <article
              key={post.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              {/* Article Header */}
              <div
                className="p-6 cursor-pointer hover:bg-primary/5 transition-colors"
                onClick={() => togglePost(post.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                        {post.category}
                      </span>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-secondary/30 text-gray-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{post.title}</h2>
                    <p className="text-gray-400 mb-4">{post.excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>{post.date}</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary ml-4">
                    {expandedPostId === post.id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>
              </div>

              {/* Article Content */}
              {expandedPostId === post.id && (
                <div className="border-t border-border">
                  <div className="p-6 prose prose-invert prose-lg max-w-none">
                    <div
                      dangerouslySetInnerHTML={{ __html: post.content }}
                      className="markdown-content"
                    />
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-secondary/10 border border-border rounded-xl">
          <p className="text-gray-400 text-sm text-center">
            💡 <strong>提示：</strong> 点击文章标题可以展开或收起完整内容。所有文章均包含完整的架构图、代码片段和技术分析。
          </p>
        </div>
      </div>

      <style>{`
        .markdown-content {
          line-height: 1.8;
          color: #e5e7eb;
        }

        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
          color: #ffffff;
          font-weight: 700;
          margin-top: 2em;
          margin-bottom: 1em;
        }

        .markdown-content h1 { font-size: 2em; border-bottom: 1px solid #333; padding-bottom: 0.3em; }
        .markdown-content h2 { font-size: 1.5em; border-bottom: 1px solid #333; padding-bottom: 0.3em; }
        .markdown-content h3 { font-size: 1.25em; }

        .markdown-content p {
          margin-bottom: 1em;
        }

        .markdown-content pre {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1.5em 0;
        }

        .markdown-content code {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 0.25rem;
          padding: 0.2em 0.4em;
          font-size: 0.9em;
          color: #e5e7eb;
        }

        .markdown-content pre code {
          background: none;
          border: none;
          padding: 0;
          color: #e5e7eb;
        }

        .markdown-content ul,
        .markdown-content ol {
          margin: 1.5em 0;
          padding-left: 2em;
        }

        .markdown-content li {
          margin-bottom: 0.5em;
        }

        .markdown-content blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1.5em;
          margin: 1.5em 0;
          color: #9ca3af;
          font-style: italic;
        }

        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
        }

        .markdown-content th,
        .markdown-content td {
          border: 1px solid #333;
          padding: 0.75rem;
          text-align: left;
        }

        .markdown-content th {
          background: #1a1a1a;
          font-weight: 700;
        }

        .markdown-content a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .markdown-content a:hover {
          color: #60a5fa;
        }
      `}</style>
    </div>
  );
};

export default TechAnalysisPage;
