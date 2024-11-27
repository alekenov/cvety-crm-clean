import React, { 
  useState, 
  useEffect, 
  useCallback 
} from 'react';
import { logger } from '../services/logging/loggingService';
import { Camera, Video, X } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { Card, CardContent } from '@/components/ui/card';

const MediaUpload = ({ onUpload, maxFiles = 5, accept = 'image/*' }) => {
  const [media, setMedia] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(async (e) => {
    try {
      logger.log('MediaUpload', 'Выбор файлов для загрузки');
      const files = Array.from(e.target.files);

      if (files.length + media.length > maxFiles) {
        logger.warn('MediaUpload', 'Превышено максимальное количество файлов', { 
          selectedCount: files.length, 
          currentCount: media.length, 
          maxFiles 
        });
        // toast.error(`Максимальное количество файлов: ${maxFiles}`);
        return;
      }

      const validFiles = files.filter(file => {
        const isValidType = file.type.startsWith(accept.split(',')[0].trim());
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10 МБ

        if (!isValidType) {
          logger.warn('MediaUpload', 'Неподдерживаемый тип файла', { fileType: file.type });
        }

        if (!isValidSize) {
          logger.warn('MediaUpload', 'Файл слишком большой', { fileSize: file.size });
        }

        return isValidType && isValidSize;
      });

      const newMedia = validFiles.map(file => ({
        id: Date.now() + Math.random(),
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: URL.createObjectURL(file),
        file
      }));
      setMedia([...media, ...newMedia]);
      
      logger.log('MediaUpload', 'Файлы успешно выбраны', { 
        fileCount: validFiles.length 
      });

      if (onUpload) {
        onUpload(newMedia);
      }
    } catch (error) {
      logger.error('MediaUpload', 'Ошибка при выборе файлов', null, error);
      // toast.error('Ошибка при выборе файлов');
    }
  }, [media, maxFiles, onUpload]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileChange({ target: { files } });
  };

  const removeMedia = useCallback((id) => {
    try {
      logger.log('MediaUpload', 'Удаление файла', { fileName: media.find(item => item.id === id).file.name });
      setMedia(media.filter(item => item.id !== id));

      if (onUpload) {
        onUpload(media.filter(item => item.id !== id));
      }
    } catch (error) {
      logger.error('MediaUpload', 'Ошибка при удалении файла', { fileName: media.find(item => item.id === id).file.name }, error);
    }
  }, [media, onUpload]);

  return (
    <Card 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={isDragging ? 'border-blue-300 bg-blue-50' : ''}
    >
      <Card.Header>
        <Card.Title>Загрузка медиа</Card.Title>
      </Card.Header>

      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Input 
            type="file" 
            multiple 
            onChange={handleFileChange}
            className="hidden" 
            id="media-upload"
          />
          <label htmlFor="media-upload">
            <Button as="span" variant="outline">
              <Camera size={16} className="mr-2" /> Загрузить файлы
            </Button>
          </label>
        </div>

        <div className="grid grid-cols-4 gap-4 overflow-x-auto">
          {media.map((item) => (
            <div 
              key={item.id} 
              className="relative rounded-lg overflow-hidden shadow-sm"
            >
              {item.type === 'image' ? (
                <img 
                  src={item.url} 
                  alt="Uploaded" 
                  className="w-full h-32 object-cover" 
                />
              ) : (
                <video 
                  src={item.url} 
                  className="w-full h-32 object-cover" 
                  controls 
                />
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 bg-white/50 hover:bg-white/70"
                onClick={() => removeMedia(item.id)}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaUpload;