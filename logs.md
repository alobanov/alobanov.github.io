---
layout: page
title: LOGs
permalink: /logs/
---

{% include log_category_list.html %}

{% comment %}
  location исключена из общего списка и из статистики: раздел раздаётся только
  по прямой ссылке. Сами записи при этом остаются доступными.
{% endcomment %}
{% assign visible_logs = site.logs | where_exp: "item", "item.category != 'location'" %}
{% assign sorted_logs = visible_logs | sort: 'date' | reverse %}
{% assign movie_count = site.logs | where: "category", "movie" | size %}
{% assign game_count = site.logs | where: "category", "game" | size %}
{% assign music_count = site.logs | where: "category", "music" | size %}
{% assign podcast_count = site.logs | where: "category", "podcast" | size %}

<div class="bubble yellow">
  💁‍♂️ On this page, I keep a log of my activities. Here's the current statistics:
  I watched <strong class="stat-c stat-c--movie">{{ movie_count }}</strong> movies,
  completed <strong class="stat-c stat-c--game">{{ game_count }}</strong> games,
  created <strong class="stat-c stat-c--music">{{ music_count }}</strong> music tracks,
  and keep up with <strong class="stat-c stat-c--podcast">{{ podcast_count }}</strong>
  {% if podcast_count == 1 %}podcast{% else %}podcasts{% endif %}.
  <hr class="bubble-sep">
  <p class="bubble-note">
    <span class="bubble-note-mark" aria-hidden="true">{% include log_highlight.html %}</span>
    <span class="bubble-note-copy">
      <span class="bubble-note-kicker">Recommended</span>
      <span class="bubble-note-body">Something I’d really push you to watch or play</span>
    </span>
  </p>
</div>


{%- comment -%}
  Оглавление по годам. Годы берутся из тех же записей, что и таблица, поэтому
  пункт не может указать на год, которого в списке нет.

  Своим пунктом идут только пять последних лет, весь хвост — одним диапазоном:
  у ранних годов по одной-две записи, и поштучно они занимали половину списка.
  Граница отсчитывается от свежего года, а не задана числом, поэтому список
  сдвигается сам и править его руками в следующем январе не придётся.
{%- endcomment -%}
{%- assign by_year = sorted_logs | group_by_exp: "item", "item.date | date: '%Y'" -%}
{%- assign single_years = by_year -%}
{%- assign merged_years = "" -%}
{%- if by_year.size > 5 -%}
  {%- assign single_years = by_year | slice: 0, 5 -%}
  {%- assign merged_years = by_year | slice: 5, by_year.size -%}
{%- endif -%}

<aside class="toc" aria-label="Years">
  <span class="toc-title">Years</span>
  <ol class="toc-list">
    {%- for year in single_years -%}
    <li><a class="toc-link" href="#year-{{ year.name }}" data-target="{{ year.name }}">{{ year.name }}<span class="toc-count">{{ year.items | size }}</span></a></li>
    {%- endfor -%}
    {%- if merged_years != "" -%}
      {%- assign merged_total = 0 -%}
      {%- for year in merged_years -%}
        {%- assign merged_total = merged_total | plus: year.items.size -%}
      {%- endfor -%}
      {%- assign newest_merged = merged_years | first -%}
      {%- assign oldest_merged = merged_years | last -%}
      {%- comment -%}
        Диапазон из одного года подписывается самим годом: «2015–2015» читается
        как опечатка.
      {%- endcomment -%}
      {%- if newest_merged.name == oldest_merged.name -%}
        {%- assign merged_label = newest_merged.name -%}
      {%- else -%}
        {%- assign merged_label = oldest_merged.name | append: "–" | append: newest_merged.name -%}
      {%- endif -%}
    <li><a class="toc-link" href="#year-{{ newest_merged.name }}" data-target="older">{{ merged_label }}<span class="toc-count">{{ merged_total }}</span></a></li>
    {%- endif -%}
  </ol>
</aside>

{%- comment -%}
  Порог склейки — самый ранний из годов, оставшихся своим пунктом: всё, что
  старше него, получает в таблице общий data-toc и подсвечивает диапазон.
{%- endcomment -%}
{%- assign merge_before = single_years | last -%}
{% include log_list.html items=sorted_logs show_category=true toc_merge_before=merge_before.name %}
