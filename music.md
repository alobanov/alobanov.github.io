---
layout: page
title: Music
permalink: /music/
---

{%- comment -%}
  Сортировка по date — это месяц выбора, а не дата релиза: в сентябрь может
  попасть альбом, вышедший в мае. Свежая запись идёт крупной карточкой, все
  остальные — списком под ней.
{%- endcomment -%}
{%- assign releases = site.music | sort: 'date' | reverse -%}
{%- assign current = releases | first -%}
{%- assign archive = releases | shift -%}
{%- assign favourites = site.music | where: "highlight", true -%}

<div class="bubble yellow font-mono">
  🎧 My favourite albums — the records I keep coming back to, whatever year they
  are from. One of them is pulled to the top each month, plus the playlists I live in.
  <hr class="bubble-sep">
  <p class="bubble-note">
    <span class="bubble-note-mark" aria-hidden="true">{% include log_highlight.html %}</span>
    <span class="bubble-note-copy">
      <span class="bubble-note-kicker">The essential ones</span>
      <span class="bubble-note-body"><strong class="bm-stat">{{ favourites | size }}</strong> of
      <strong class="bm-stat">{{ site.music | size }}</strong> carry the star — the handful that shaped what I listen to</span>
    </span>
  </p>
</div>

{%- if current -%}
<section class="music-hero{% if current.highlight %} is-favourite{% endif %}"
         style="--music-cover: url('{{ current.cover | relative_url }}')">
  {%- comment -%}
    data-modal-src подхватывает image_pop.js: клик открывает обложку во весь экран.
  {%- endcomment -%}
  <img class="music-cover" src="{{ current.cover | relative_url }}"
       data-modal-src="{{ current.cover | relative_url }}"
       title="Open the cover"
       alt="{{ current.artist }} — {{ current.title }} cover" width="264" height="264">
  <div class="music-hero-copy">
    <span class="music-kicker">Release of the month · {{ current.date | date: "%B %Y" }}</span>
    <h2 class="music-title">
      {%- if current.highlight %}{% include log_highlight.html %}{% endif -%}
      {{ current.title }}
    </h2>
    <p class="music-artist">{{ current.artist }}</p>
    {%- comment -%}
      Формат, лейбл и дата релиза — пилюлями, как теги в логах: три коротких
      факта строкой читаются хуже, чем три отдельных метки.
    {%- endcomment -%}
    <p class="music-pills">
      <span class="music-pill music-pill--format">{{ current.format }}</span>
      {%- if current.genre %}<span class="music-pill music-pill--genre">{{ current.genre }}</span>{% endif -%}
      <span class="music-pill">{{ current.label }}</span>
      <span class="music-pill">{{ current.released | date: "%b %Y" }}</span>
    </p>
    <div class="music-note log-note-body">{{ current.content | markdownify }}</div>
    {% include music_links.html release=current %}
  </div>
</section>
{%- endif -%}

{%- if archive.size > 0 -%}
{%- comment -%}
  Архив собран той же разметкой, что таблица логов: классы log-entry-group,
  log-row и log-detail-* уже обслуживаются view_toggle.js и общими стилями,
  поэтому строка раскрывается по клику без единой новой строки скрипта.

  Список — сами любимые альбомы, а не архив прошлых месяцев: релиз месяца это
  одна из тех же записей, просто вынесенная наверх. Поэтому нумерация сквозная
  по всей коллекции и не начинается заново.
{%- endcomment -%}
<section class="music-archive">
  <h2 class="bm-section-head">Favourites<span class="bm-section-count">{{ archive.size }}</span></h2>
  <table class="log-table music-archive-table">
    {%- for release in archive -%}
    {%- assign entry_number = archive.size | minus: forloop.index | plus: 1 -%}
    <tbody class="log-entry-group{% if release.highlight %} is-highlight{% endif %}">
      <tr class="log-row" role="button" tabindex="0" aria-expanded="false">
        <td class="log-col-num">#{{ entry_number }}</td>
        <td class="music-col-cover">
          <img class="music-row-cover" src="{{ release.cover | relative_url }}"
               data-modal-src="{{ release.cover | relative_url }}"
               title="Open the cover"
               alt="{{ release.artist }} — {{ release.title }} cover" width="48" height="48" loading="lazy">
        </td>
        <td class="log-col-title">
          <div class="log-title-row">
            {%- if release.highlight %}{% include log_highlight.html %}{% endif -%}
            <span class="log-title" title="{{ release.title }}">{{ release.title }}</span>
            {%- if release.spotify %}
            <a class="log-ext" href="{{ release.spotify }}" target="_blank" rel="noopener"
               aria-label="{{ release.title }} on Spotify">Spotify</a>
            {%- endif -%}
          </div>
          <div class="log-subtitle-row">
            <span class="log-sub-verdict">{{ release.artist }}</span>
            <span class="log-sub-genre">{{ release.format }}</span>
            {%- if release.genre %}<span class="log-sub-tag">{{ release.genre }}</span>{% endif -%}
            <span class="music-sub-label">{{ release.label }}</span>
          </div>
        </td>
        {%- comment -%}
          Месяц и год в два яруса: одной строкой они занимали всю ширину колонки,
          а год повторяется от записи к записи и не должен быть таким же громким.
        {%- endcomment -%}
        <td class="log-col-date music-col-date">
          <span class="music-date-month">{{ release.date | date: "%b" }}</span>
          <span class="music-date-year">{{ release.date | date: "%Y" }}</span>
        </td>
      </tr>

      <tr class="log-detail-row">
        <td colspan="4" class="log-detail-cell">
          <div class="log-detail-wrap">
            <div class="log-detail-inner" inert>
              <div class="log-detail-body">
                <div class="log-detail-main">
                  <div class="log-note-body">{{ release.content | markdownify }}</div>
                  <p class="music-pills">
                    <span class="music-pill music-pill--format">{{ release.format }}</span>
                    {%- if release.genre %}<span class="music-pill music-pill--genre">{{ release.genre }}</span>{% endif -%}
                    <span class="music-pill">{{ release.label }}</span>
                    <span class="music-pill">released {{ release.released | date: "%-d %b %Y" }}</span>
                  </p>
                  {% include music_links.html release=release %}
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
    {%- endfor -%}
  </table>
</section>
{%- endif -%}

{%- comment -%}
  Блок появляется сам, как только в _data/playlists.yml окажется первая запись.
{%- endcomment -%}
{%- if site.data.playlists.size > 0 -%}
<section class="music-playlists">
  <h2 class="bm-section-head">Playlists<span class="bm-section-count">{{ site.data.playlists.size }}</span></h2>
  <div class="music-grid">
    {%- for playlist in site.data.playlists -%}
    <a class="music-card" href="{{ playlist.link }}" rel="noopener">
      <img class="music-card-cover" src="{{ playlist.cover | relative_url }}"
           alt="{{ playlist.name }} cover" width="120" height="120" loading="lazy">
      <span class="music-card-copy">
        <span class="music-card-title">{{ playlist.name }}</span>
        {%- if playlist.note %}<span class="music-card-note">{{ playlist.note }}</span>{% endif -%}
      </span>
    </a>
    {%- endfor -%}
  </div>
</section>
{%- endif -%}

{% include image_modal.html %}
<script src="{{ "/assets/js/image_pop.js" | relative_url }}"></script>

<div class="spacer"></div>
