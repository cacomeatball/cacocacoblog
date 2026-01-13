import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectPosts, selectLoading, setPosts, addPost, updatePost, removePost, setLoading, setEditingPost, type BlogPost } from './blogSlice';
import { selectUser } from '../auth/authSlice';
import { supabase } from '../../lib/supabaseClient';
import { BlogForm } from './BlogForm';
import { BlogPostComponent } from './BlogPostComponent';

export function BlogList() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const loading = useAppSelector(selectLoading);
  const user = useAppSelector(selectUser);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    dispatch(setLoading(true));
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      dispatch(setPosts(data || []));
    } catch (error: any) {
      alert(`Error fetching posts: ${error.message}`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (post: BlogPost) => {
    dispatch(setEditingPost(post));
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      dispatch(removePost(id));
    } catch (error: any) {
      alert(`Error deleting post: ${error.message}`);
    }
  };

  const handlePostCreated = () => {
    setShowForm(false);
    dispatch(setEditingPost(null));
    fetchPosts(); // Refresh the list
  };

  const handleCancel = () => {
    setShowForm(false);
    dispatch(setEditingPost(null));
  };

  const handleCreateNew = () => {
    dispatch(setEditingPost(null));
    setShowForm(true);
  };

  if (loading && posts.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading posts...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, color: '#1e293b' }}>Blog Posts</h1>
        {user && !showForm && (
          <button onClick={handleCreateNew} className="btn-primary">
            New Post
          </button>
        )}
      </div>

      {showForm && (
        <BlogForm onPostCreated={handlePostCreated} onCancel={handleCancel} />
      )}

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <h3 style={{ color: '#64748b', margin: '0 0 0.5rem 0' }}>No blog posts yet</h3>
          <p style={{ margin: 0 }}>{user ? 'Create your first post!' : 'Please log in to create posts.'}</p>
        </div>
      ) : (
        <div>
          {posts.map(post => (
            <BlogPostComponent
              key={post.id}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}