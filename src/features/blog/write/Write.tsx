import "./write.css"

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../auth/authSlice';
import { selectEditingPost } from '../blogSlice';
import { supabase } from '../../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface BlogFormProps {
  onPostCreated: () => void;
  onCancel: () => void;
}

export function Write({ onPostCreated, onCancel }: BlogFormProps) {
  const user = useAppSelector(selectUser);
  const editingPost = useAppSelector(selectEditingPost);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
          .insert([{ title, content, user_id: user.id, username: user.user_metadata.username }]);
        
        if (error) throw error;
      }
      
      onPostCreated();
      setTitle('');
      setContent('');
    } catch (error: any) {
      alert(`Oops! ${editingPost ? 'updating' : 'creating'} post: ${error.message}`);
    } finally {
      setLoading(false);
      navigate('/');
    }
  };

  if (!user) {
    return <div>Please log in to create posts.</div>;
  }
  return (
    <div className="write">
        <img
            className="writeImg" 
            src="https://info-ongeki.sega.jp/wp-content/uploads/2022/07/d8749dbe9c25cef252198448aa20f742.jpg" 
            alt="" />
        <form onSubmit={handleSubmit} className="writeForm">
            <div className="writeFormGroup">
                <input type="file" id="fileInput" style={{display:"none"}} />
                <input 
                    type="text" 
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="writeInput" 
                    autoFocus={true}
                    required
                />
            </div>
            <div className="writeFormGroup">
                <textarea 
                    placeholder="Put your thoughts here." 
                    typeof="text" 
                    className="writeInput writeText"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
            </div>
            <button className="writeSubmit" disabled={loading}>
                {loading ? 'Please wait...' : editingPost ? 'Update Post' : 'Publish'}
            </button>
        </form>
    </div>
  )
}
