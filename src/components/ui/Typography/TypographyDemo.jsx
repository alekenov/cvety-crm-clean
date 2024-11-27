import React from 'react';
import { Heading, Text, Label, Caption } from './Typography';

const TypographyDemo = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Заголовки */}
      <div className="space-y-4">
        <Heading level={1}>Заголовок первого уровня (H1)</Heading>
        <Heading level={2}>Заголовок второго уровня (H2)</Heading>
        <Heading level={3}>Заголовок третьего уровня (H3)</Heading>
        <Heading level={4}>Заголовок четвертого уровня (H4)</Heading>
      </div>

      {/* Основной текст */}
      <div className="space-y-4">
        <Text size="lg">
          Большой текст - используется для важных параграфов или вводных текстов.
          Имеет увеличенный размер шрифта и межстрочный интервал.
        </Text>
        
        <Text>
          Обычный текст - основной размер для текстового контента. 
          Оптимален для чтения больших объемов информации.
        </Text>
        
        <Text size="sm">
          Маленький текст - используется для дополнительной информации,
          где не требуется акцентировать внимание читателя.
        </Text>
      </div>

      {/* Состояния текста */}
      <div className="space-y-2">
        <Text state="success">Успешное выполнение операции</Text>
        <Text state="error">Ошибка при выполнении операции</Text>
        <Text state="warning">Предупреждение о возможных проблемах</Text>
        <Text state="info">Информационное сообщение</Text>
        <Text state="disabled">Неактивное состояние текста</Text>
      </div>

      {/* Специальные стили */}
      <div className="space-y-2">
        <Label>Метка поля формы или заголовок группы</Label>
        <Caption>Мелкий текст для дополнительной информации или пояснений</Caption>
      </div>
    </div>
  );
};

export default TypographyDemo;
