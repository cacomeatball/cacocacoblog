import { supabase } from './supabaseClient';

export const uploadBlogImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  const filePath = `blog-images/${fileName}`;

  console.log('Starting image upload:', { filePath, fileSize: file.size, fileType: file.type });

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('blog-images')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  console.log('Upload successful:', uploadData);

  const { data } = supabase.storage
    .from('blog-images')
    .getPublicUrl(filePath);

  console.log('Public URL generated:', data.publicUrl);
  return data.publicUrl;
};

export const deleteBlogImage = async (filePath: string) => {
  const { error } = await supabase.storage
    .from('blog-images')
    .remove([filePath]);

  if (error) throw error;
};
