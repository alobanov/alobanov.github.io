---
layout: log
title: LOGs
permalink: /logs/
---

{% include log_category_list.html %}

<br/>

{% assign sorted_logs = site.logs | sort: 'date' | reverse %}
{% for log in sorted_logs %}
<div class="bubble">
  {{ log.content | markdownify }}
  {% assign category = log.category %}
  {% include emoji_category.html %}

  <span class="badge"><a href="{{ site.baseurl }}/logs/{{ log.category }}">{{ emoji }} {{ category | capitalize }}</a></span>

  {% if log.images %}
  <div class="container-two-columns">
    <div class="content-two-columns">
      <small><b>{{ log.date | date: "%-d %B %Y" }}</b></small>
    </div>
    <div class="image-preview">
    {% for image in log.images %}
      <img src="/assets/img/{{ log.category }}/{{ image }}" alt="{{ log.title }} Preview" class="thumbnail"
                onclick="openModal('/assets/img/{{ log.category }}/{{ image }}')" />
    {% endfor %}
    </div>
  </div>
  {% else %}
    <div class="spacer"></div>
    <small><b>{{ log.date | date: "%-d %B %Y" }}</b></small>
  {% endif %}
</div>

<div class="spacer"></div>
{% endfor %}