---
layout: page
---

{% include bookmark_import.html %}

<body>

<h1>~lobanov-av.ru</h1>

<div class="bubble">
{% capture markdown_content %}
Hi! I'm Aleksei, a [developer](about_en/) and electronic music enthusiast who enjoys [creating music](logs/music/) without a DAW. [Say hello](mailto:lobanov.aw@gmail.com), or keep reading.
{% endcapture %}
{{ markdown_content | markdownify }}
</div>

<h1># Posts</h1>

<div class="bubble">

{% capture markdown_content %}
Select a **tag** to highlight related posts:
{% endcapture %}
{{ markdown_content | markdownify }}
<div class="spacer"></div>

{% assign all_tags = "" %}
  {% for post in site.posts %}
    {% for tag in post.tags %}
      {% assign all_tags = all_tags | append: tag | append: "," %}
    {% endfor %}
  {% endfor %}

  {% assign unique_tags = all_tags | split: "," | uniq %}
  <b>Tags:</b> 
  {% for tag in unique_tags %}
    {% if tag != "" %}
      <span class='tag small' data-tag="{{ tag | downcase }}">{{ tag }}</span>
    {% endif %}
  {% endfor %}

<div class="spacer"></div>

<button id="reset">❌ Reset</button>
</div>

<div class="bookmarks-container">
{% assign sorted_posts = site.posts | sort: 'date' | reverse %}
{% for post in sorted_posts %}
<div class="bookmarks-bubble" data-tags="{% for tag in post.tags %}{{ tag | downcase }}{% if forloop.last == false %},{% endif %}{% endfor %}">

<h3><a href="{{ post.url }}">{{ post.title }}</a> <small class="superscript">{{ post.superscript }}</small></h3>

{{ post.description | markdownify }}

<div class="spacer"></div>

{% for tag in post.tags %}
  <span class='tag small'>{{ tag }}</span>
{% endfor %}

<div class="spacer"></div>

<small><b>{{ post.date | date: "%-d %B %Y" }}</b></small>
</div>
{% endfor %}

</div>
</body>