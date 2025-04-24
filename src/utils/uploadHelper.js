// src/utils/uploadHelper.js

/**
 * Optimized file uploader that handles chunking and parallel uploads
 * @param {File} file - The file to upload
 * @param {string} presignedUrl - The presigned URL from S3
 * @param {Object} config - Configuration options
 * @returns {Promise} - Promise that resolves when upload is complete
 */
export async function uploadFileOptimized(file, presignedUrl, config = {}) {
    // Default configuration
    const {
      chunkSize = 5 * 1024 * 1024, // 5MB chunks
      concurrentUploads = 3,       // Number of concurrent uploads
      compressImages = true,       // Compress images before upload
      retryCount = 3,              // Number of retries
      retryDelay = 1000,           // Delay between retries in ms
      onProgress = () => {},       // Progress callback
    } = config;
  
    // For images, compress before upload if enabled
    let fileToUpload = file;
    if (compressImages && file.type.startsWith('image/')) {
      fileToUpload = await compressImage(file);
    }
    
    // For small files, use direct upload
    if (fileToUpload.size <= chunkSize) {
      return directUpload(fileToUpload, presignedUrl, { 
        retryCount, 
        retryDelay,
        onProgress 
      });
    }
    
    // For larger files, use chunked upload
    return chunkedUpload(fileToUpload, presignedUrl, {
      chunkSize,
      concurrentUploads,
      retryCount,
      retryDelay,
      onProgress
    });
  }
  
  /**
   * Compress an image file before upload
   * @param {File} imageFile - The image file to compress
   * @returns {Promise<Blob>} - Promise resolving to compressed image blob
   */
  async function compressImage(imageFile) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions, maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        // Max dimensions for upload (adjust as needed)
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1920;
        
        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }
        
        if (height > MAX_HEIGHT) {
          width = (width * MAX_HEIGHT) / height;
          height = MAX_HEIGHT;
        }
        
        // Create canvas for compression
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with quality setting
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Add original file name to compressed blob
              const compressedFile = new File(
                [blob], 
                imageFile.name, 
                { type: 'image/jpeg', lastModified: Date.now() }
              );
              resolve(compressedFile);
            } else {
              reject(new Error('Image compression failed'));
            }
          },
          'image/jpeg',
          0.85 // Quality setting (0-1)
        );
      };
      
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      
      // Load image from file
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(imageFile);
    });
  }
  
  /**
   * Direct upload for small files
   * @param {File} file - The file to upload
   * @param {string} presignedUrl - The presigned URL
   * @param {Object} options - Upload options
   * @returns {Promise} - Promise resolving when upload completes
   */
  async function directUpload(file, presignedUrl, { retryCount, retryDelay, onProgress }) {
    // Use XMLHttpRequest for better progress reporting
    return new Promise((resolve, reject) => {
      let attempts = 0;
      
      const attemptUpload = () => {
        const xhr = new XMLHttpRequest();
        
        // Setup progress tracking
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            onProgress(percentComplete);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(presignedUrl.split('?')[0]); // Return the base URL without query params
          } else {
            const error = new Error(`Upload failed with status: ${xhr.status}`);
            retryOrReject(error);
          }
        });
        
        xhr.addEventListener('error', () => {
          retryOrReject(new Error('Network error during upload'));
        });
        
        xhr.addEventListener('abort', () => {
          reject(new Error('Upload aborted'));
        });
        
        // Send the request
        xhr.open('PUT', presignedUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.setRequestHeader('x-amz-acl', 'public-read');
        xhr.send(file);
      };
      
      const retryOrReject = (error) => {
        attempts++;
        if (attempts <= retryCount) {
          console.log(`Upload attempt ${attempts} failed, retrying in ${retryDelay}ms...`);
          setTimeout(attemptUpload, retryDelay);
        } else {
          reject(error);
        }
      };
      
      attemptUpload();
    });
  }
  
  /**
   * Chunked upload for larger files
   * @param {File} file - The file to upload
   * @param {string} presignedUrl - The presigned URL
   * @param {Object} options - Upload options
   * @returns {Promise} - Promise resolving when upload completes
   */
  async function chunkedUpload(file, presignedUrl, { 
    chunkSize, 
    concurrentUploads, 
    retryCount, 
    retryDelay, 
    onProgress 
  }) {
    // Split file into chunks
    const chunks = [];
    let offset = 0;
    let uploadedChunks = 0;
    
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      chunks.push({
        data: chunk,
        index: chunks.length,
        start: offset,
        end: offset + chunk.size - 1,
        uploaded: false,
        attempts: 0
      });
      offset += chunkSize;
    }
    
    // Function to upload a single chunk
    const uploadChunk = async (chunk) => {
      if (chunk.uploaded || chunk.attempts >= retryCount) return;
      
      chunk.attempts++;
      
      try {
        // Use fetch with custom headers for each chunk
        const response = await fetch(presignedUrl, {
          method: 'PUT',
          body: chunk.data,
          headers: {
            'Content-Type': file.type,
            'x-amz-acl': 'public-read',
            'Content-Range': `bytes ${chunk.start}-${chunk.end}/${file.size}`
          }
        });
        
        if (response.ok) {
          chunk.uploaded = true;
          uploadedChunks++;
          
          // Update progress
          const percentComplete = Math.round((uploadedChunks / chunks.length) * 100);
          onProgress(percentComplete);
          
          return true;
        } else {
          console.error(`Chunk ${chunk.index} upload failed:`, response.status);
          throw new Error(`HTTP error ${response.status}`);
        }
      } catch (error) {
        console.error(`Chunk ${chunk.index} attempt ${chunk.attempts} failed:`, error);
        
        // Retry with delay if attempts remain
        if (chunk.attempts < retryCount) {
          return new Promise((resolve) => {
            setTimeout(() => {
              uploadChunk(chunk).then(resolve).catch(() => resolve(false));
            }, retryDelay * chunk.attempts); // Progressive backoff
          });
        }
        
        return false;
      }
    };
    
    // Upload chunks with limited concurrency
    const uploadAllChunks = async () => {
      const chunkQueue = [...chunks];
      
      while (chunkQueue.length > 0) {
        // Take up to concurrentUploads chunks
        const currentBatch = chunkQueue.splice(0, concurrentUploads);
        
        // Upload current batch in parallel
        await Promise.all(currentBatch.map(uploadChunk));
      }
      
      // Check if all chunks uploaded successfully
      const allUploaded = chunks.every(chunk => chunk.uploaded);
      
      if (!allUploaded) {
        throw new Error('Some chunks failed to upload after multiple retries');
      }
      
      return presignedUrl.split('?')[0]; // Return base URL without query params
    };
    
    return uploadAllChunks();
  }
  
  /**
   * Batch upload multiple files with optimized settings
   * @param {Array<File>} files - Array of files to upload
   * @param {Array<Object>} presignedData - Array of presigned URL data objects
   * @param {Object} config - Upload configuration
   * @returns {Promise<Array>} - Promise resolving to array of uploaded file URLs
   */
  export async function batchUploadFiles(files, presignedData, config = {}) {
    const { 
      maxConcurrent = 3,
      onTotalProgress = () => {},
      onFileProgress = () => {},
      onFileComplete = () => {}
    } = config;
    
    const uploadQueue = files.map((file, index) => ({
      file,
      urlData: presignedData[index],
      status: 'pending',
      progress: 0
    }));
    
    const results = [];
    let completedCount = 0;
    
    // Helper to update total progress
    const updateTotalProgress = () => {
      const totalProgress = uploadQueue.reduce((sum, item) => sum + item.progress, 0) / uploadQueue.length;
      onTotalProgress(Math.round(totalProgress));
    };
    
    // Process uploads with limited concurrency
    const processQueue = async () => {
      // Find next batch of uploads to process
      const pendingUploads = uploadQueue.filter(item => item.status === 'pending');
      const currentBatch = pendingUploads.slice(0, maxConcurrent);
      
      if (currentBatch.length === 0) return results;
      
      // Mark these as in progress
      currentBatch.forEach(item => { item.status = 'uploading'; });
      
      // Start uploads in parallel
      await Promise.all(currentBatch.map(async (item) => {
        try {
          const fileUrl = await uploadFileOptimized(
            item.file, 
            item.urlData.uploadUrl,
            {
              ...config,
              onProgress: (progress) => {
                item.progress = progress;
                onFileProgress(item.file, progress);
                updateTotalProgress();
              }
            }
          );
          
          // Mark as complete
          item.status = 'completed';
          item.progress = 100;
          completedCount++;
          
          // Store result
          results.push({
            originalFile: item.file,
            fileUrl: item.urlData.fileUrl,
            key: item.urlData.key
          });
          
          onFileComplete(item.file, item.urlData.fileUrl);
          updateTotalProgress();
        } catch (error) {
          console.error(`Failed to upload ${item.file.name}:`, error);
          item.status = 'failed';
          item.error = error;
        }
      }));
      
      // Continue processing queue if there are more pending uploads
      if (uploadQueue.some(item => item.status === 'pending')) {
        return processQueue();
      }
      
      return results;
    };
    
    return processQueue();
  }