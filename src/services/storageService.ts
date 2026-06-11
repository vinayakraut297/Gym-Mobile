import { supabase } from './supabase';

export const storageService = {
  /**
   * Upload an image to a specific Supabase storage bucket.
   * Leverages blob parsing for React Native Expo compatibility.
   */
  async uploadImage(
    bucket: 'avatars' | 'gym-images' | 'member-images' | 'exercise-images',
    path: string,
    fileUri: string,
    mimeType?: string
  ): Promise<string> {
    try {
      // Fetch the file from the local URI and convert to blob
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, blob, {
          contentType: mimeType || 'image/jpeg',
          upsert: true,
        });

      if (error) throw error;
      
      // Return the public URL after successful upload
      return this.getPublicURL(bucket, path);
    } catch (error) {
      console.error('Storage Upload Error:', error);
      throw error;
    }
  },

  /**
   * Remove an image from a Supabase storage bucket.
   */
  async deleteImage(
    bucket: 'avatars' | 'gym-images' | 'member-images' | 'exercise-images',
    path: string
  ): Promise<boolean> {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
    return true;
  },

  /**
   * Fetch the public URL of a file in a Supabase storage bucket.
   */
  getPublicURL(
    bucket: 'avatars' | 'gym-images' | 'member-images' | 'exercise-images',
    path: string
  ): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },
};
