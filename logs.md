---
layout: log
title: LOG
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
  <small><b>{{ log.date | date: "%-d %B %Y" }}</b></small>
</div>
<div class="spacer"></div>
{% endfor %}