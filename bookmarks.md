---
layout: bookmark 
title: Bookmarks
permalink: /bookmarks/
---

{% include bookmark_import.html %}

<div class="bubble">
{% capture markdown_content %}
💁 Explore a curated collection of utilities, apps, and sites I find useful.
{% endcapture %}
{{ markdown_content | markdownify }}

<div class="spacer"></div>

{% assign all_tags = "" %}
  {% for bookmark in site.bookmarks %}
    {% for tag in bookmark.tags %}
      {% assign all_tags = all_tags | append: tag | append: "," %}
    {% endfor %}
  {% endfor %}

  {% assign unique_tags = all_tags | split: "," | uniq %}
  <small><b>Tags:</b></small>
  {% for tag in unique_tags %}
    {% if tag != "" %}
      <span class='tag small' data-tag="{{ tag | downcase }}">{{ tag }}</span>
    {% endif %}
  {% endfor %}
| <span class='tag small' id="reset">❌ Reset</span>
</div>

<div class="view-toggle">
  <button class="view-btn" id="btn-cards" onclick="setView('cards')">Cards</button>
  <button class="view-btn active" id="btn-list" onclick="setView('list')">List</button>
</div>

{% assign sorted_bookmarks = site.bookmarks | sort: 'date' | reverse %}

<div id="view-cards">
  <div class="bookmarks-container">
  {% for bookmark in sorted_bookmarks %}
  <div class="bookmarks-bubble" data-tags="{% for tag in bookmark.tags %}{{ tag | downcase }}{% if forloop.last == false %},{% endif %}{% endfor %}">
    {{ bookmark.content | markdownify }}
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
        <th class="ml-date">Added</th>
      </tr>
    </thead>
    <tbody>
      {% for bookmark in sorted_bookmarks %}
      {% assign reversed_index = forloop.length | minus: forloop.index | plus: 1 %}
      <tr class="bookmarks-bubble bm-row" data-tags="{% for tag in bookmark.tags %}{{ tag | downcase }}{% if forloop.last == false %},{% endif %}{% endfor %}">
        <td class="ml-num">#{{ reversed_index }}</td>
        <td class="bm-content">{{ bookmark.content | markdownify }}</td>
        <td class="bm-tags">{% for tag in bookmark.tags %}<span class="tag small" data-tag="{{ tag | downcase }}">{{ tag }}</span>{% endfor %}</td>
        <td class="ml-date">{{ bookmark.date | date: "%b %Y" }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>

<div class="spacer"></div>

<script>
function setView(view) {
  document.getElementById('view-cards').style.display = view === 'cards' ? 'block' : 'none';
  document.getElementById('view-list').style.display  = view === 'list'  ? 'block' : 'none';
  document.getElementById('btn-cards').classList.toggle('active', view === 'cards');
  document.getElementById('btn-list').classList.toggle('active',  view === 'list');
  localStorage.setItem('bookmarkView', view);
}
const saved = localStorage.getItem('bookmarkView');
setView(saved || 'list');
</script>
