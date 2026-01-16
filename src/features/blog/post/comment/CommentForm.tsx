import React , { useState, useEffect } from 'react'
import { useAppSelector } from '../../../../app/hooks';
import { selectUser } from '../../../auth/authSlice';
import { selectEditingPost } from './commentSlice';
import { supabase } from '../../../../lib/supabaseClient';
import { uploadCommentImage } from '../../../../lib/imageUpload';
import './commentform.css';

interface CommentFormProps {
  onPostCreated: () => void;
  onCancel: () => void;
  postId: string;
}

export function CommentForm({ onPostCreated, onCancel, postId }: CommentFormProps) {
  const user = useAppSelector(selectUser);
  const editingPost = useAppSelector(selectEditingPost);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content);
      setImageUrl(editingPost.image_url || '');
      setImagePreview(editingPost.image_url || '');
    } else {
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
        finalImageUrl = await uploadCommentImage(imageFile, user.id);
        console.log('Image URL received:', finalImageUrl);
      }

      if (editingPost) {
        // Update existing post
        console.log('Updating post with image_url:', finalImageUrl);
        const { error } = await supabase
          .from('comments')
          .update({ content, image_url: finalImageUrl || null })
          .eq('id', editingPost.id);
        
        if (error) throw error;
      } else {
        // Create new post
        console.log('Creating post with image_url:', finalImageUrl);
        const { error } = await supabase
          .from('comments')
          .insert([{ content, user_id: user.id, username: user.user_metadata.username, image_url: finalImageUrl || null, post_id: postId }]);
        
        if (error) throw error;
      }
      
      onPostCreated();
      setContent('');
      setImageFile(null);
      setImageUrl('');
      setImagePreview('');
    } catch (error: any) {
      alert(`Oops! ${editingPost ? 'updating' : 'creating'} post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to comment.</div>;
  }
  
  return (
    <div className="comment-form">
      <h2>{editingPost ? 'Edit Comment' : 'Create New Comment'}</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <textarea
          className="commentInput blog-form-textarea"
          placeholder="Write your comment here."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div className="commentImgUpload">
              <label className="coverImg" htmlFor="image">
                Image:
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div style={{ marginTop: '0.5rem' }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                </div>
              )}
            </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" disabled={loading} >
            {loading ? 'Saving...' : editingPost ? 'Update Comment' : 'Create Comment'}
          </button>
          <button type="button" onClick={onCancel} >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
