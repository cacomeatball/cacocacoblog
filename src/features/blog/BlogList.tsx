import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectPosts, selectLoading, setPosts, removePost, setLoading, setEditingPost, type BlogPost } from './blogSlice';
import { selectUser } from '../auth/authSlice';
import { supabase } from '../../lib/supabaseClient';
import { BlogForm } from './write/BlogForm';
import { BlogPostComponent } from './BlogPostComponent';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './bloglist.css';

export function BlogList() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const loading = useAppSelector(selectLoading);
  const user = useAppSelector(selectUser);
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const [perPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchPosts = async (pageArg = 1) => {
    dispatch(setLoading(true));
    try {
      const start = (pageArg - 1) * perPage;
      const end = pageArg * perPage - 1;
      const { data, error, count } = await supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;
      dispatch(setPosts(data || []));
      const total = typeof count === 'number' ? count : (data ? data.length : 0);
      setTotalCount(total);
      setTotalPages(Math.max(1, Math.ceil(total / perPage)));
    } catch (error: any) {
      alert(`Error fetching posts: ${error.message}`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (post: BlogPost) => {
    dispatch(setEditingPost(post));
    navigate('/write');
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      dispatch(removePost(id));
      // adjust page if deleting last item on the last page
      const newTotal = Math.max(0, totalCount - 1);
      const newTotalPages = Math.max(1, Math.ceil(newTotal / perPage));
      const newPage = Math.min(page, newTotalPages);
      setSearchParams({ page: String(newPage) });
      fetchPosts(newPage);
    } catch (error: any) {
      alert(`Error deleting post: ${error.message}`);
    }
  };

  const handlePostCreated = () => {
    setShowForm(false);
    dispatch(setEditingPost(null));
    // go to first page and refresh
    setSearchParams({ page: '1' });
    fetchPosts(1);
  };

  const handleCancel = () => {
    setShowForm(false);
    dispatch(setEditingPost(null));
  };

  const handleCreateNew = () => {
    dispatch(setEditingPost(null));
    navigate('/write');
  };

  

  if (loading && posts.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading posts...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className='blogposts-header'>Blog Posts</h1>
        {user && !showForm && (
          <button onClick={handleCreateNew} className="btn-primary">
            Create New Post
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
          <div className='posts'>
            {posts.map(post => (
              <BlogPostComponent
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <nav className="pagination" aria-label="Pagination">
            <button className="page-btn" onClick={() => setSearchParams({ page: String(Math.max(1, page - 1)) })} disabled={page === 1}>
              Prev
            </button>

            {Array.from({ length: Math.max(1, totalPages) }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  className={`page-btn ${p === page ? 'active' : ''}`}
                  onClick={() => setSearchParams({ page: String(p) })}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </button>
              );
            })}

            <button className="page-btn" onClick={() => setSearchParams({ page: String(Math.min(totalPages, page + 1)) })} disabled={page >= totalPages}>
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}