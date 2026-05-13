---
layout: page
---

{% include bookmark_import.html %}

<h2 class="font-mono">~lobanov-av.ru</h2>

<div class="bubble font-mono">
{% capture markdown_content %}
Hi! **I'm Aleksei**, a [developer](about_en/) and electronic music enthusiast who enjoys [creating music](logs/music/) without a DAW. [Say hello](mailto:lobanov.aw@gmail.com) or keep reading to explore more. Here, you'll find insights into my [logs](logs/), including [movies](logs/movie/) and [games](logs/game), complete with brief reviews and ratings. I also curate a collection of [bookmarks](bookmarks/) featuring tools and resources that I find useful.
{% endcapture %}
{{ markdown_content | markdownify }}
</div>

<div class="bubble font-mono">
<small>{% capture markdown_content %}Here you will find **posts**, you can filter them by tags. Enjoy your reading!{% endcapture %}{{ markdown_content | markdownify }}</small>

{% assign all_tags = "" %}
  {% for post in site.posts %}
    {% for tag in post.tags %}
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

{% assign sorted_posts = site.posts | sort: 'date' | reverse %}

<table class="movie-list-table">
  <thead>
    <tr>
      <th class="ml-num">#</th>
      <th class="ml-title">Title</th>
      <th class="bm-tags">Tag</th>
      <th class="ml-date">Date</th>
    </tr>
  </thead>
  <tbody>
    {% for post in sorted_posts %}
    {% assign reversed_index = forloop.length | minus: forloop.index | plus: 1 %}
    <tr class="bookmarks-bubble bm-row" data-tags="{% for tag in post.tags %}{{ tag | downcase }}{% if forloop.last == false %},{% endif %}{% endfor %}">
      <td class="ml-num">#{{ reversed_index }}</td>
      <td class="post-list-content">
        <a href="{{ post.url }}">{{ post.title }}</a>{% if post.superscript %} <small class="superscript">{{ post.superscript }}</small>{% endif %}
        {% if post.description %}<div class="post-list-desc">{{ post.description }}</div>{% endif %}
      </td>
      <td class="bm-tags">{% for tag in post.tags %}<span class="tag small" data-tag="{{ tag | downcase }}">{{ tag }}</span>{% endfor %}</td>
      <td class="ml-date">{{ post.date | date: "%b %Y" }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>
