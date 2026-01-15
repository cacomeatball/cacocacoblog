import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../auth/authSlice';
import type { BlogPost } from './blogSlice';
import './bloglist.css'

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
        <h2 className='postTitle'>{post.title}</h2>
        <div className="blog-post-meta">Published on {createdAt}, by {post.username}</div>
      </header>
      
      <div className="blog-post-content">
        {post.content}
      </div>
      
      {isAuthor && (
        <footer className='postFooter'>
          <button onClick={() => onEdit(post)} className="btn-success">
            <i className="singlePostIcon fa-regular fa-pen-to-square"></i> Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this post?')) {
                onDelete(post.id);
              }
            }}
            className="btn-danger"
          >
            <i className="singlePostIcon fa-regular fa-trash-can"></i> Delete
          </button>
        </footer>
      )}
    </article>
  );
}