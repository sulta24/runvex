export const API_BASE_URL = 'https://api.runvex.net';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  SIGNUP: `${API_BASE_URL}/signup`,
  USER_INFO: `${API_BASE_URL}/api/user/info`,
  UPLOAD_MEDIA: `${API_BASE_URL}/api/upload-simple-media`,
  CREATE_VIDEO: `${API_BASE_URL}/api/create-video-with-lyrics`,
  DOWNLOAD_FILE: (container: string, filename: string) => 
    `${API_BASE_URL}/api/files/${container}/${filename}`,
}; 