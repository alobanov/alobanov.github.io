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
 💁‍♂️ On this page, I keep a log of my activities. Here's the current statistics:
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
            I watched <strong>{{ count }}</strong> movies.
          {% when "location" %}
            visited <strong>{{ count }}</strong> places,
          {% when "game" %}
            completed <strong>{{ count }}</strong> games,
          {% when "music" %}
            created <strong>{{ count }}</strong> music tracks,
        {% endcase %}
      {% endunless %}
    {% endfor %}
</div>
<div class="spacer"></div>

<div class="view-toggle">
  <button class="view-btn active" id="btn-cards" onclick="setView('cards')">Cards</button>
  <button class="view-btn" id="btn-list" onclick="setView('list')">List</button>
</div>

{% assign sorted_logs = site.logs | sort: 'date' | reverse %}

<div id="view-cards">
{% assign current_month = "" %}
{% assign current_year = "" %}
{% for log in sorted_logs %}
    {% include date_dividers.html 
        date=log.date 
        current_year=current_year 
        current_month=current_month 
    %}

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
</div>

<div id="view-list">
  <table class="movie-list-table">
    <thead>
      <tr>
        <th class="ml-num">#</th>
        <th class="ml-title">Title</th>
        <th class="ml-cat">Category</th>
        <th class="ml-date">Date</th>
      </tr>
    </thead>
    <tbody>
      {% assign current_year = "" %}
      {% for log in sorted_logs %}
      {% assign item_year = log.date | date: "%Y" %}
      {% if item_year != current_year %}
      {% assign current_year = item_year %}
      <tr class="ml-year-divider"><td colspan="4">{{ item_year }}</td></tr>
      {% endif %}
      {% assign reversed_index = forloop.length | minus: forloop.index | plus: 1 %}
      {% assign category = log.category %}
      {% include emoji_category.html %}
      <tr>
        <td class="ml-num">#{{ reversed_index }}</td>
        <td class="ml-title"><a href="{{ log.url }}">{{ log.title }}</a></td>
        <td class="ml-cat"><a href="{{ site.baseurl }}/logs/{{ log.category }}">{{ category | capitalize }}</a></td>
        <td class="ml-date">{{ log.date | date: "%b %Y" }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>

<script>
function setView(view) {
  document.getElementById('view-cards').style.display = view === 'cards' ? 'block' : 'none';
  document.getElementById('view-list').style.display  = view === 'list'  ? 'block' : 'none';
  document.getElementById('btn-cards').classList.toggle('active', view === 'cards');
  document.getElementById('btn-list').classList.toggle('active',  view === 'list');
  localStorage.setItem('allView', view);
}
var saved = localStorage.getItem('allView');
if (saved) setView(saved); else setView('cards');
</script>
