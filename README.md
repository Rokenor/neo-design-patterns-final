# Домашка - Фінальний проєкт

# «Генератор резюме з JSON‑опису»

## Опис завдання

У цьому фінальному домашньому завданні необхідно реалізувати генератор резюме, який демонструє застосування п'яти патернів проектування: Facade, Template Method, Factory Method, Composite, Decorator.

Завдання має на меті навчити вас:

- Правильно застосовувати патерни проектування в практичних сценаріях
- Створювати модульну, розширювану архітектуру
- Структурувати код з використанням патернів

Необхідно сформувати самодостатню HTML‑сторінку‑резюме, яка будується з єдиного джерела даних — файл `resume.json`. Усі стилі фіксовані у `styles.css`, сторонніх бібліотек або фреймворків не використовуємо. Після компіляції `main.ts` і відкриття `index.html` сторінка повинна безпомилково відобразити повне резюме, а проєкти з прапорцем `"isRecent": true` — підсвітити червоним.

## Структура проекту

```
/
├── index.html                  # Статичний макет сторінки
├── resume.json                 # Джерело даних для сторінки
├── vite.config.js              # Конфігурація Vite
├── tsconfig.json               # Конфігурація TypeScript
├── dist/                       # Директорія для збірки
└── src/
    ├── styles.css              # Базові стилі + .highlight
    ├── facade/
    │   └── ResumePage.ts       # Фасад проєкту
    ├── importer/
    │   ├── AbstractImporter.ts # Базовий Template Method
    │   └── ResumeImporter.ts   # Конкретна реалізація
    ├── blocks/                 # Конкретні блоки резюме
    │   ├── BlockFactory.ts     # Factory Method
    │   ├── HeaderBlock.ts
    │   ├── SummaryBlock.ts
    │   ├── ExperienceBlock.ts  # Composite‑контейнер
    │   ├── ProjectBlock.ts
    │   ├── EducationBlock.ts
    │   └── SkillsBlock.ts
    ├── decorators/
    │   └── HighlightDecorator.ts
    ├── models/
    │   └── ResumeModel.ts      # Типи внутрішньої моделі
    └── main.ts                 # Точка входу
```

## Реалізовані патерни

Нижче — як кожен із п'яти патернів реалізовано в коді.

### 1. Facade — `src/facade/ResumePage.ts`

`ResumePage` — єдина точка входу. Клієнту (`main.ts`) достатньо викликати
`new ResumePage().init("/resume.json")`, а вся складність прихована за фасадом:
завантаження JSON (`fetchData`), делегування обробки імпортеру, рендеринг і
обробка помилок. Внутрішні підсистеми клієнту не видно.

### 2. Template Method — `src/importer/AbstractImporter.ts` + `ResumeImporter.ts`

`AbstractImporter<T>` задає **незмінний скелет алгоритму** в методі `import()`:
`validate() → map() → render()`. Конкретні кроки оголошені як абстрактні методи,
а `ResumeImporter` їх реалізує: `validate()` перевіряє обов'язкові блоки,
`map()` перетворює «сирий» JSON на `ResumeModel`, `render()` будує DOM. Порядок
кроків змінити не можна — це гарантує базовий клас.

### 3. Factory Method — `src/blocks/BlockFactory.ts`

`BlockFactory.createBlock(type, model)` інкапсулює створення блоків: за рядком
`type` повертає потрібний об'єкт, що реалізує спільний інтерфейс
`IBlock { render(): HTMLElement }`. Клієнт (`ResumeImporter.render`) працює лише
з `IBlock` і не знає про конкретні класи блоків.

### 4. Composite — `src/blocks/ExperienceBlock.ts` + `ProjectBlock.ts`

`ExperienceBlock` — **контейнерний вузол**: рендерить секцію Experience і
додає дочірні `ProjectBlock` — **листові вузли**. Обидва реалізують спільний
інтерфейс `IBlock`, тому контейнер рендерить дітей однаково через `render()`,
складаючи дерево елементів.

### 5. Decorator — `src/decorators/HighlightDecorator.ts`

`HighlightDecorator` обгортає будь-який `IBlock` і **динамічно** додає клас
`highlight` (червоне виділення), не змінюючи внутрішньої структури блоку.
В `ExperienceBlock` проєкти з `isRecent: true` обгортаються декоратором, решта —
ні. Заміна `leaf` на `new HighlightDecorator(leaf)` прозора для клієнта, бо
інтерфейс той самий.

## Запуск проекту

1. Встановлення залежностей:

   ```bash
   npm install
   ```

2. Режим розробки:

   ```bash
   npm run dev
   ```

3. Збірка для продакшену:

   ```bash
   npm run build
   ```

4. Попередній перегляд збірки:
   ```bash
   npm run preview
   ```

## Компіляція та перегляд результату

- **Перевірка типів (компіляція TypeScript):**

  ```bash
  npm run typecheck   # tsc --noEmit — перевіряє типи без генерації файлів
  ```

- **Швидкий перегляд під час розробки:** `npm run dev` запускає Vite-сервер
  (зазвичай на `http://localhost:5173`) з гарячим перезавантаженням — відкрийте
  цю адресу в браузері й побачите згенероване резюме.

- **Перегляд продакшен-збірки:** `npm run build` компілює проєкт у теку `dist/`,
  після чого `npm run preview` піднімає локальний сервер для перегляду готової
  збірки.

## Як додати новий блок резюме

Розглянемо приклад блоку «Certificates». Завдяки патернам це 3 кроки:

1. **Додати дані** в `resume.json`:

   ```json
   "certificates": [
     { "title": "AWS Certified Developer", "issuer": "Amazon", "year": "2023" }
   ]
   ```

2. **Створити клас-блок** `src/blocks/CertificatesBlock.ts`, що реалізує `IBlock`:

   ```ts
   import { IBlock } from "./BlockFactory";

   export class CertificatesBlock implements IBlock {
     constructor(private items: { title: string; issuer: string; year: string }[]) {}

     render(): HTMLElement {
       const sec = document.createElement("section");
       sec.className = "section certificates";
       const h2 = document.createElement("h2");
       h2.textContent = "Certificates";
       sec.appendChild(h2);
       for (const c of this.items) {
         const p = document.createElement("p");
         p.textContent = `${c.title} — ${c.issuer}, ${c.year}`;
         sec.appendChild(p);
       }
       return sec;
     }
   }
   ```

3. **Зареєструвати блок** у `src/blocks/BlockFactory.ts` — додати тип в `BlockType`
   і одну гілку в `createBlock()`:

   ```ts
   export type BlockType =
     | "header" | "summary" | "experience"
     | "education" | "skills" | "certificates"; // ← новий тип

   // у createBlock(type, m):
   case "certificates":
     return new CertificatesBlock(m.certificates);
   ```

   Залишається додати поле `certificates` у `ResumeModel` (`src/models/ResumeModel.ts`),
   змапити його в `ResumeImporter.map()` і вписати `"certificates"` у масив `order`
   методу `render()` — там, де блок має з'явитися на сторінці.

Жоден інший код чіпати не потрібно: фабрика та рендеринг працюють через спільний
інтерфейс `IBlock`.

## Технології

- TypeScript
- Vite (збірка та розробка)
- Патерни проектування
- JSON для зберігання даних
- CSS для стилізації
