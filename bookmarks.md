---
layout: bookmark 
title: Bookmarks
permalink: /bookmarks/
---

<br/>
<div class="bookmarks-container">
{% for bookmark in site.bookmarks %}
<div class="bookmarks-bubble">
  {{ bookmark.content | markdownify }}
</div>
{% endfor %}
</div>

<div class="spacer"></div>