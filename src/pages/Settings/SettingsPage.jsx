import React from 'react';
import { Outlet } from 'react-router-dom';
import PageLayout, { PageHeader } from '../../components/layout/PageLayout/PageLayout';

function SettingsPage() {
  return (
    <PageLayout
      header={<PageHeader title="Настройки" />}
    >
      <Outlet />
    </PageLayout>
  );
}

export default SettingsPage; 