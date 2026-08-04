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
  I watched <strong>{{ movie_count }}</strong> movies,
  completed <strong>{{ game_count }}</strong> games,
  created <strong>{{ music_count }}</strong> music tracks
  and visited <strong>{{ location_count }}</strong> places.
</div>


{% include log_list.html items=sorted_logs show_category=true %}
