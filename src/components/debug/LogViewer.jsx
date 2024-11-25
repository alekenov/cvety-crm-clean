import React, { useState, useEffect } from 'react';
import { logger } from '@/services/logging/loggingService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

export function LogViewer() {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const updateLogs = () => {
      setLogs(logger.getLogs());
    };

    // Update logs initially
    updateLogs();

    // Set up an interval to update logs
    const interval = setInterval(updateLogs, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <Button
        className="fixed bottom-4 right-4 bg-gray-800 text-white"
        onClick={() => setIsVisible(true)}
      >
        Show Logs
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[600px] h-[400px] bg-gray-800 text-white p-4 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Application Logs</h3>
        <div className="space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logger.clearLogs()}
            className="text-white hover:text-gray-300"
          >
            Clear
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-300"
          >
            <X size={16} />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto font-mono text-sm bg-gray-900 p-2 rounded">
        {logs.map((log, index) => (
          <div key={index} className="whitespace-pre-wrap mb-1">
            {log}
          </div>
        ))}
      </div>
    </Card>
  );
}
