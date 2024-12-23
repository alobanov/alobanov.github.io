---
layout: bookmark 
title: Bookmarks
permalink: /bookmarks/
---

{% include bookmark_import.html %}

<div class="bubble blue">
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
<!-- <button id="reset">❌ Reset</button> -->
</div>

<div class="bookmarks-container">
{% assign sorted_bookmarks = site.bookmarks | sort: 'date' | reverse %}
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

<div class="spacer"></div>
