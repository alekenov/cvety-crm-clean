import { supabase, supabaseAdmin } from '@/lib/supabase';

const BUCKET_NAME = 'orders';

export const storageService = {
  /**
   * Set up storage bucket policies
   * @returns {Promise<boolean>}
   */
  async setupBucketPolicies() {
    try {
      // Enable RLS
      const { error: rlsError } = await supabaseAdmin.rpc('enable_rls_for_storage');
      if (rlsError) {
        console.error('Error enabling RLS:', rlsError.message);
        return false;
      }

      // Create policies for authenticated users
      const policies = [
        {
          name: 'Allow authenticated uploads',
          operation: 'INSERT',
          expression: 'auth.role() = \'authenticated\''
        },
        {
          name: 'Allow authenticated reads',
          operation: 'SELECT',
          expression: 'auth.role() = \'authenticated\''
        },
        {
          name: 'Allow authenticated updates',
          operation: 'UPDATE',
          expression: 'auth.role() = \'authenticated\''
        },
        {
          name: 'Allow authenticated deletes',
          operation: 'DELETE',
          expression: 'auth.role() = \'authenticated\''
        }
      ];

      for (const policy of policies) {
        const { error } = await supabaseAdmin.rpc('create_storage_policy', {
          bucket_id: BUCKET_NAME,
          policy_name: policy.name,
          policy_operation: policy.operation,
          policy_expression: policy.expression
        });

        if (error && !error.message.includes('already exists')) {
          console.error(`Error creating policy ${policy.name}:`, error.message);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error setting up bucket policies:', error.message);
      return false;
    }
  },

  /**
   * Ensure the bucket exists and is properly configured
   * @returns {Promise<boolean>}
   */
  async ensureBucketExists() {
    try {
      // Try to get bucket info first using admin client
      const { data: buckets, error: listError } = await supabaseAdmin
        .storage
        .listBuckets();

      const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);

      if (!bucketExists) {
        // Create the bucket if it doesn't exist using admin client
        const { error: createError } = await supabaseAdmin
          .storage
          .createBucket(BUCKET_NAME, {
            public: false, // Set to false for better security
            fileSizeLimit: 52428800, // 50MB
            allowedMimeTypes: ['image/*']
          });

        if (createError) {
          console.error('Error creating bucket:', createError.message);
          return { error: 'Ошибка при создании хранилища' };
        }

        // Set up bucket policies
        const policiesSet = await this.setupBucketPolicies();
        if (!policiesSet) {
          return { error: 'Ошибка при настройке прав доступа' };
        }

        console.log('Bucket created and configured successfully');
      }

      return true;
    } catch (error) {
      console.error('Error checking/creating bucket:', error.message);
      return { error: 'Ошибка при проверке хранилища' };
    }
  },

  /**
   * Upload a file to Supabase Storage
   * @param {File} file - The file to upload
   * @param {string} path - The path where to store the file (e.g., 'orders/123/photos/1.jpg')
   * @returns {Promise<{ path: string, url: string } | null>}
   */
  async uploadFile(file, path) {
    try {
      // Ensure bucket exists before upload
      const bucketReady = await this.ensureBucketExists();
      if (bucketReady === true) {
        // Use admin client for upload to bypass RLS during development
        const { data, error } = await supabaseAdmin.storage
          .from(BUCKET_NAME)
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Error uploading file:', error.message);
          return { error: 'Ошибка при загрузке файла' };
        }

        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from(BUCKET_NAME)
          .getPublicUrl(data.path);

        return {
          data: {
            path: data.path,
            url: publicUrl
          }
        };
      } else {
        return bucketReady;
      }
    } catch (error) {
      console.error('Error in uploadFile:', error.message);
      return { error: 'Ошибка при загрузке файла' };
    }
  },

  /**
   * Delete a file from Supabase Storage
   * @param {string} path - The path of the file to delete
   * @returns {Promise<boolean>}
   */
  async deleteFile(path) {
    try {
      // Ensure bucket exists before delete
      const bucketReady = await this.ensureBucketExists();
      if (bucketReady === true) {
        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([path]);

        if (error) {
          console.error('Error deleting file:', error.message);
          return { error: 'Ошибка при удалении файла' };
        }

        return true;
      } else {
        return bucketReady;
      }
    } catch (error) {
      console.error('Error in deleteFile:', error.message);
      return { error: 'Ошибка при удалении файла' };
    }
  },

  /**
   * Get a list of files in a directory
   * @param {string} prefix - The directory path to list
   * @returns {Promise<Array<{ name: string, url: string }> | null>}
   */
  async listFiles(prefix) {
    try {
      // Ensure bucket exists before list
      const bucketReady = await this.ensureBucketExists();
      if (bucketReady === true) {
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .list(prefix);

        if (error) {
          console.error('Error listing files:', error.message);
          return { error: 'Ошибка при получении списка файлов' };
        }

        // Get public URLs for all files
        return {
          data: data.map(file => ({
            name: file.name,
            url: supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(`${prefix}/${file.name}`)
              .data.publicUrl
          }))
        };
      } else {
        return bucketReady;
      }
    } catch (error) {
      console.error('Error in listFiles:', error.message);
      return { error: 'Ошибка при получении списка файлов' };
    }
  }
};
