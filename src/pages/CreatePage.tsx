import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Upload, Video, Music, X, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import { API_ENDPOINTS } from '../config/api';

interface VideoFile {
  id: string;
  name: string;
  size: number;
}

interface AudioFile {
  id: string;
  name: string;
  duration?: number;
}

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

interface CreateForm {
  videoFiles: VideoFile[];
  audioFile: AudioFile | null;
  startTime: number;
  endTime: number;
  prompt: string;
  language: 'ru' | 'en';
  outputResolution: '1920x1080' | '1280x720' | '1080x1920';
  fps: 24 | 30 | 60;
  quality: 'low' | 'medium' | 'high';
  enableTransitions: boolean;
  syncToBeats: boolean;
  colorEnhancement: boolean;
  textOverlayStyle: 'default' | 'modern' | 'minimal' | 'bold';
}

const translations = {
  en: {
    backToHome: 'Back to Home',
    createVideo: 'Create Your Video',
    uploadAndDescribe: 'Upload your workout videos, audio, and describe your vision',
    uploadVideos: 'Upload Videos',
    uploadAudio: 'Upload Audio',
    dragAndDrop: 'Drag and drop files here, or click to browse',
    supportedVideoFormats: 'Supported formats: MP4, MOV, AVI (Max 500MB each)',
    supportedAudioFormats: 'Supported formats: MP3, WAV, M4A (Max 100MB)',
    describeVision: 'Describe Your Vision',
    describePlaceholder: 'Tell AI what kind of edit you want... (e.g., "Create a fast-paced montage with energetic music, focus on the most impressive moments, add motivational text overlays")',
    audioTiming: 'Audio Timing',
    startTime: 'Start Time (seconds)',
    endTime: 'End Time (seconds)',

    createVideoButton: 'Create Video',
    processing: 'Processing...',
    uploadVideoError: 'Please select at least one video file',
    uploadAudioError: 'Please select an audio file',
    descriptionError: 'Please provide a description of your vision',
    timingError: 'End time must be greater than start time',
    createVideoError: 'Failed to create video. Please try again.',
    videoCreated: 'Video created successfully!',
    processingVideo: 'AI is analyzing your footage and creating your video...',
    estimatedTime: 'Estimated time: 2-5 minutes',
    removeFile: 'Remove',
    totalDuration: 'Total duration',
    seconds: 'seconds',
    videoReady: 'Your video is ready!',
    downloadVideo: 'Download Video',
    watchVideo: 'Watch Video',
    videoDetails: 'Video Details',
    tempo: 'Tempo',
    colorScheme: 'Color Scheme',
    wordsCount: 'Words Count',
    syncAccuracy: 'Sync Accuracy',
    timelineBlocks: 'Timeline Blocks',
    beatsCount: 'Beats Count',
    keyMoments: 'Key Moments',
    processingTime: 'Processing Time',
    createNewVideo: 'Create New Video'
  },
  ru: {
    backToHome: 'Вернуться на главную',
    createVideo: 'Создать видео',
    uploadAndDescribe: 'Загрузите видео тренировок, аудио и опишите свою идею',
    uploadVideos: 'Загрузить видео',
    uploadAudio: 'Загрузить аудио',
    dragAndDrop: 'Перетащите файлы сюда или нажмите для выбора',
    supportedVideoFormats: 'Поддерживаемые форматы: MP4, MOV, AVI (Макс 500МБ каждый)',
    supportedAudioFormats: 'Поддерживаемые форматы: MP3, WAV, M4A (Макс 100МБ)',
    describeVision: 'Опишите свою идею',
    describePlaceholder: 'Расскажите ИИ, какой монтаж вы хотите... (например, "Создай динамичный монтаж с энергичной музыкой, сосредоточься на самых впечатляющих моментах, добавь мотивирующие тексты")',
    audioTiming: 'Время аудио',
    startTime: 'Время начала (секунды)',
    endTime: 'Время окончания (секунды)',

    createVideoButton: 'Создать видео',
    processing: 'Обработка...',
    uploadVideoError: 'Пожалуйста, выберите хотя бы одно видео',
    uploadAudioError: 'Пожалуйста, выберите аудио файл',
    descriptionError: 'Пожалуйста, опишите свою идею',
    timingError: 'Время окончания должно быть больше времени начала',
    createVideoError: 'Не удалось создать видео. Попробуйте еще раз.',
    videoCreated: 'Видео успешно создано!',
    processingVideo: 'ИИ анализирует ваше видео и создает монтаж...',
    estimatedTime: 'Примерное время: 2-5 минут',
    removeFile: 'Удалить',
    totalDuration: 'Общая длительность',
    seconds: 'секунд',
    videoReady: 'Ваше видео готово!',
    downloadVideo: 'Скачать видео',
    watchVideo: 'Смотреть видео',
    videoDetails: 'Детали видео',
    tempo: 'Темп',
    colorScheme: 'Цветовая схема',
    wordsCount: 'Количество слов',
    syncAccuracy: 'Точность синхронизации',
    timelineBlocks: 'Блоки таймлайна',
    beatsCount: 'Количество битов',
    keyMoments: 'Ключевые моменты',
    processingTime: 'Время обработки',
    createNewVideo: 'Создать новое видео'
  }
};

const CreatePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  
  const [formData, setFormData] = useState<CreateForm>({
    videoFiles: [],
    audioFile: null,
    startTime: 0,
    endTime: 30,
    prompt: '',
    language: lang === 'ru' ? 'ru' : 'en',
    outputResolution: '1920x1080',
    fps: 30,
    quality: 'high',
    enableTransitions: true,
    syncToBeats: true,
    colorEnhancement: true,
    textOverlayStyle: 'default'
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  
  const navigate = useNavigate();

  const handleVideoUpload = async (files: FileList) => {
    setError(null);
    const newVideos: VideoFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('video/')) {
        try {
          // Upload video to backend
          const formData = new FormData();
          formData.append('file', file);
          formData.append('media_type', 'video');
          
          const response = await fetch(API_ENDPOINTS.UPLOAD_MEDIA, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          });
          
          if (response.ok) {
            const data = await response.json();
            newVideos.push({
              id: data.db_id,
              name: file.name,
              size: file.size
            });
          } else {
            throw new Error('Failed to upload video');
          }
        } catch (err) {
          setError('Failed to upload video file');
          return;
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      videoFiles: [...prev.videoFiles, ...newVideos]
    }));
  };

  const handleAudioUpload = async (file: File) => {
    setError(null);
    
    if (file.type.startsWith('audio/')) {
      try {
        // Upload audio to backend
        const formData = new FormData();
        formData.append('file', file);
        formData.append('media_type', 'audio');
        
        const response = await fetch(API_ENDPOINTS.UPLOAD_MEDIA, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            audioFile: {
              id: data.db_id,
              name: file.name
            }
          }));
        } else {
          throw new Error('Failed to upload audio');
        }
      } catch (err) {
        setError('Failed to upload audio file');
      }
    }
  };

  const removeVideo = (id: string) => {
    setFormData(prev => ({
      ...prev,
      videoFiles: prev.videoFiles.filter(v => v.id !== id)
    }));
  };

  const removeAudio = () => {
    setFormData(prev => ({
      ...prev,
      audioFile: null
    }));
  };

  const handleDownloadVideo = async () => {
    if (!videoResult) return;
    
    try {
      const response = await fetch(API_ENDPOINTS.DOWNLOAD_FILE('output', videoResult.output_filename), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = videoResult.output_filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to download video');
      }
    } catch (err) {
      setError('Failed to download video');
      console.error(err);
    }
  };

  const handleCreateNewVideo = () => {
    setVideoResult(null);
    setFormData({
      videoFiles: [],
      audioFile: null,
      startTime: 0,
      endTime: 30,
      prompt: '',
      language: lang === 'ru' ? 'ru' : 'en',
      outputResolution: '1920x1080',
      fps: 30,
      quality: 'high',
      enableTransitions: true,
      syncToBeats: true,
      colorEnhancement: true,
      textOverlayStyle: 'default'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.videoFiles.length === 0) {
      setError(t.uploadVideoError);
      return;
    }

    if (!formData.audioFile) {
      setError(t.uploadAudioError);
      return;
    }

    if (!formData.prompt.trim()) {
      setError(t.descriptionError);
      return;
    }

    if (formData.endTime <= formData.startTime) {
      setError(t.timingError);
      return;
    }
    
    setIsLoading(true);
    try {
      // Prepare the request payload according to API documentation
      const payload = {
        video_file_ids: formData.videoFiles.map(v => v.id).join(','),
        audio_filename: formData.audioFile.name,
        start_time: formData.startTime,
        end_time: formData.endTime,
        prompt: formData.prompt,
        language: formData.language,
        output_resolution: formData.outputResolution,
        fps: formData.fps,
        quality: formData.quality,
        enable_transitions: formData.enableTransitions,
        sync_to_beats: formData.syncToBeats,
        color_enhancement: formData.colorEnhancement,
        text_overlay_style: formData.textOverlayStyle
      };

      const response = await fetch(API_ENDPOINTS.CREATE_VIDEO, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to create video');
      }

      const data = await response.json();
      setIsProcessing(true);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Set the video result
      setVideoResult(data);
      setIsProcessing(false);
      
    } catch (err) {
      setError(t.createVideoError);
      console.error(err);
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-6 sm:mb-8 flex items-center justify-between slide-in-left">
          <Link to="/" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 animated-button">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">{t.backToHome}</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 slide-in-right">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                <Play className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              </div>
              <span className="text-base sm:text-lg font-bold">Runvex</span>
            </div>
            <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
          </div>
        </nav>

        <div className="text-center mb-6 sm:mb-8 slide-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
            {t.createVideo}
          </h1>
          <p className="text-white/60 text-sm sm:text-base">
            {t.uploadAndDescribe}
          </p>
        </div>

        {isProcessing ? (
          <div className="text-center space-y-6 slide-in-up">
            <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
              <Video className="w-8 h-8 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">{t.processingVideo}</h2>
              <p className="text-white/60">{t.estimatedTime}</p>
            </div>
          </div>
        ) : videoResult ? (
          <div className="space-y-6 slide-in-up">
            {/* Video Result Header */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-green-400">{t.videoReady}</h2>
              <p className="text-white/60">{videoResult.message}</p>
            </div>

            {/* Video Player */}
            <div className="bg-white/5 rounded-lg p-4">
              <video
                controls
                className="w-full rounded-lg"
                src={API_ENDPOINTS.DOWNLOAD_FILE('output', videoResult.output_filename)}
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadVideo}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {t.downloadVideo}
              </button>
              <button
                onClick={handleCreateNewVideo}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                {t.createNewVideo}
              </button>
            </div>

            {/* Video Details */}
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-white/80">{t.videoDetails}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/50">{t.tempo}</div>
                  <div className="text-lg font-semibold">{videoResult.analysis_details.tempo} BPM</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/50">{t.colorScheme}</div>
                  <div className="text-lg font-semibold capitalize">{videoResult.analysis_details.color_scheme.replace('_', ' ')}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/50">{t.wordsCount}</div>
                  <div className="text-lg font-semibold">{videoResult.analysis_details.words_count}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/50">{t.syncAccuracy}</div>
                  <div className="text-lg font-semibold">{videoResult.analysis_details.sync_accuracy}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/50">{t.timelineBlocks}</div>
                  <div className="text-lg font-semibold">{videoResult.analysis_details.timeline_blocks}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/50">{t.beatsCount}</div>
                  <div className="text-lg font-semibold">{videoResult.analysis_details.beats_count}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/50">{t.keyMoments}</div>
                  <div className="text-lg font-semibold">{videoResult.analysis_details.key_moments}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm text-white/50">{t.processingTime}</div>
                  <div className="text-lg font-semibold">{videoResult.processing_time}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 slide-in-up">
            {/* Video Upload Section */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">{t.uploadVideos}</label>
              <div
                className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors cursor-pointer"
                onDrop={(e) => {
                  e.preventDefault();
                  handleVideoUpload(e.dataTransfer.files);
                }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('video-upload')?.click()}
              >
                <Upload className="w-8 h-8 mx-auto mb-3 text-white/60" />
                <p className="text-white/80 mb-1">{t.dragAndDrop}</p>
                <p className="text-white/40 text-sm">{t.supportedVideoFormats}</p>
              </div>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => e.target.files && handleVideoUpload(e.target.files)}
                className="hidden"
              />
              
              {/* Uploaded Videos List */}
              {formData.videoFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {formData.videoFiles.map((video) => (
                    <div key={video.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <Video className="w-4 h-4 text-green-400" />
                        <span className="text-sm">{video.name}</span>
                        <span className="text-xs text-white/40">({(video.size / 1024 / 1024).toFixed(1)}MB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(video.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Upload Section */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-3">{t.uploadAudio}</label>
              <div
                className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-white/40 transition-colors cursor-pointer"
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files[0]) {
                    handleAudioUpload(e.dataTransfer.files[0]);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById('audio-upload')?.click()}
              >
                <Music className="w-8 h-8 mx-auto mb-3 text-white/60" />
                <p className="text-white/80 mb-1">{t.dragAndDrop}</p>
                <p className="text-white/40 text-sm">{t.supportedAudioFormats}</p>
              </div>
              <input
                id="audio-upload"
                type="file"
                accept="audio/*"
                onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0])}
                className="hidden"
              />
              
              {/* Uploaded Audio */}
              {formData.audioFile && (
                <div className="mt-4 flex items-center justify-between bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <Music className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">{formData.audioFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeAudio}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Audio Timing Section */}
            {formData.audioFile && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-3">{t.audioTiming}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1">{t.startTime}</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-white focus:outline-none focus:border-white/30 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1">{t.endTime}</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-white focus:outline-none focus:border-white/30 text-sm"
                    />
                  </div>
                </div>
                <div className="mt-2 text-xs text-white/40">
                  {t.totalDuration}: {formData.endTime - formData.startTime} {t.seconds}
                </div>
              </div>
            )}

            {/* Description Section */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">{t.describeVision}</label>
              <textarea
                value={formData.prompt}
                onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                placeholder={t.describePlaceholder}
                rows={4}
                className="w-full px-3 sm:px-4 py-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-white focus:outline-none focus:border-white/30 text-sm sm:text-base animated-input resize-none"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm shake">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base animated-button"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  {t.createVideoButton}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreatePage;
