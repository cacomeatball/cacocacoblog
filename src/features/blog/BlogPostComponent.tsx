import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { BlogPost } from './blogSlice';
import './bloglist.css';

interface BlogPostComponentProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}

export function BlogPostComponent({ post, onEdit, onDelete }: BlogPostComponentProps) {
  const createdAt = new Date(post.created_at).toLocaleDateString();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get('page');

  const handleTitleClick = () => {
    const suffix = currentPage ? `?page=${currentPage}` : '';
    navigate(`/post/${post.id}${suffix}`);
  };

  return (
    <article className="blog-post" onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
      <header>
        <h2 className='postTitle'>{post.title}</h2>
        <div className="blog-post-meta">Published on {createdAt}, by {post.username}</div>
      </header>
      
      {post.image_url && (
        <img 
          className='postImg'
          src={post.image_url} 
          alt={post.title}
          style={{}}
        />
      )}
      
      <div className="blog-post-content">
        {post.content}
      </div>
    </article>
  );
}