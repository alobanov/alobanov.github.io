---
layout: page
title: LOGs
permalink: /logs/
---

{% include log_category_list.html %}

{% assign sorted_logs = site.logs | sort: 'date' | reverse %}
{% assign movie_count = site.logs | where: "category", "movie" | size %}
{% assign game_count = site.logs | where: "category", "game" | size %}
{% assign music_count = site.logs | where: "category", "music" | size %}
{% assign location_count = site.logs | where: "category", "location" | size %}

<div class="bubble yellow">
  💁‍♂️ On this page, I keep a log of my activities. Here's the current statistics:
  I watched <strong class="stat-c stat-c--movie">{{ movie_count }}</strong> movies,
  completed <strong class="stat-c stat-c--game">{{ game_count }}</strong> games,
  created <strong class="stat-c stat-c--music">{{ music_count }}</strong> music tracks
  and visited <strong class="stat-c stat-c--location">{{ location_count }}</strong> places.
  <hr class="bubble-sep">
  <p class="bubble-note">
    <span class="bubble-note-mark" aria-hidden="true">{% include log_highlight.html %}</span>
    <span class="bubble-note-copy">
      <span class="bubble-note-kicker">Recommended</span>
      <span class="bubble-note-body">Something I’d really push you to watch or play</span>
    </span>
  </p>
</div>


{% include log_list.html items=sorted_logs show_category=true %}
