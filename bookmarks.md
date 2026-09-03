---
layout: bookmark 
title: Bookmarks
permalink: /bookmarks/
---

{% include bookmark_import.html %}

{%- comment -%}
  Порядок разделов задан руками, а не выведен из данных: по алфавиту Shell с его
  единственной закладкой встал бы в хвост сиротой, а по размеру — оторвался бы от
  Terminal, с которым читается как одно целое. Родственное держится рядом.

  Теги, не попавшие в список, дописываются следом, чтобы новая закладка с новым
  тегом не пропала со страницы молча.
{%- endcomment -%}
{%- assign section_order = "Terminal,Shell,Git,App,AI,Font,Web" | split: "," -%}

{%- assign all_tags = "" -%}
{%- for bookmark in site.bookmarks -%}
  {%- for tag in bookmark.tags -%}
    {%- assign all_tags = all_tags | append: tag | append: "," -%}
  {%- endfor -%}
{%- endfor -%}
{%- assign unique_tags = all_tags | split: "," | uniq -%}

{%- assign extra = "" -%}
{%- for tag in unique_tags -%}
  {%- unless section_order contains tag -%}
    {%- assign extra = extra | append: tag | append: "," -%}
  {%- endunless -%}
{%- endfor -%}
{%- assign extra_tags = extra | split: "," -%}
{%- assign sections = section_order | concat: extra_tags -%}

{%- assign filled = 0 -%}
{%- for section in sections -%}
  {%- assign in_section = site.bookmarks | where_exp: "b", "b.tags contains section" -%}
  {%- if in_section.size > 0 -%}{%- assign filled = filled | plus: 1 -%}{%- endif -%}
{%- endfor -%}
{%- assign oldest = site.bookmarks | sort: 'date' | first -%}

<div class="bubble yellow font-mono">
  💁 The stuff I actually reach for. Terminal tools that earned a permanent alias,
  fonts I stare at all day, and apps that quietly stayed once the trial ran out.
  Nothing here is sponsored — it is simply what survived.
  <hr class="bubble-sep">
  <p class="bubble-note">
    <span class="bubble-note-copy">
      <span class="bubble-note-kicker">What earns a spot</span>
      <span class="bubble-note-body">
        <strong class="bm-stat">{{ site.bookmarks | size }}</strong> tools in
        <strong class="bm-stat">{{ filled }}</strong> sections, kept since
        <strong class="bm-stat">{{ oldest.date | date: "%Y" }}</strong> — everything here
        stayed on my machine long enough to be worth passing on.
      </span>
    </span>
  </p>
</div>

{%- comment -%}
  Оглавление вынесено из потока: fixed справа от 600px-колонки .wrapper. На узких
  экранах прячется целиком — там ему негде встать, не наехав на текст.
{%- endcomment -%}
<aside class="toc" aria-label="Sections">
  <span class="toc-title">Sections</span>
  <ol class="toc-list">
    {%- for section in sections -%}
      {%- assign in_section = site.bookmarks | where_exp: "b", "b.tags contains section" -%}
      {%- if in_section.size > 0 -%}
      <li><a class="toc-link" href="#{{ section | downcase }}" data-target="{{ section | downcase }}">{{ section }}<span class="toc-count">{{ in_section.size }}</span></a></li>
      {%- endif -%}
    {%- endfor -%}
  </ol>
</aside>

  {%- for section in sections -%}
    {%- assign in_section = site.bookmarks | where_exp: "b", "b.tags contains section" | sort: 'date' | reverse -%}
    {%- if in_section.size > 0 -%}
  <section class="bm-section" id="{{ section | downcase }}" data-toc="{{ section | downcase }}">
    <h2 class="bm-section-head">{{ section }}<span class="bm-section-count">{{ in_section.size }}</span></h2>
    <table class="movie-list-table bm-list-table">
      <tbody>
        {% for bookmark in in_section %}
        <tr class="bookmarks-bubble bm-row">
          <td class="bm-content">{%- include bookmark_body.html bookmark=bookmark -%}</td>
          <td class="bm-date">{{ bookmark.date | date: "%b %Y" }}</td>
        </tr>
        {% endfor %}
      </tbody>
    </table>
  </section>
    {%- endif -%}
  {%- endfor -%}

<div class="spacer"></div>
