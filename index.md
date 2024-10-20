---
layout: page
---

<div class="bubble">
{% capture markdown_content %}
Hi! I'm Aleksei, a [developer](about_en/) and electronic music enthusiast who enjoys [creating music](logs/music/) without a DAW. [Say hello](mailto:lobanov.aw@gmail.com), or keep reading.
{% endcapture %}
{{ markdown_content | markdownify }}
</div>

<div class="bubble">
{% capture markdown_content %}
> # Posts

<div class="spacer"></div>

<body>
{% for post in site.posts %}
    <a href="{{ post.url }}" class="article-title">
      {{ post.title }}
    </a>
    <br/>
    <small>{{ post.date | date: "%-d %B %Y" }}</small>
    {% if post.tags %}
      {% for tag in post.tags %}
          <span class="tag small">{{ tag }}</span>
      {% endfor %}
    {% endif %}
    <br/>
    <br/>
{% endfor %}
</body>

{% endcapture %}
{{ markdown_content | markdownify }}
</div>