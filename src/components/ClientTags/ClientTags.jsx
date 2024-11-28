import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ClientTags({ tags = [], onAddTag, onRemoveTag, editable = true }) {
  const [showInput, setShowInput] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
      setShowInput(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-blue-100 text-blue-800"
          >
            {tag}
            {editable && (
              <button
                onClick={() => onRemoveTag(tag)}
                className="ml-1.5 hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        {editable && !showInput && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInput(true)}
            className="text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Добавить тег
          </Button>
        )}
      </div>

      {showInput && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Новый тег"
            className="px-3 py-1 border rounded-lg text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddTag();
              }
            }}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddTag}
          >
            Добавить
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setNewTag('');
              setShowInput(false);
            }}
          >
            Отмена
          </Button>
        </div>
      )}
    </div>
  );
}
