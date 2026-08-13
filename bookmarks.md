---
layout: bookmark 
title: Bookmarks
permalink: /bookmarks/
---

{% include bookmark_import.html %}

{% assign all_tags = "" %}
{%- for bookmark in site.bookmarks -%}
  {%- for tag in bookmark.tags -%}
    {%- assign all_tags = all_tags | append: tag | append: "," -%}
  {%- endfor -%}
{%- endfor -%}
{% assign unique_tags = all_tags | split: "," | uniq %}

<div class="bubble yellow font-mono">
  💁 Explore a curated collection of utilities, apps, and sites I find useful.
  <hr class="bubble-sep">
  <p class="bubble-note">
    <span class="bubble-note-copy">
      <span class="bubble-note-kicker">Filter by tag</span>
      <span class="post-tag-filter">
        {%- for tag in unique_tags %}{% if tag != "" %}<span class="tag small" data-tag="{{ tag | downcase }}">{{ tag }}</span>{% endif %}{% endfor -%}
        <span class="tag small tag-reset" id="reset">Reset</span>
      </span>
    </span>
  </p>
</div>

<div class="view-toggle" data-view-key="bookmarkView">
  <button class="view-btn" id="btn-cards" onclick="setView('cards')">Cards</button>
  <button class="view-btn active" id="btn-list" onclick="setView('list')">List</button>
</div>

{% assign sorted_bookmarks = site.bookmarks | sort: 'date' | reverse %}

<div id="view-cards">
  <div class="bookmarks-container">
  {% for bookmark in sorted_bookmarks %}
  <div class="bookmarks-bubble" data-tags="{% for tag in bookmark.tags %}{{ tag | downcase }}{% if forloop.last == false %},{% endif %}{% endfor %}">
    {%- include bookmark_body.html bookmark=bookmark -%}
    <div class="spacer"></div>
    {% for tag in bookmark.tags %}
      <span class='tag small'>{{ tag }}</span>
    {% endfor %}
  </div>
  {% endfor %}
  </div>
</div>

<div id="view-list">
  <table class="movie-list-table bm-list-table">
    <thead>
      <tr>
        <th class="ml-num">#</th>
        <th class="ml-title">Name</th>
        <th class="bm-tags">Tags</th>
      </tr>
    </thead>
    <tbody>
      {% for bookmark in sorted_bookmarks %}
      {% assign reversed_index = forloop.length | minus: forloop.index | plus: 1 %}
      <tr class="bookmarks-bubble bm-row" data-tags="{% for tag in bookmark.tags %}{{ tag | downcase }}{% if forloop.last == false %},{% endif %}{% endfor %}">
        <td class="ml-num">#{{ reversed_index }}</td>
        <td class="bm-content">{%- include bookmark_body.html bookmark=bookmark -%}</td>
        <td class="bm-tags">{% for tag in bookmark.tags %}<span class="tag small" data-tag="{{ tag | downcase }}">{{ tag }}</span>{% endfor %}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>

<div class="spacer"></div>
