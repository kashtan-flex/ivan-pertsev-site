# Project Rules – Иван Перцев Сайт

## 1. Эталонная версия проекта

* Текущая эталонная desktop-версия главной страницы: `V52`.
* Любые новые изменения делаются только поверх `V52`.
* Перед любыми крупными правками обязательно создавать новый backup.

---

# 2. Структура проекта

```txt
assets/
  fonts/
  icons/
  img/

    home/
      background/
      portrait/

css/
  home.css

js/
  home.js

pages/
  home/
    home.html

backup/
  home/

docs/
  project-rules.md
```

---

# 3. Работа с GitHub

## После каждого изменения:

```txt
commit
↓
push
↓
обновление v= в Tilda
↓
Publish
```

## Commit naming

Использовать короткие понятные commit names:

```txt
Fix menu blur V52
Update layered animation V52
Create desktop final backup V52
```

---

# 4. Работа с Tilda

После любых изменений:

* CSS
* JS
* HTML

обязательно обновлять:

```txt
?v=NN
```

во ВСЕХ подключениях.

Пример:

```html
home.css?v=52
home.js?v=52
home.html?v=52
```

## Важно

Tilda сильно кэширует файлы.
Если не обновить `v=`:

* изменения могут не примениться;
* могут подгрузиться старые CSS/JS;
* могут появляться «фантомные баги».

---

# 5. Правила работы с кодом

## Главный принцип

ChatGPT всегда присылает:

* полный готовый файл;
* без «найди и замени»;
* без ручного редактирования отдельных строк.

Разрешённый формат:

```txt
Полностью замени файл home.css на этот код
```

Запрещённый формат:

```txt
Найди строку и замени её
```

---

# 6. Бэкапы

## Создавать backup:

* перед крупными изменениями;
* после завершения стабильного этапа.

## Формат backup:

```txt
home-v52-desktop-final.html
home-v52-desktop-final.css
home-v52-desktop-final.js
```

## Старые backup

* хранить только стабильные milestone версии;
* промежуточные сломанные версии удалять.

---

# 7. Главная страница

## Layered image system

Главная работает на layered-системе:

```txt
1. background base
2. background glow
3. portrait
4. dark overlay
5. content/menu
```

## Изображения

### Фон:

```txt
assets/img/home/background/
```

Файлы:

```txt
home-bg.webp
home-bg@2x.webp

home-bg-glow.webp
home-bg-glow@2x.webp
```

### Портрет:

```txt
assets/img/home/portrait/
```

Файлы:

```txt
home-portrait.png
home-portrait@2x.png
```

---

# 8. Правила экспорта изображений

## Background

Формат:

```txt
WebP
```

Размер:

```txt
2880×1600
```

Качество:

```txt
75–82
```

---

## Portrait

Формат:

```txt
PNG transparent
```

Размер:

```txt
2x от реального размера слоя
```

Качество:

```txt
максимальное
```

---

# 9. Анимации

## Главная

Порядок появления:

```txt
1. background base
2. portrait
3. background glow
4. title
5. subtitle
```

## Menu

Порядок появления:

```txt
1. socials
2. menu text
3. legal links
```

---

# 10. Menu rules

## Menu background

```txt
rgba(0,0,0,0.30)
blur 18–25px
noise overlay 35%
```

## Icons

Размер:

```txt
27×27 px
```

## Accordion arrows

Размер:

```txt
14×23 px
```

## Menu text colors

Основной:

```txt
#FFFFFF
```

Accordion links:

```txt
#69C9FF
```

Legal links:

```txt
rgba(255,255,255,.5)
```

---

# 11. Hover rules

Hover не делать через:

```txt
background-image swap
```

Только через:

```txt
opacity transition
::before / ::after
```

Это важно для:

* Safari;
* Retina;
* стабильного GPU rendering.

---

# 12. Pointer-events rules

Все overlay/menu pseudo-elements:

```css
pointer-events:none;
```

Interactive elements:

```css
pointer-events:auto;
```

Это критично для:

* соцсетей;
* VK;
* Telegram;
* hover states.

---

# 13. Desktop-first

Проект строится:

```txt
desktop-first
```

Базовое разрешение:

```txt
1440×800
```

---

# 14. Следующий этап проекта

Следующий этап:

```txt
mobile version
```

Этапы:

```txt
mobile layout
mobile menu
mobile animation
mobile optimization
```

---

# 15. Общие правила проекта

* Любые правки сначала обсуждаются.
* После стабильного результата создаётся backup.
* Не удалять старые assets до финального подтверждения.
* Любые изменения в layered images тестиров
