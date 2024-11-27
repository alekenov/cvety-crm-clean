import React, { useState } from 'react';
import { Camera, Video, X } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { Card, CardContent } from '@/components/ui/card';

const MediaUpload = () => {
  const [media, setMedia] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const newMedia = files.map(file => ({
      id: Date.now() + Math.random(),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      file
    }));
    setMedia([...media, ...newMedia]);
  };

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
    addFiles(files);
  };

  const removeMedia = (id) => {
    setMedia(media.filter(item => item.id !== id));
  };

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