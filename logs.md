---
layout: page
title: LOGs
permalink: /logs/
---

{% include log_category_list.html %}

{% assign categories = "" %}

{% assign sorted_logs = site.logs | sort: 'date' | reverse %}
{% for log in sorted_logs %}
  {% assign categories = categories | append: log.category | append: "," %}
{% endfor %}

<div class="bubble yellow">
 💁‍♂️ On this page, I keep a log of my activities. Here’s the current statistics:
    {% assign unique_categories = categories | split: "," | uniq %}
    {% for category in unique_categories %}
      {% unless category == "" %}
        {% assign count = 0 %}
        {% for log in site.logs %}
          {% if log.category == category %}
            {% assign count = count | plus: 1 %}
          {% endif %}
        {% endfor %}
        
        {% case category %}
          {% when "movie" %}
            I watched <strong>{{ count }}</strong> movies,
          {% when "location" %}
            and visited <strong>{{ count }}</strong> places
          {% when "game" %}
            completed <strong>{{ count }}</strong> games,
          {% when "music" %}
            created <strong>{{ count }}</strong> music tracks
        {% endcase %}
      {% endunless %}
    {% endfor %}
</div>
<div class="spacer"></div>

{% assign sorted_logs = site.logs | sort: 'date' | reverse %}
{% assign current_month = "" %}
{% assign current_year = "" %}

{% for log in sorted_logs %}
  {% assign log_month = log.date | date: "%B" %}
  {% assign log_year = log.date | date: "%Y" %}

  {% if log_year != current_year %}
<div class="year-divider">{{ log_year }}</div>
    {% assign current_year = log_year %}
    {% assign current_month = "" %}
  {% endif %}

  {% if log_month != current_month %}
<div class="month-divider">{{ log_month }}</div>
    {% assign current_month = log_month %}
  {% endif %}

<div class="bubble">
  {% assign reversed_index = forloop.length | minus: forloop.index | plus: 1 %}

  {{ log.content | markdownify }}
  {% assign category = log.category %}
  {% include emoji_category.html %}

  <span class="badge"><a href="{{ site.baseurl }}/logs/{{ log.category }}">{{ emoji }} {{ category | capitalize }}</a></span>

  {% if log.images %}
  <div class="container-two-columns">
    <div class="content-two-columns">
      <span class="log-number"><a href="{{ log.url }}">#{{ reversed_index }}</a></span>/<small><b>{{ log.date | date: "%-d %B %Y" }}</b></small>
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
    <span class="log-number"><a href="{{ log.url }}">#{{ reversed_index }}</a></span>/<small><b>{{ log.date | date: "%-d %B %Y" }}</b></small>
  {% endif %}
</div>

<div class="spacer"></div>
{% endfor %}