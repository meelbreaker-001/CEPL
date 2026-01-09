import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a file to the Supabase 'event-images' bucket
 * @param file The file object to upload
 * @param path The folder/path within the bucket
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('event-images')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('event-images')
    .getPublicUrl(filePath);

  return publicUrl;
};