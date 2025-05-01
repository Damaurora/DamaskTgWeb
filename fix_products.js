// Скрипт для исправления структуры данных продуктов
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем файл storage.ts
const filePath = path.join(__dirname, 'server', 'storage.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Заменяем все вхождения availability: true на правильную структуру
content = content.replace(/availability: true/g, 'availabilityGagarina: true,\n        availabilityPobedy: true');

// Записываем изменения обратно в файл
fs.writeFileSync(filePath, content, 'utf8');

console.log('✓ Исправления внесены в файл storage.ts');