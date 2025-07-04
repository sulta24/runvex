# API Integration Documentation

## Overview
This document describes the API integration for the Runvex frontend application.

## Configuration
All API endpoints are configured in `src/config/api.ts`:

```typescript
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
```

## Features Implemented

### 1. Video Creation with Lyrics
- **Endpoint**: `POST /api/create-video-with-lyrics`
- **Location**: `src/pages/CreatePage.tsx`
- **Features**:
  - Upload video and audio files
  - Configure video parameters (resolution, FPS, quality)
  - Set timing and transitions
  - Real-time processing status

### 2. Video Result Display
- **Location**: `src/pages/CreatePage.tsx`
- **Features**:
  - Video player with controls
  - Download functionality
  - Detailed analysis information:
    - Tempo (BPM)
    - Color scheme
    - Words count
    - Sync accuracy
    - Timeline blocks
    - Beats count
    - Key moments
    - Processing time

### 3. Authentication
- **Endpoints**: 
  - `POST /login`
  - `POST /signup`
  - `GET /api/user/info`
- **Location**: `src/contexts/AuthContext.tsx`, `src/pages/LoginPage.tsx`, `src/pages/SignupPage.tsx`

### 4. File Management
- **Upload**: `POST /api/upload-simple-media`
- **Download**: `GET /api/files/{container}/{filename}`

## Video Result Interface

The video result is displayed with the following structure:

```typescript
interface VideoResult {
  message: string;
  task_id: string;
  template_filename: string;
  output_filename: string;
  output_url: string;
  analysis_details: {
    tempo: number;
    color_scheme: string;
    words_count: number;
    sync_accuracy: string;
    timeline_blocks: number;
    beats_count: number;
    key_moments: number;
  };
  processing_time: string;
}
```

## Usage

1. **Create Video**: Navigate to `/create` page
2. **Upload Files**: Drag and drop video and audio files
3. **Configure Settings**: Set timing, quality, and other parameters
4. **Submit**: Click "Create Video" to start processing
5. **View Result**: Once complete, the video will be displayed with download option
6. **Download**: Click "Download Video" to save the file locally

## Error Handling

- Network errors are caught and displayed to the user
- Invalid file types are rejected
- Authentication errors redirect to login
- Processing errors show appropriate messages

## Deployment

The application is configured to use `https://api.runvex.net` as the API base URL. For local development, you can modify the `API_BASE_URL` in `src/config/api.ts`. 