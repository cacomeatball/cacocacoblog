import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectUser } from '../../auth/authSlice';
import { supabase } from '../../../lib/supabaseClient';
import type { BlogPost } from '../blogSlice';
import { setEditingPost } from '../blogSlice';
import './singlePost.css';

export function SinglePostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Post not found');

      setPost(data);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Error fetching post');
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setError('Post ID not found');
      setLoading(false);
      return;
    }

    fetchPost();
  }, [id, fetchPost]);

  const isAuthor = user?.id === post?.user_id;

  const handleEdit = () => {
    if (post) {
      dispatch(setEditingPost(post));
      navigate('/write');
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      // Navigate back to home after successful deletion
      navigate('/');
    } catch (error: any) {
      alert(`Error deleting post: ${error.message}`);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading post...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>Error: {error}</p>
        <button onClick={handleGoBack} className="btn-primary">
          Back to Posts
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>Post not found</p>
        <button onClick={handleGoBack} className="btn-primary">
          Back to Posts
        </button>
      </div>
    );
  }

  const createdAt = new Date(post.created_at).toLocaleDateString();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <button onClick={handleGoBack} className="btn-secondary" style={{ marginBottom: '2rem' }}>
        ← Back to Posts
      </button>

      <article className="blog-post">
        <header>
          <h1 className="postTitle">{post.title}</h1>
          <div className="blog-post-meta">Published on {createdAt}, by {post.username}</div>
        </header>

        {post.image_url && (
        <img 
          src={post.image_url} 
          alt={post.title}
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', marginBottom: '1rem' }}
        />
        )}

        <div className="blog-post-content">
          {post.content}
        </div>

        {isAuthor && (
          <footer className="postFooter">
            <button onClick={handleEdit} className="btn-success">
              <i className="singlePostIcon fa-regular fa-pen-to-square"></i> Edit
            </button>
            <button onClick={handleDelete} className="btn-danger">
              <i className="singlePostIcon fa-regular fa-trash-can"></i> Delete
            </button>
          </footer>
        )}
      </article>
    </div>
  );
}
