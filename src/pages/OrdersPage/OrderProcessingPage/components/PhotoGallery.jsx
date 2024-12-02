import React, { useState } from 'react';
import { Upload, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

export default function PhotoGallery({ orderId, onUpload, onDelete, onSend }) {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedPhotos = await onUpload(files);
      setPhotos([...photos, ...uploadedPhotos]);
      toast.success('Фотографии успешно загружены');
    } catch (error) {
      toast.error('Ошибка при загрузке фотографий');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photoId) => {
    try {
      await onDelete(photoId);
      setPhotos(photos.filter(photo => photo.id !== photoId));
      toast.success('Фотография удалена');
    } catch (error) {
      toast.error('Ошибка при удалении фотографии');
    }
  };

  const handleSend = async (photoId) => {
    try {
      await onSend(photoId);
      toast.success('Фотография отправлена клиенту');
    } catch (error) {
      toast.error('Ошибка при отправке фотографии');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Фотографии букета</h3>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          <label className="cursor-pointer">
            Загрузить фото
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="relative group">
            <img
              src={photo.url}
              alt="Фото букета"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:text-white hover:bg-blue-500/20"
                onClick={() => handleSend(photo.id)}
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:text-white hover:bg-red-500/20"
                onClick={() => handleDelete(photo.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {photos.length === 0 && !uploading && (
        <div className="text-center py-8 text-muted-foreground">
          Нет загруженных фотографий
        </div>
      )}

      {uploading && (
        <div className="text-center py-8 text-muted-foreground">
          Загрузка фотографий...
        </div>
      )}
    </div>
  );
}