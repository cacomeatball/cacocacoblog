import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../auth/authSlice';
import type { BlogPost } from './blogSlice';

interface BlogPostComponentProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}

export function BlogPostComponent({ post, onEdit, onDelete }: BlogPostComponentProps) {
  const user = useAppSelector(selectUser);
  const isAuthor = user?.id === post.user_id;
  const createdAt = new Date(post.created_at).toLocaleDateString();

  return (
    <article className="blog-post">
      <header>
        <h2>{post.title}</h2>
        <div className="blog-post-meta">Published on {createdAt}</div>
      </header>
      
      <div className="blog-post-content">
        {post.content}
      </div>
      
      {isAuthor && (
        <footer style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button onClick={() => onEdit(post)} className="btn-success">
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this post?')) {
                onDelete(post.id);
              }
            }}
            className="btn-danger"
          >
            Delete
          </button>
        </footer>
      )}
    </article>
  );
}