import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import { compressImage, validateImageFile } from '../utils/imageUtils';

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
  state: 'running' | 'paused' | 'success' | 'error';
}

export interface UploadTask {
  id: string;
  file: File;
  progress: UploadProgress;
  downloadURL?: string;
  error?: string;
}

export interface UseStorageReturn {
  uploads: UploadTask[];
  uploadFile: (file: File, path?: string) => Promise<string>;
  uploadMultipleFiles: (files: File[], path?: string) => Promise<string[]>;
  cancelUpload: (id: string) => void;
  clearCompleted: () => void;
  isUploading: boolean;
}

export const useStorage = (): UseStorageReturn => {
  const [uploads, setUploads] = useState<UploadTask[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const updateUploadProgress = useCallback((id: string, update: Partial<UploadProgress>) => {
    setUploads(prev => prev.map(upload => 
      upload.id === id 
        ? { ...upload, progress: { ...upload.progress, ...update } }
        : upload
    ));
  }, []);

  const uploadFile = useCallback(async (file: File, path: string = 'products'): Promise<string> => {
    setIsUploading(true);
    
    const uploadId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileName = `${Date.now()}_${file.name}`;
    const storagePath = `${path}/${fileName}`;
    
    // Validate file first
    const validation = await validateImageFile(file, {
      maxSizeMB: 10,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      minWidth: 100,
      maxWidth: 4000,
      minHeight: 100,
      maxHeight: 4000
    });

    if (!validation.isValid) {
      throw new Error(validation.error || 'File validation failed');
    }

    // Compress image before upload
    let fileToUpload = file;
    try {
      fileToUpload = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
        maxFileSize: 2 * 1024 * 1024 // 2MB
      });
    } catch (error) {
      console.warn('Compression failed, uploading original file:', error);
    }

    // Create upload task
    const uploadTask: UploadTask = {
      id: uploadId,
      file: fileToUpload,
      progress: {
        progress: 0,
        bytesTransferred: 0,
        totalBytes: fileToUpload.size,
        state: 'running'
      }
    };

    setUploads(prev => [...prev, uploadTask]);

    const storageRef = ref(storage, storagePath);
    const uploadTaskRef = uploadBytesResumable(storageRef, fileToUpload);

    return new Promise((resolve, reject) => {
      uploadTaskRef.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          updateUploadProgress(uploadId, {
            progress,
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            state: snapshot.state === 'running' ? 'running' : 
                   snapshot.state === 'paused' ? 'paused' : 'running'
          });
        },
        (error) => {
          console.error('Upload error:', error);
          updateUploadProgress(uploadId, {
            state: 'error'
          });
          setUploads(prev => prev.map(u => 
            u.id === uploadId 
              ? { ...u, error: error.message, progress: { ...u.progress, state: 'error' } }
              : u
          ));
          setIsUploading(false);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTaskRef.snapshot.ref);
            updateUploadProgress(uploadId, {
              state: 'success',
              progress: 100
            });
            
            setUploads(prev => prev.map(u => 
              u.id === uploadId 
                ? { ...u, downloadURL, progress: { ...u.progress, state: 'success', progress: 100 } }
                : u
            ));
            
            setIsUploading(false);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            updateUploadProgress(uploadId, {
              state: 'error'
            });
            setIsUploading(false);
            reject(error);
          }
        }
      );
    });
  }, [updateUploadProgress]);

  const uploadMultipleFiles = useCallback(async (files: File[], path: string = 'products'): Promise<string[]> => {
    setIsUploading(true);
    const results: string[] = [];
    
    for (const file of files) {
      try {
        const url = await uploadFile(file, path);
        results.push(url);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        // Continue with other files even if one fails
      }
    }
    
    setIsUploading(false);
    return results;
  }, [uploadFile]);

  const cancelUpload = useCallback((id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads(prev => prev.filter(upload => upload.progress.state !== 'success'));
  }, []);

  return {
    uploads,
    uploadFile,
    uploadMultipleFiles,
    cancelUpload,
    clearCompleted,
    isUploading
  };
};

/**
 * Utility function to delete a file from storage
 */
export const deleteFileFromStorage = async (fileUrl: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const url = new URL(fileUrl);
    const path = decodeURIComponent(url.pathname);
    // Remove the leading /o/ and any query parameters
    const filePath = path.replace(/^\/o\//, '').split('?')[0];
    
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};
