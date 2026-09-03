# Music Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Раздел `/music/` с релизом месяца, архивом прошлых месяцев и блоком плейлистов.

**Architecture:** Релизы — коллекция `_music/` с `output: false`, плейлисты — `_data/playlists.yml`. Страница собирает три блока из этих двух источников. Обложки лежат локально в `assets/img/music/`.

**Tech Stack:** Jekyll, Liquid, vanilla CSS. Проверка — `bundle exec jekyll build` и скриншоты headless Chrome; юнит-тестов в проекте нет.

**Spec:** `docs/superpowers/specs/2026-09-03-music-section-design.md`

## Global Constraints

- Обложки: квадратные JPEG, до 40 KB, в `assets/img/music/`
- Собственные треки в `_logs/` не мигрируют и не редактируются
- Категория в данных остаётся `music`; переименовывается только подпись вкладки
- Стили дописываются в `assets/css/style.css`, отдельных файлов не заводится
- Комментарии в коде — по-русски, как в остальном проекте

---

### Task 1: Коллекция, данные и обложки

**Files:**
- Modify: `_config.yml`
- Create: `_music/2026-09-inferno.md`, `_music/2026-08-never-again.md`
- Create: `_data/playlists.yml`
- Create: `assets/img/music/2026-09-inferno.jpg`, `assets/img/music/2026-08-never-again.jpg`

**Interfaces:**
- Produces: `site.music` — коллекция с полями `title, artist, date, released, format, label, cover, link`; `site.data.playlists` — список с полями `name, link, cover, note`

- [ ] **Step 1: Объявить коллекцию**

```yaml
collections:
  bookmarks:
    output: true
  logs:
    output: true
  music:
    output: false
```

- [ ] **Step 2: Скачать обложки**

```bash
curl -s -o /tmp/inferno.jpg "https://f4.bcbits.com/img/a3190407865_10.jpg"
sips --resampleHeightWidth 300 300 /tmp/inferno.jpg --out /tmp/i2.jpg
sips -s format jpeg -s formatOptions 60 /tmp/i2.jpg --out assets/img/music/2026-09-inferno.jpg
```

То же для `a3390116066_10.jpg` → `2026-08-never-again.jpg`. Проверить вес: `ls -l assets/img/music/` — обе до 40 KB.

- [ ] **Step 3: Записи релизов**

```yaml
---
title: "Inferno"
artist: "Boards of Canada"
date: 2026-09-01
released: 2026-05-29
format: "Album"
label: "Warp"
cover: "/assets/img/music/2026-09-inferno.jpg"
link: https://boardsofcanada.bandcamp.com/album/inferno
---
```

- [ ] **Step 4: Пустой файл плейлистов**

`_data/playlists.yml` с комментарием о формате и пустым списком.

- [ ] **Step 5: Проверить сборку**

Run: `bundle exec jekyll build --quiet`
Expected: exit 0; `site.music` содержит 2 записи, отдельных страниц у них нет.

---

### Task 2: Страница `/music/`

**Files:**
- Create: `music.md`
- Modify: `assets/css/style.css`

**Interfaces:**
- Consumes: `site.music`, `site.data.playlists` из Task 1
- Produces: разметку с классами `.music-hero`, `.music-archive`, `.music-playlists`

- [ ] **Step 1: Разметка страницы**

Три блока: свежая запись (`site.music | sort: 'date' | last`) крупной карточкой, остальные — списком, плейлисты — сеткой. Блок плейлистов обёрнут в `{% if site.data.playlists.size > 0 %}`.

- [ ] **Step 2: Стили**

`.music-hero` — flex, обложка 240px слева; на 600px переключается в колонку. `.music-archive-row` — обложка 48px, повторяет ритм строк закладок. `.music-playlists` — grid в две колонки, одна на узком экране.

- [ ] **Step 3: Проверить сборку и вид**

Run: `bundle exec jekyll build --quiet`, затем скриншоты `/music/` в светлой и тёмной теме и при ширине 600px.
Expected: exit 0; Inferno крупной карточкой, Never Again в архиве, блока плейлистов нет.

---

### Task 3: Навигация

**Files:**
- Modify: `_includes/header_menu.html`
- Modify: `_includes/log_category_list.html`
- Modify: `logs/music.html`

**Interfaces:**
- Consumes: страницу `/music/` из Task 2

- [ ] **Step 1: Пункт меню**

```html
<a href="/music/"{% if page.url contains '/music' %} class="active"{% endif %}>Music</a>
```

Внимание: условие `contains '/music'` совпадёт и на `/logs/music/`. Проверить, что подсветка не двоится, — при необходимости сравнивать точным совпадением `page.url == '/music/'`.

- [ ] **Step 2: Переименовать вкладку логов в Tracks**

В `_includes/log_category_list.html` подпись категории `music` выводится через `{{ category | capitalize }}`. Добавить подмену подписи, не трогая значение категории.

- [ ] **Step 3: Заголовок страницы категории**

`logs/music.html` — `title: "Tracks"`, permalink не менять.

- [ ] **Step 4: Проверить**

Run: `bundle exec jekyll build --quiet`
Expected: exit 0; в меню три пункта; на `/logs/` вкладка называется Tracks, ведёт на `/logs/music/`; записи треков не изменились.

---

### Task 4: Финальная проверка

- [ ] **Step 1: Прогнать проверки из спеки**

- сборка exit 0
- `/music/` в светлой и тёмной теме
- ширина 600px: карточка релиза вертикально
- `/logs/music/` и записи треков не изменились (`git diff --stat _logs/`)
- обложки до 40 KB

- [ ] **Step 2: Коммит**

Отдельными коммитами: данные и страница, затем навигация.
