import React from 'react';
import { Copy } from 'lucide-react';

export const CodeExample = ({ code }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative">
      <button 
        onClick={copyToClipboard}
        className="absolute right-2 top-2 p-2 hover:bg-gray-100 rounded transition-colors"
        title="Копировать код"
      >
        <Copy size={16} />
      </button>
      <pre className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
        {code}
      </pre>
    </div>
  );
};
