---
layout: bookmark 
title: Bookmarks
permalink: /bookmarks/
---

<div class="bubble">
{% capture markdown_content %}
💁 Here I collect links to various utilities, applications and sites that are useful to me.
{% endcapture %}
{{ markdown_content | markdownify }}
</div>

<div class="bookmarks-container">
{% assign sorted_bookmarks = site.bookmarks | sort: 'date' | reverse %}
{% for bookmark in sorted_bookmarks %}
<div class="bookmarks-bubble">
  {{ bookmark.content | markdownify }}

<div class="spacer"></div>

  {% for tag in bookmark.tags %}
    <span class='tag small'>{{ tag }}</span>
  {% endfor %}
</div>
{% endfor %}
</div>

<div class="spacer"></div>
