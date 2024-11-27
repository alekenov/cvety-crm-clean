import React from 'react';
import { 
  Typography,
  H1, H2, H3, H4, H5, H6,
  Body,
  Caption,
  Overline
} from '../../components/ui/Typography';
import { TypographySection } from './components/TypographySection';
import { CodeExample } from './components/CodeExample';

const USAGE_EXAMPLE = `import { Typography, H1, Body, Caption } from 'components/ui/Typography';

function YourComponent() {
  return (
    <div>
      <H1>Главный заголовок</H1>
      <Typography variant="body" size="lg">
        Большой текст для важной информации
      </Typography>
      <Body>Обычный текст для основного контента</Body>
      <Typography variant="body" color="success">
        Успешное сообщение
      </Typography>
      <Caption>Дополнительная информация</Caption>
    </div>
  );
}`;

const TypographyPage = () => {
  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Заголовок страницы */}
      <div className="mb-8">
        <H1>Система типографики</H1>
        <Typography variant="body" color="secondary">
          Стандартизированные компоненты для текста и заголовков
        </Typography>
      </div>

      <div className="bg-white rounded-lg shadow p-8 space-y-12">
        {/* Заголовки */}
        <TypographySection title="Заголовки">
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16"><Caption>H1</Caption></div>
              <H1>Заголовок первого уровня</H1>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16"><Caption>H2</Caption></div>
              <H2>Заголовок второго уровня</H2>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16"><Caption>H3</Caption></div>
              <H3>Заголовок третьего уровня</H3>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16"><Caption>H4</Caption></div>
              <H4>Заголовок четвертого уровня</H4>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16"><Caption>H5</Caption></div>
              <H5>Заголовок пятого уровня</H5>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16"><Caption>H6</Caption></div>
              <H6>Заголовок шестого уровня</H6>
            </div>
          </div>
        </TypographySection>

        {/* Размеры текста */}
        <TypographySection title="Размеры текста">
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16"><Caption>XL</Caption></div>
              <Typography variant="body" size="xl">
                Большой текст для важных параграфов
              </Typography>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16"><Caption>LG</Caption></div>
              <Typography variant="body" size="lg">
                Увеличенный текст для акцентирования
              </Typography>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16"><Caption>Base</Caption></div>
              <Typography variant="body">
                Обычный текст для основного контента
              </Typography>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16"><Caption>SM</Caption></div>
              <Typography variant="body" size="sm">
                Уменьшенный текст для дополнительной информации
              </Typography>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16"><Caption>XS</Caption></div>
              <Typography variant="body" size="xs">
                Мелкий текст для технических деталей
              </Typography>
            </div>
          </div>
        </TypographySection>

        {/* Веса шрифта */}
        <TypographySection title="Веса шрифта">
          <div className="grid gap-6">
            {['bold', 'semibold', 'medium', 'normal', 'light'].map((weight) => (
              <div key={weight} className="flex items-center gap-4">
                <div className="w-24"><Caption>{weight}</Caption></div>
                <Typography variant="body" weight={weight}>
                  The quick brown fox jumps over the lazy dog
                </Typography>
              </div>
            ))}
          </div>
        </TypographySection>

        {/* Цвета текста */}
        <TypographySection title="Цвета текста">
          <div className="grid gap-6">
            {[
              { color: 'primary', label: 'Primary' },
              { color: 'secondary', label: 'Secondary' },
              { color: 'muted', label: 'Muted' },
              { color: 'success', label: 'Success' },
              { color: 'error', label: 'Error' },
              { color: 'warning', label: 'Warning' }
            ].map(({ color, label }) => (
              <div key={color} className="flex items-center gap-4">
                <div className="w-24"><Caption>{label}</Caption></div>
                <Typography variant="body" color={color}>
                  Пример текста с цветом {label}
                </Typography>
              </div>
            ))}
            <div className="flex items-center gap-4">
              <div className="w-24"><Caption>White</Caption></div>
              <div className="bg-gray-900 p-4 rounded flex-1">
                <Typography variant="body" color="white">
                  Белый текст на темном фоне
                </Typography>
              </div>
            </div>
          </div>
        </TypographySection>

        {/* Специальные стили */}
        <TypographySection title="Специальные стили">
          <div className="grid gap-6">
            <div className="flex items-center gap-4">
              <div className="w-24"><Caption>Caption</Caption></div>
              <Caption>
                Мелкий текст для подписей и пояснений
              </Caption>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24"><Caption>Overline</Caption></div>
              <Overline>
                ТЕКСТ ДЛЯ МЕТОК И КАТЕГОРИЙ
              </Overline>
            </div>
          </div>
        </TypographySection>
      </div>

      {/* Примеры использования */}
      <div className="mt-8 space-y-4 p-6 bg-white rounded-lg shadow">
        <H3>Как использовать</H3>
        <CodeExample code={USAGE_EXAMPLE} />
      </div>
    </div>
  );
};

export default TypographyPage;
