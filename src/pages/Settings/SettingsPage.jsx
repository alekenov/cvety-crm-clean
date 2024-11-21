import React from 'react';
import { Outlet } from 'react-router-dom';
import PageLayout, { PageHeader } from '@/components/layout/PageLayout/PageLayout';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';

function SettingsPage() {
  return (
    <PageLayout
      header={
        <PageHeader title="Настройки">
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="icon">
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </PageHeader>
      }
    >
      <Outlet />
    </PageLayout>
  );
}

export default SettingsPage;