import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../auth/authSlice';
import { selectEditingPost } from '../blogSlice';
import { supabase } from '../../../lib/supabaseClient';
import { uploadBlogImage } from '../../../lib/imageUpload';

interface BlogFormProps {
  onPostCreated: () => void;
  onCancel: () => void;
}

export function BlogForm({ onPostCreated, onCancel }: BlogFormProps) {
  const user = useAppSelector(selectUser);
  const editingPost = useAppSelector(selectEditingPost);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setImageUrl(editingPost.image_url || '');
      setImagePreview(editingPost.image_url || '');
    } else {
      setTitle('');
      setContent('');
      setImageUrl('');
      setImageFile(null);
      setImagePreview('');
    }
  }, [editingPost]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let finalImageUrl = imageUrl;

      // Upload new image if selected
      if (imageFile) {
        console.log('Uploading image:', imageFile.name);
        finalImageUrl = await uploadBlogImage(imageFile, user.id);
        console.log('Image URL received:', finalImageUrl);
      }

      if (editingPost) {
        // Update existing post
        console.log('Updating post with image_url:', finalImageUrl);
        const { error } = await supabase
          .from('posts')
          .update({ title, content, image_url: finalImageUrl || null })
          .eq('id', editingPost.id);
        
        if (error) throw error;
      } else {
        // Create new post
        console.log('Creating post with image_url:', finalImageUrl);
        const { error } = await supabase
          .from('posts')
          .insert([{ title, content, user_id: user.id, image_url: finalImageUrl || null }]);
        
        if (error) throw error;
      }
      
      onPostCreated();
      setTitle('');
      setContent('');
      setImageFile(null);
      setImageUrl('');
      setImagePreview('');
    } catch (error: any) {
      console.error('Error:', error);
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
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="image" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Featured Image:
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="blog-form-input"
          />
          {imagePreview && (
            <div style={{ marginTop: '0.5rem' }}>
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </div>
          )}
        </div>

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