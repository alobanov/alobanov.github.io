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
{% for bookmark in site.bookmarks %}
<div class="bookmarks-bubble">
  {{ bookmark.content | markdownify }}
</div>
{% endfor %}
</div>

<div class="spacer"></div>
