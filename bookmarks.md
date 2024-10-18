---
layout: bookmark 
title: Bookmarks
permalink: /bookmarks/
---

{% for bookmark in site.bookmarks %}
<div class="bubble">
  {{ bookmark.content | markdownify }}
</div>
{% endfor %}