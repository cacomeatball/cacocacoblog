import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { selectPosts, selectLoading, setPosts, removePost, setLoading, setEditingPost, type CommentPost } from './commentSlice';
import { selectUser } from '../../../auth/authSlice';
import { supabase } from '../../../../lib/supabaseClient';
import { CommentForm } from './CommentForm';
import { CommentComponent } from './CommentComponent';
import { useSearchParams } from 'react-router-dom';

interface CommentListProps {
  postId: string;
}

export function CommentList({ postId }: CommentListProps) {
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

  useEffect(() => {
    fetchPosts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, postId]);

  const fetchPosts = async (pageArg?: number) => {
    const pageToFetch = pageArg ?? page;
    dispatch(setLoading(true));
    try {
      const start = (pageToFetch - 1) * perPage;
      const end = pageToFetch * perPage - 1;
      const { data, error, count } = await supabase
        .from('comments')
        .select('*', { count: 'exact' })
        .eq('post_id', postId)
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;
      dispatch(setPosts(data || []));
      const total = typeof count === 'number' ? count : (data ? data.length : 0);
      setTotalCount(total);
      setTotalPages(Math.max(1, Math.ceil(total / perPage)));
    } catch (error: any) {
      alert(`Error fetching comments: ${error.message}`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (post: CommentPost) => {
    dispatch(setEditingPost(post));
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('comments')
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
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading comments...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className='blogposts-header'>Comments</h2>
        {user && !showForm && (
          <button onClick={handleCreateNew} className="btn-comment">
            Create New Comment
          </button>
        )}
      </div>

      {showForm && (
        <CommentForm postId={postId} onPostCreated={handlePostCreated} onCancel={handleCancel} />
      )}

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <h3 style={{ color: '#64748b', margin: '0 0 0.5rem 0' }}>No comments yet</h3>
          <p style={{ margin: 0 }}>{user ? 'Be the first to comment!' : 'Please log in to comment.'}</p>
        </div>
      ) : (
        <div>
          <div className='posts'>
            {posts.map(post => (
              <CommentComponent
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