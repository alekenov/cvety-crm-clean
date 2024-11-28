import { supabase } from '@/lib/supabase';

const BUCKET_NAME = 'orders';

export const storageService = {
  /**
   * Загрузка файла в Supabase Storage
   * @param {File} file - Файл для загрузки
   * @param {string} path - Путь для сохранения файла (например, 'orders/123/photos/1.jpg')
   * @returns {Promise<{ path: string, url: string } | null>}
   */
  async uploadFile(file, path) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Получаем публичный URL файла
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(data.path);

      return {
        path: data.path,
        url: publicUrl
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  },

  /**
   * Удаление файла из Supabase Storage
   * @param {string} path - Путь к файлу для удаления
   * @returns {Promise<boolean>}
   */
  async deleteFile(path) {
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  },

  /**
   * Получение списка файлов в директории
   * @param {string} prefix - Путь к директории для просмотра
   * @returns {Promise<Array<{ name: string, url: string }> | null>}
   */
  async listFiles(prefix) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .list(prefix);

      if (error) throw error;

      return await Promise.all(data.map(async (file) => {
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`${prefix}/${file.name}`);

        return {
          name: file.name,
          url: publicUrl
        };
      }));
    } catch (error) {
      console.error('Error listing files:', error);
      return null;
    }
  },

  /**
   * Получение публичного URL файла
   * @param {string} path - Путь к файлу
   * @returns {string | null}
   */
  getPublicUrl(path) {
    try {
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);
      return publicUrl;
    } catch (error) {
      console.error('Error getting public URL:', error);
      return null;
    }
  }
};

export default storageService;
