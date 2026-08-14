---
layout: page
---

{% include bookmark_import.html %}

<h2 class="font-mono">~lobanov-av.ru</h2>

{% assign all_tags = "" %}
{%- for post in site.posts -%}
  {%- for tag in post.tags -%}
    {%- assign all_tags = all_tags | append: tag | append: "," -%}
  {%- endfor -%}
{%- endfor -%}
{% assign unique_tags = all_tags | split: "," | uniq %}

<div class="bubble yellow font-mono">
{% capture markdown_content %}
👋 Hi! **I'm Aleksei**, a developer and electronic music enthusiast who enjoys [creating music](logs/music/) without a DAW. [Say hello](mailto:lobanov.aw@gmail.com) or keep reading. Here you'll find my [logs](logs/) — [movies](logs/movie/) and [games](logs/game) with short notes — and a collection of [bookmarks](bookmarks/) worth keeping.
{% endcapture %}
{{ markdown_content | markdownify }}
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

{% assign sorted_posts = site.posts | sort: 'date' | reverse %}

<table class="movie-list-table post-table">
  <thead>
    <tr>
      <th class="ml-title">Title</th>
      <th class="bm-tags">Tag</th>
      <th class="ml-date">Date</th>
    </tr>
  </thead>
  <tbody>
    {% for post in sorted_posts %}
    <tr class="bookmarks-bubble bm-row" data-tags="{% for tag in post.tags %}{{ tag | downcase }}{% if forloop.last == false %},{% endif %}{% endfor %}">
      <td class="post-list-content">
        {%- if post.icon %}<span class="post-icon" aria-hidden="true">{{ post.icon }}</span>{% endif -%}
        <a href="{{ post.url }}">{{ post.title }}</a>{% if post.superscript %}<small class="superscript">{{ post.superscript }}</small>{% endif %}
        {% if post.description %}<div class="post-list-desc">{{ post.description }}</div>{% endif %}
      </td>
      <td class="bm-tags">{% for tag in post.tags %}<span class="tag small" data-tag="{{ tag | downcase }}">{{ tag }}</span>{% endfor %}</td>
      <td class="ml-date">{{ post.date | date: "%b %Y" }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>
