import React, { useState } from 'react';
import PageLayout, { PageHeader, PageSection } from '../../components/layout/PageLayout/PageLayout';
import { FileText, Download, Filter, Calendar, Printer, Mail } from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import Badge from '../../components/ui/Badge/Badge';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null);
  
  const reports = {
    sales: [
      {
        id: 1,
        name: 'Продажи за месяц',
        type: 'sales',
        date: '2024-03-01',
        status: 'ready'
      },
      {
        id: 2,
        name: 'Популярные товары',
        type: 'products',
        date: '2024-03-01',
        status: 'ready'
      }
    ],
    inventory: [
      {
        id: 3,
        name: 'Остатки на складе',
        type: 'inventory',
        date: '2024-03-01',
        status: 'ready'
      },
      {
        id: 4,
        name: 'Ревизия за февраль',
        type: 'revision',
        date: '2024-02-28',
        status: 'ready'
      }
    ],
    clients: [
      {
        id: 5,
        name: 'База клиентов',
        type: 'clients',
        date: '2024-03-01',
        status: 'generating'
      }
    ]
  };

  const header = (
    <PageHeader title="Отчеты">
      <div className="flex items-center space-x-3">
        <Button variant="secondary" icon={<Calendar size={20} />}>
          Период
        </Button>
        <Button variant="secondary" icon={<Filter size={20} />}>
          Фильтры
        </Button>
        <Button variant="primary" icon={<FileText size={20} />}>
          Создать отчет
        </Button>
      </div>
    </PageHeader>
  );

  return (
    <PageLayout header={header}>
      <div className="grid grid-cols-3 gap-6">
        {/* Список отчетов */}
        <div className="space-y-6">
          <PageSection title="Продажи">
            {reports.sales.map(report => (
              <div 
                key={report.id}
                className={`
                  bg-white p-4 rounded-lg mb-4 cursor-pointer
                  ${selectedReport?.id === report.id ? 'ring-2 ring-blue-500' : ''}
                `}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge 
                    variant={report.status === 'ready' ? 'success' : 'warning'}
                  >
                    {report.status === 'ready' ? 'Готов' : 'Формируется'}
                  </Badge>
                </div>
              </div>
            ))}
          </PageSection>

          <PageSection title="Склад">
            {reports.inventory.map(report => (
              <div 
                key={report.id}
                className={`
                  bg-white p-4 rounded-lg mb-4 cursor-pointer
                  ${selectedReport?.id === report.id ? 'ring-2 ring-blue-500' : ''}
                `}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge 
                    variant={report.status === 'ready' ? 'success' : 'warning'}
                  >
                    {report.status === 'ready' ? 'Готов' : 'Формируется'}
                  </Badge>
                </div>
              </div>
            ))}
          </PageSection>

          <PageSection title="Клиенты">
            {reports.clients.map(report => (
              <div 
                key={report.id}
                className={`
                  bg-white p-4 rounded-lg mb-4 cursor-pointer
                  ${selectedReport?.id === report.id ? 'ring-2 ring-blue-500' : ''}
                `}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge 
                    variant={report.status === 'ready' ? 'success' : 'warning'}
                  >
                    {report.status === 'ready' ? 'Готов' : 'Формируется'}
                  </Badge>
                </div>
              </div>
            ))}
          </PageSection>
        </div>

        {/* Предпросмотр отчета */}
        <div className="col-span-2">
          <PageSection 
            title="Предпросмотр"
            actions={
              selectedReport?.status === 'ready' && (
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm" icon={<Mail size={16} />}>
                    Отправить
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Printer size={16} />}>
                    Печать
                  </Button>
                  <Button variant="primary" size="sm" icon={<Download size={16} />}>
                    Скачать
                  </Button>
                </div>
              )
            }
          >
            {selectedReport ? (
              <div className="bg-white p-6 rounded-lg min-h-[600px]">
                {/* Здесь будет содержимое отчета */}
                <div className="text-center text-gray-400">
                  Предпросмотр отчета "{selectedReport.name}"
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg min-h-[600px] flex items-center justify-center text-gray-400">
                Выберите отчет для просмотра
              </div>
            )}
          </PageSection>
        </div>
      </div>
    </PageLayout>
  );
} 