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
👋 Hi! **I'm Aleksei**, a [developer](about_en/) and electronic music enthusiast who enjoys [creating music](logs/music/) without a DAW. [Say hello](mailto:lobanov.aw@gmail.com) or keep reading. Here you'll find my [logs](logs/) — [movies](logs/movie/), [games](logs/game) and [places](logs/location/) with short notes — and a collection of [bookmarks](bookmarks/) worth keeping.
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
      <th class="ml-num">#</th>
      <th class="ml-title">Title</th>
      <th class="bm-tags">Tag</th>
      <th class="ml-date">Date</th>
    </tr>
  </thead>
  <tbody>
    {%- assign current_year = "" -%}
    {% for post in sorted_posts %}
    {%- assign post_year = post.date | date: "%Y" -%}
    {%- if post_year != current_year -%}
      {%- assign current_year = post_year -%}
    <tr class="post-year-row" data-year="{{ post_year }}">
      <th colspan="4" scope="rowgroup">{{ post_year }}</th>
    </tr>
    {%- endif -%}
    {% assign reversed_index = forloop.length | minus: forloop.index | plus: 1 %}
    <tr class="bookmarks-bubble bm-row" data-tags="{% for tag in post.tags %}{{ tag | downcase }}{% if forloop.last == false %},{% endif %}{% endfor %}">
      <td class="ml-num">#{{ reversed_index }}</td>
      <td class="post-list-content">
        <a href="{{ post.url }}">{{ post.title }}</a>{% if post.superscript %}<small class="superscript">{{ post.superscript }}</small>{% endif %}
        {% if post.description %}<div class="post-list-desc">{{ post.description }}</div>{% endif %}
      </td>
      <td class="bm-tags">{% for tag in post.tags %}<span class="tag small" data-tag="{{ tag | downcase }}">{{ tag }}</span>{% endfor %}</td>
      <td class="ml-date">{{ post.date | date: "%b" }}</td>
    </tr>
    {% endfor %}
  </tbody>
</table>
