import React from 'react';
import { useAppSelector } from '../../../../app/hooks';
import { selectUser } from '../../../auth/authSlice';
import type { CommentPost } from './commentSlice';
import './comment.css';

interface CommentComponentProps {
  post: CommentPost;
  onEdit: (post: CommentPost) => void;
  onDelete: (id: string) => void;
}

  export function CommentComponent({ post, onEdit, onDelete }: CommentComponentProps) {
  const user = useAppSelector(selectUser);
  const isAuthor = user?.id === post.user_id;
  const createdAt = new Date(post.created_at).toLocaleDateString();

  return (
    <article className="blog-post">
      <header>
        <div className="blog-post-meta">Published on {createdAt}, by {post.username}</div>
      </header>
      
      <div className="blog-post-content">
        {post.content}
      </div>

      {post.image_url && (
        <img 
          className='commentImg'
          src={post.image_url} 
          alt=''
          style={{}}
        />
      )}

      {isAuthor && (
        <footer className="commentFooter">
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