import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectUser } from '../../auth/authSlice';
import { supabase } from '../../../lib/supabaseClient';
import type { BlogPost } from '../blogSlice';
import { setEditingPost } from '../blogSlice';
import './singlePost.css';

export function SinglePostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
      if (!data) throw new Error('Post not found!');

      setPost(data);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Error fetching post!');
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setError('Post ID not found!');
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

      // Navigate back to home after successful deletion (preserve page if present)
      const page = searchParams.get('page');
      if (page) navigate(`/?page=${page}`);
      else navigate('/');
    } catch (error: any) {
      alert(`Error deleting post: ${error.message}`);
    }
  };

  const handleGoBack = () => {
    const page = searchParams.get('page');
    if (page) navigate(`/?page=${page}`);
    else navigate('/');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading post...</div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>Error: {error}</p>
        <button onClick={handleGoBack} className="btn-goback">
          Back to Posts
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#64748b', marginBottom: '1rem' }}>Post not found</p>
        <button onClick={handleGoBack} className="btn-goback">
          Back to Posts
        </button>
      </div>
    );
  }

  const createdAt = new Date(post.created_at).toLocaleDateString();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <button onClick={handleGoBack} className="btn-goback">
        ← Back to Posts
      </button>

      <article className="blog-post">
        <header>
          <h1 className="singlePostTitle">{post.title}</h1>
          <div className="blog-post-meta">Published on {createdAt}, by {post.username}</div>
        </header>

        {post.image_url && (
        <img 
          src={post.image_url} 
          alt={post.title}
          className='singlePostImg'
        />
        )}

        <div className="single-post-content">
          {post.content}
        </div>

        {isAuthor ? (
          <footer className="postFooter">
            <button onClick={handleEdit} className="btn-success">
              <i className="singlePostIcon fa-regular fa-pen-to-square"></i> Edit
            </button>
            <button onClick={handleDelete} className="btn-danger">
              <i className="singlePostIcon fa-regular fa-trash-can"></i> Delete
            </button>
          </footer>
        ) : (
          <footer className="blog-post-meta" style={{marginTop: '1rem'}}>
            <em>You're either a Guest, or not the author of this post.</em>
          </footer>
        )}
      </article>
    </div>
  );
}
