---
layout: page
---

<div class="bubble">
{% capture markdown_content %}
Hi! I'm Aleksei, a developer and gamer.
Say hello, or keep reading.

<br />

---

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

---

{% endcapture %}
{{ markdown_content | markdownify }}
</div>