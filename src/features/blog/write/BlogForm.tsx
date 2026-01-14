import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../auth/authSlice';
import { selectEditingPost } from '../blogSlice';
import { supabase } from '../../../lib/supabaseClient';

interface BlogFormProps {
  onPostCreated: () => void;
  onCancel: () => void;
}

export function BlogForm({ onPostCreated, onCancel }: BlogFormProps) {
  const user = useAppSelector(selectUser);
  const editingPost = useAppSelector(selectEditingPost);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingPost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update({ title, content })
          .eq('id', editingPost.id);
        
        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert([{ title, content, user_id: user.id }]);
        
        if (error) throw error;
      }
      
      onPostCreated();
      setTitle('');
      setContent('');
    } catch (error: any) {
      alert(`Error ${editingPost ? 'updating' : 'creating'} post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to create posts.</div>;
  }

  return (
    <div className="blog-form">
      <h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          className="blog-form-input"
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="blog-form-input blog-form-textarea"
          placeholder="Write your post content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}